import { Router, json } from 'express';

const router = new Router();
router.use(json());

router.get('/test', async (req, res, next) => {
  try {
    // const result = await something();

    res.json({
      action: 'doing something',
    });
  }
  catch(err) {
    console.log('>> ERROR', typeof err);
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
