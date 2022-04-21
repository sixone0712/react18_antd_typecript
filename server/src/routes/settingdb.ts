import { NextFunction, Request, Response } from 'express';
import { createQueryBuilder, getManager } from 'typeorm';
import { SettingDB } from '../entity/SettingDB';
import { Site } from '../entity/Site';
import express = require('express');
import sleep from '../utils/sleep';

const router = express.Router();

router.get('/host', async (req: Request, res: Response, next: NextFunction) => {
  const db = await createQueryBuilder<SettingDB>('setting_db').getOne();

  await sleep(3000);

  res.json({
    address: db.address,
    port: db.port,
    user: db.user,
    password: db.password,
  });
});

router.post('/host', async (req: Request, res: Response, next: NextFunction) => {
  const db = await createQueryBuilder<SettingDB>('setting_db')
    .update(SettingDB)
    .set({ ...req.body })
    .execute();

  res.send('ok');
});

router.get('/sites', async (req: Request, res: Response, next: NextFunction) => {
  const site = getManager().getRepository(Site);
  const result = await site.find();
  res.send(result);
});

export default router;
