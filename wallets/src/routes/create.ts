import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@sawallet/common';

import { Wallet } from '../models/wallet';

const router = express.Router();

router.post(
  '/api/wallets',
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
    const { name } = req.body;

    const wallet = Wallet.build({
      name,
      ownerId: req.currentUser!.id,
    });

    await wallet.save();

    res.status(201).send(wallet);
  }
);

export { router as createWalletRouter };
