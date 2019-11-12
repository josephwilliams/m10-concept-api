import { Router, json } from 'express';
import getUserDataByEmail from './api/getUserDataByEmail';
const router = new Router();
router.use(json());

router.get('/user/:userEmail', async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    const result = await getUserDataByEmail(userEmail);
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err,
    });
    next(err);
  }
});

router.post('/upload-funds', async (req, res, next) => {
  try {
    const { userEmail, amount } = req.body;
    const result = await uploadFundsToUser({ userEmail, amount });
    res.json(result);
  }
  catch(err) {
    res.json({
      error: err,
    });
    next(err);
  }
});

router.get('/status', (req, res, next) => {
  res.json({ status: 'ok' });
  next();
});

export default router;
