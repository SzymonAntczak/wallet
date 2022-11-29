import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@sawallet/common';

import { natsWrapper } from '../nats-wrapper';
import { Wallet } from '../models/wallet';
import { WalletUpdatedPublisher } from '../events/publishers/wallet-updated-publisher';

const router = express.Router();

router.put(
  '/api/wallets/:id',
  requireAuth,
  [
    body('name')
      .isString()
      .withMessage('Name must be a string')
      .isLength({ min: 1 })
      .withMessage('Name must be at least 1 character'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      throw new NotFoundError();
    }

    if (wallet.ownerId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    wallet.set({ name: req.body.name });
    await wallet.save();

    new WalletUpdatedPublisher(natsWrapper.client).publish({
      id: wallet.id,
      name: wallet.name,
      ownerId: wallet.ownerId,
    });

    res.send(wallet);
  }
);

export { router as updateWalletRouter };
