import { Router } from 'express';
import controllers from './fixedExpense.controllers';

const router = Router();

router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.create);

router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.update)
  .delete(controllers.delOne);

export default router;
