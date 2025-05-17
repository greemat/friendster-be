import { Router } from 'express';
import { getApiKey } from '../controllers/submissionController';

const router = Router();

router.get('/getApiKey', getApiKey);

export default router;
