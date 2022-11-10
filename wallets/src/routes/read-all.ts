import express, { Request, Response } from 'express';
import { requireAuth } from '@sawallet/common';

import { Wallet } from '../models/wallet';

const router = express.Router();

router.get('/api/wallets', requireAuth, async (req: Request, res: Response) => {
  const wallets = await Wallet.find({ ownerId: req.currentUser!.id });

  res.send(wallets);
});

export { router as readWalletsRouter };
