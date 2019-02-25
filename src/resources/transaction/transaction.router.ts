import { Router } from 'express';
import controllers from './transaction.controllers';

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

router.route('/info/vendors').get(controllers.getVendors);

export default router;
