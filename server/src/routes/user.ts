import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import express = require('express');
import { User } from '../entity/User';

const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const user = await getManager().getRepository(User);
  const userList = await user.find();
  res.json(userList);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { name, password, permission } = req.body;

  res.json({
    name,
    password,
    permission,
  });
});
export default router;
