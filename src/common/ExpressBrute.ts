import ExpressBrute from 'express-brute';
import MongooseStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';
import mongoose from 'mongoose';
import moment from 'moment';
import HttpException from './HttpException';

const model = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));
const store = new MongooseStore(model);

const handleStoreError = (error: any) => {
  console.error(error); // log this error so we can figure out what went wrong
  // cause node to exit, hopefully restarting the process fixes the problem
  throw {
    message: error.message,
    parent: error.parent,
  };
};

const failCallback = function (req: any, res: any, next: any, nextValidRequestDate: any) {
  moment.locale('fr');
  return res.status(429).json({ error: true, message: `Veuillez rééssayer ${moment(nextValidRequestDate).fromNow()}` });
};

export const userBruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback: failCallback,
  handleStoreError: handleStoreError,
});

export const globalBruteforce = new ExpressBrute(store, {
  freeRetries: 500,
  attachResetToRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
  failCallback: failCallback,
  handleStoreError: handleStoreError,
});
