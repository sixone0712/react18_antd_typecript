import { NextFunction, Request, Response } from 'express';
import { createQueryBuilder } from 'typeorm';
import { Job } from '../entity/Job';
import sleep from '../utils/sleep';
import express = require('express');

const router = express.Router();
router.get('/remote', async (req: Request, res: Response, next: NextFunction) => {
  const foundJob = await createQueryBuilder<Job>('Job')
    .leftJoinAndSelect('Job.siteId', 'siteId')
    .leftJoinAndSelect('Job.collectStatus', 'sicollectStatuste')
    .leftJoinAndSelect('Job.errorSummaryStatus', 'errorSummaryStatus')
    .leftJoinAndSelect('Job.crasDataStatus', 'crasDataStatus')
    .leftJoinAndSelect('Job.mpaVersionStatus', 'mpaVersionStatus')
    .leftJoinAndSelect('Job.jobType', 'jobType')
    .where('jobType.fullString = :fullString', { fullString: 'remote' })
    .getMany();

  const response = foundJob.map((item, idx) => ({
    jobId: item.id,
    stop: item.stop,
    siteId: item.siteId.siteId,
    siteName: item.siteId.crasSiteName,
    collectStatus: item.collectStatus.status,
    errorSummaryStatus: item.errorSummaryStatus.status,
    crasDataStatus: item.crasDataStatus.status,
    mpaVersionStatus: item.mpaVersionStatus.status,
  }));

  // await sleep(1000);

  res.json(response);
});

router.get('/remote/:id(\\d+)/', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const foundJob = await createQueryBuilder<Job>('Job')
    .leftJoinAndSelect('Job.siteId', 'siteId')
    .leftJoinAndSelect('Job.collectStatus', 'sicollectStatuste')
    .leftJoinAndSelect('Job.errorSummaryStatus', 'errorSummaryStatus')
    .leftJoinAndSelect('Job.crasDataStatus', 'crasDataStatus')
    .leftJoinAndSelect('Job.mpaVersionStatus', 'mpaVersionStatus')
    .leftJoinAndSelect('Job.jobType', 'jobType')
    .leftJoinAndSelect('Job.owner', 'owner')
    .leftJoinAndSelect('Job.notification', 'notification')
    .leftJoinAndSelect('notification.errorSummaryEmail', 'errorSummaryEmail')
    .leftJoinAndSelect('notification.crasDataEmail', 'crasDataEmail')
    .leftJoinAndSelect('notification.mpaVersionEmail', 'mpaVersionEmail')
    .where('Job.id = :id', { id: id })
    .getOne();

  const response = {
    jobId: foundJob.id,
    siteName: foundJob.siteId.crasSiteName,
    isErrorSummary: foundJob.notification.isErrorSummary,
    errorSummary: {
      recipients: foundJob.notification.errorSummaryEmail.recipients,
      subject: foundJob.notification.errorSummaryEmail.subject,
      body: foundJob.notification.errorSummaryEmail.body,
    },
    isCrasData: foundJob.notification.isCrasData,
    crasData: {
      recipients: foundJob.notification.crasDataEmail.recipients,
      subject: foundJob.notification.crasDataEmail.subject,
      body: foundJob.notification.crasDataEmail.body,
    },
    isMpaVersion: foundJob.notification.isMpaVersion,
    mpaVersion: {
      recipients: foundJob.notification.mpaVersionEmail.recipients,
      subject: foundJob.notification.mpaVersionEmail.subject,
      body: foundJob.notification.mpaVersionEmail.body,
    },
    planIds: foundJob.planids,
    sendingTimes: foundJob.notification.sending_times,
    before: foundJob.notification.before,
  };

  // await sleep(1000);

  res.json(response);
});

router.get('/local', async (req: Request, res: Response, next: NextFunction) => {
  const foundJob = await createQueryBuilder<Job>('Job')
    .leftJoinAndSelect('Job.siteId', 'siteId')
    .leftJoinAndSelect('Job.collectStatus', 'collectStatus')
    .leftJoinAndSelect('Job.jobType', 'jobType')
    .where('jobType.fullString = :fullString', { fullString: 'local' })
    .getMany();

  const response = foundJob.map((item, idx) => ({
    jobId: item.id,
    siteName: item.siteId.crasSiteName,
    collectStatus: item.collectStatus.status,
    fileIds: item.fileIds,
    fileNames: item.fileNames,
  }));

  // await sleep(1000);

  res.json(response);
});

router.post('/local', async (req: Request, res: Response, next: NextFunction) => {
  await sleep(3000);
  res.json({
    id: 9999,
  });
});

router.get('/local', async (req: Request, res: Response, next: NextFunction) => {
  await sleep(3000);
  res.json({
    id: 9999,
  });
});

router.get(
  ['/remote/:jobId/histories/:stepType', '/local/:jobId/histories/:stepType'],
  async (req: Request, res: Response, next: NextFunction) => {
    await sleep(3000);
    res.json([
      {
        id: 1,
        status: 'canceled',
        name: '2020-05-01 11:13',
      },
      {
        id: 2,
        status: 'failure',
        name: '2020-05-02 11:13',
      },
      {
        id: 3,
        status: 'success',
        name: '2020-05-03 11:13',
      },
      {
        id: 4,
        status: 'success',
        name: '2020-05-04 11:13',
      },
      {
        id: 5,
        status: 'success',
        name: '2020-05-05 11:13',
      },
      {
        id: 6,
        status: 'success',
        name: '2020-05-06 11:13',
      },
      {
        id: 7,
        status: 'success',
        name: '2020-05-07 11:13',
      },
      {
        id: 8,
        status: 'success',
        name: '2020-05-08 11:13',
      },
      {
        id: 9,
        status: 'success',
        name: '2020-05-09 11:13',
      },
      {
        id: 10,
        status: 'success',
        name: '2020-05-10 11:13',
      },
      {
        id: 11,
        status: 'success',
        name: '2020-05-11 11:13',
      },
      {
        id: 12,
        status: 'success',
        name: '2020-05-12 11:13',
      },
      {
        id: 13,
        status: 'success',
        name: '2020-05-13 11:13',
      },
      {
        id: 14,
        status: 'success',
        name: '2020-05-14 11:13',
      },
      {
        id: 15,
        status: 'success',
        name: '2020-05-15 11:13',
      },
      {
        id: 16,
        status: 'success',
        name: '2020-05-16 11:13',
      },
      {
        id: 17,
        status: 'success',
        name: '2020-05-17 11:13',
      },
      {
        id: 18,
        status: 'success',
        name: '2020-05-18 11:13',
      },
      {
        id: 19,
        status: 'success',
        name: '2020-05-19 11:13',
      },
      {
        id: 20,
        status: 'success',
        name: '2020-05-20 11:13',
      },
    ]);
  }
);

export default router;
