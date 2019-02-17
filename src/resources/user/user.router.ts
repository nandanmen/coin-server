import { Router } from 'express';
import { getMe, updateMe } from './user.controllers';

const router = Router();

router.get('/', getMe);
router.put('/', updateMe);

export default router;
