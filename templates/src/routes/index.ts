import mainConfigs from '@/config/env.config';
import { SuccessResponse } from '@/core/success.response';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  new SuccessResponse({
    message: mainConfigs.app.name + ' is running',
  }).send(res);
});

router.get('/health', (req, res) => {
  new SuccessResponse({}).send(res);
});

export default router;
