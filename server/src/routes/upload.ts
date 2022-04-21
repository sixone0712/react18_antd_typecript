import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import sleep from '../utils/sleep';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});

router.post('/', async (req, res) => {
  console.log('addjob');
  await sleep(2000);
  res.send({ id: '1234' });
});

router.post('/up', upload.array('zip'), (req, res) => {
  console.log(req.files);
});

router.post('/local', upload.single('file'), function (req, res) {
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
  res.json({
    path: '/uploads/' + req.file.filename,
  });
});

export default router;
