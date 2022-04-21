import { NextFunction, Request, Response } from 'express';
import { getManager } from 'typeorm';
import express = require('express');
import { User } from '../entity/User';
import { Site } from '../entity/Site';
import { Job } from '../entity/Job';
import { JobStatus } from '../entity/JobStatus';
import { JobNotification } from '../entity/JobNotification';
import { MailContext } from '../entity/MailContext';
import { v4 as uuidv4 } from 'uuid';
import { JobType } from '../entity/JobType';

const router = express.Router();

router.get('/db', async (req: Request, res: Response, next: NextFunction) => {
  const userManager = await getManager().getRepository(User);
  for (let i = 0; i < 30; i++) {
    const testUser = new User();
    testUser.name = `chpark_${i}`;
    testUser.password = 'password';
    testUser.created = new Date();
    testUser.lastAccess = new Date();
    testUser.permission = ['status', 'configure', 'rules', 'account'];
    await userManager.save(testUser);
  }

  const siteManager = await getManager().getRepository(Site);
  for (let i = 0; i < 30; i++) {
    const newSite = new Site();
    newSite.crasSiteName = `crasSiteName${i}`;
    newSite.crasAddress = `10.1.31.${i}`;
    newSite.crasPort = 80;
    newSite.emailAddress = `192.168.0.${i}`;
    newSite.emailUserName = `emailUserName${i}`;
    newSite.emailPort = 80;
    newSite.emailPassword = 'password';
    newSite.emailFrom = `test${i}@test.com`;
    newSite.rssAddress = `192.168.0.${i}`;
    newSite.rssUserName = `rssUserName${i}`;
    newSite.rssPort = 80;
    newSite.rssPassword = 'password';
    await siteManager.save(newSite);
  }

  res.json('ok');
});

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  await makeJobType();
  res.json('ok');
});

router.get('/job', async (req: Request, res: Response, next: NextFunction) => {
  await makeJobStatus();
  await makeJobType();

  const success = await getManager().getRepository(JobStatus).findOne({ status: 'success' });
  const failure = await getManager().getRepository(JobStatus).findOne({ status: 'failure' });
  const notbuild = await getManager().getRepository(JobStatus).findOne({ status: 'notbuild' });
  const processing = await getManager().getRepository(JobStatus).findOne({ status: 'processing' });
  const remoteJobType = await getManager().getRepository(JobType).findOne({ fullString: 'remote' });
  const localJobType = await getManager().getRepository(JobType).findOne({ fullString: 'local' });

  const statusArray = [success, failure, notbuild, processing];

  for (let i = 0; i < 30; i++) {
    const job = new Job();
    const ownerUser = await getManager()
      .getRepository(User)
      .findOne(i + 1);
    const site = await getManager()
      .getRepository(Site)
      .findOne(i + 1);

    job.siteId = site;
    job.collectStatus = statusArray[Math.floor(Math.random() * (3 - 0) + 0)];
    job.errorSummaryStatus = statusArray[Math.floor(Math.random() * (3 - 0) + 0)];
    job.crasDataStatus = statusArray[Math.floor(Math.random() * (3 - 0) + 0)];
    job.mpaVersionStatus = statusArray[Math.floor(Math.random() * (3 - 0) + 0)];
    job.stop = Math.floor(Math.random() * (1 - 0) + 0) ? true : false;
    job.owner = ownerUser;
    job.created = new Date();
    job.lastAction = new Date();
    job.jobType = remoteJobType;

    const notification = new JobNotification();
    notification.isErrorSummary = true;
    const errorSummaryEmail = new MailContext();
    errorSummaryEmail.recipients = ['chpark@canon.bs.co.kr', 'chpark2@canon.bs.co.kr'];
    errorSummaryEmail.subject = 'hello? errorSummaryEmail';
    errorSummaryEmail.body = 'this is body?';
    await getManager().getRepository(MailContext).save(errorSummaryEmail);
    notification.errorSummaryEmail = errorSummaryEmail;

    notification.isCrasData = true;
    const crasDataEmail = new MailContext();
    crasDataEmail.recipients = ['chpark@canon.bs.co.kr', 'chpark2@canon.bs.co.kr'];
    crasDataEmail.subject = 'hello? crasDataEmail';
    crasDataEmail.body = 'this is body?';
    await getManager().getRepository(MailContext).save(crasDataEmail);
    notification.crasDataEmail = crasDataEmail;

    notification.isMpaVersion = true;
    const mpaVersionEmail = new MailContext();
    mpaVersionEmail.recipients = ['chpark@canon.bs.co.kr', 'chpark2@canon.bs.co.kr'];
    mpaVersionEmail.subject = 'hello? version_email';
    mpaVersionEmail.body = 'this is body?';
    await getManager().getRepository(MailContext).save(mpaVersionEmail);
    notification.mpaVersionEmail = mpaVersionEmail;

    notification.sending_times = ['11:00', '23:00'];
    notification.before = 60 * 60 * 24;

    await getManager().getRepository(JobNotification).save(notification);
    job.notification = notification;
    job.planids = [2, 4, 6, 8];
    await getManager().getRepository(Job).save(job);
  }

  for (let i = 0; i < 30; i++) {
    const job = new Job();
    const ownerUser = await getManager()
      .getRepository(User)
      .findOne(i + 1);
    const site = await getManager()
      .getRepository(Site)
      .findOne(i + 1);

    job.siteId = site;
    job.collectStatus = statusArray[Math.floor(Math.random() * (3 - 0) + 0)];
    job.stop = false;
    job.owner = ownerUser;
    job.created = new Date();
    job.lastAction = new Date();
    job.jobType = localJobType;

    const max = Math.random() * (10 - 1) * 1;
    const fileNames = [];
    const fileIds = [];
    for (let j = 0; j < max; j++) {
      fileNames.push(`${generateString(16)}.zip`);
      fileIds.push(JSON.stringify(Math.floor(Math.random() * (999999 - 1) * 1)));
    }
    job.fileNames = fileNames;
    job.fileIds = fileIds;

    await getManager().getRepository(Job).save(job);
  }

  res.json('ok');
});

function generateString(bit) {
  const random_str = Math.random().toString(bit).substring(2, 15) + Math.random().toString(bit).substring(2, 15);
  return random_str;
}

async function makeJobStatus() {
  const processing = new JobStatus();
  processing.fullString = 'processing';
  processing.status = 'processing';
  processing.representString = 'processing';
  await getManager().getRepository(JobStatus).save(processing);

  const success = new JobStatus();
  success.fullString = 'success';
  success.status = 'success';
  success.representString = 'success';
  await getManager().getRepository(JobStatus).save(success);

  const failure = new JobStatus();
  failure.fullString = 'failure';
  failure.status = 'failure';
  failure.representString = 'failure';
  await getManager().getRepository(JobStatus).save(failure);

  const notbuild = new JobStatus();
  notbuild.fullString = 'notbuild';
  notbuild.status = 'notbuild';
  notbuild.representString = 'notbuild';
  await getManager().getRepository(JobStatus).save(notbuild);
}

async function makeJobType() {
  const remote = new JobType();
  remote.fullString = 'remote';
  remote.representString = 'remote';
  await getManager().getRepository(JobType).save(remote);

  const local = new JobType();
  local.fullString = 'local';
  local.representString = 'local';
  await getManager().getRepository(JobType).save(local);
}
export default router;
