import { Router, json } from 'express';
import getUserDataByEmail from './api/getUserDataByEmail';
import loadFundsToUser from './api/loadFundsToUser';
import unloadFundsOfUser from './api/unloadFundsOfUser';
import sendFundsToUser from './api/sendFundsToUser';

const router = new Router();
router.use(json());

import { redisClient } from './server';

router.get('/user/:userEmail', async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    const result = await getUserDataByEmail({
      userEmail,
      redisClient
    });
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err.toString(),
    });
    next(err);
  }
});

router.post('/load-funds', async (req, res, next) => {
  try {
    const { userEmail, userInstitution, amount } = req.body;
    const result = await loadFundsToUser({
      userEmail,
      userInstitution,
      amount,
      redisClient,
    });
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err.toString(),
    });
    next(err);
  }
});

router.post('/unload-funds', async (req, res, next) => {
  try {
    const { userEmail, userInstitution, amount } = req.body;
    const result = await unloadFundsOfUser({
      userEmail,
      userInstitution,
      amount,
      redisClient,
    });
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err.toString(),
    });
    next(err);
  }
});

router.post('/send-funds', async (req, res, next) => {
  try {
    const { userEmail, recipientEmail, userInstitution, amount } = req.body;
    const result = await sendFundsToUser({
      userEmail,
      recipientEmail,
      userInstitution,
      amount,
      redisClient,
    });
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err.toString(),
    });
    next(err);
  }
});

router.get('/status', (req, res, next) => {
  res.json({ status: 'ok' });
  next();
});

export default router;
