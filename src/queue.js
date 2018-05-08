'use strict';

// const Queue = require('bull');
// const path = require('path');
// const winston = require('winston');

// // const { PlayerEggSpawnJob, PlayerAdBonusJob, PlayerIncognitoJob, DepositCommandJob } = require('./models');

// const { REDIS_URL } = process.env;

// const logger = new winston.Logger({
//   transports: [
//     new (winston.transports.Console)(),
//     new (winston.transports.File)({ filename: path.join(__dirname, '..', 'log', 'queue.log') }),
//   ]
// });


//



// logger.info('Started queue processing');

// const playerEggSpawnQueue = new Queue('player_egg_spawn', REDIS_URL);
// const playerAdBonusQueue = new Queue('player_ad_bonus', REDIS_URL);
// const playerIncognitoQueue = new Queue('player_incognito', REDIS_URL);
// const depositCommandQueue = new Queue('deposit_command', REDIS_URL);

// playerEggSpawnQueue.process(async (job) => {

//   await PlayerEggSpawnJob.process(job, logger);
// });

// playerEggSpawnQueue.on('completed', async (job) => {

//   logger.info(`Completed processing egg spawn job #${job.id}`);

//   const playerEggSpawnJob = await PlayerEggSpawnJob.findOne({ where: { job_id: job.id } });
//   await playerEggSpawnJob.complete(job);
// });

// playerEggSpawnQueue.on('failed', async (job) => {

//   logger.info(`Failed processing egg spawn job #${job.id}`);

//   const playerEggSpawnJob = await PlayerEggSpawnJob.findOne({ where: { job_id: job.id } });
//   await playerEggSpawnJob.fail(job);
// });

// playerAdBonusQueue.process(async (job) => {

//   await PlayerAdBonusJob.process(job, logger);
// });

// playerAdBonusQueue.on('completed', async (job) => {

//   logger.info(`Completed processing ad bonus job #${job.id}`);

//   const playerAdBonusJob = await PlayerAdBonusJob.findOne({ where: { job_id: job.id } });
//   await playerAdBonusJob.complete(job);
// });

// playerAdBonusQueue.on('failed', async (job) => {

//   logger.info(`Failed processing ad bonus job #${job.id}`);

//   const playerAdBonusJob = await PlayerAdBonusJob.findOne({ where: { job_id: job.id } });
//   await playerAdBonusJob.fail(job);
// });

// playerIncognitoQueue.process(async (job) => {

//   await PlayerIncognitoJob.process(job, logger);
// });

// playerIncognitoQueue.on('completed', async (job) => {

//   logger.info(`Completed processing incognito job #${job.id}`);

//   const playerIncognitoJob = await PlayerIncognitoJob.findOne({ where: { job_id: job.id } });
//   await playerIncognitoJob.complete(job);
// });

// playerIncognitoQueue.on('failed', async (job) => {

//   logger.info(`Failed processing incognito job #${job.id}`);

//   const playerIncognitoJob = await PlayerIncognitoJob.findOne({ where: { job_id: job.id } });
//   await playerIncognitoJob.fail(job);
// });

// depositCommandQueue.process(async (job) => {

//   await DepositCommandJob.process(job, logger);
// });

// depositCommandQueue.on('completed', async (job) => {

//   logger.info(`Completed processing deposit command job #${job.id}`);

//   const depositCommandJob = await DepositCommandJob.findOne({ where: { job_id: job.id } });
//   await depositCommandJob.complete(job);
// });

// depositCommandQueue.on('failed', async (job) => {

//   logger.info(`Failed processing deposit command job #${job.id}`);

//   const depositCommandJob = await DepositCommandJob.findOne({ where: { job_id: job.id } });
//   await depositCommandJob.fail(job);
// });
