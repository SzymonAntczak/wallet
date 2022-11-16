import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@sawallet/common';

import { Wallet } from '../models/wallet';

const router = express.Router();

router.get(
  '/api/wallets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const wallet = await Wallet.findById(req.params.id);

    if (!wallet) {
      throw new NotFoundError();
    }

    res.send(wallet);
  }
);

export { router as readWalletRouter };
