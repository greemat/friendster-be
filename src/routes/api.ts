import { Router } from 'express';
import { getFirebaseConfig } from '../controllers/submissionController';

const router = Router();

router.get('/getFirebaseConfig', getFirebaseConfig);

export default router;

