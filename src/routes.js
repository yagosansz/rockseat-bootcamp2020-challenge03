import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import NotDeliveredController from './app/controllers/NotDeliveredController';
import DeliveriesController from './app/controllers/DeliveriesController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryEndController from './app/controllers/DeliveryEndController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelDeliveryWithProblemController from './app/controllers/CancelDeliveryWithProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// List admins in the database
routes.get('/admins', AdminController.index);

// Creates a session for users trying to authenticate
routes.post('/sessions', SessionController.store);

// Lists incomplete deliveries for a deliveryman
routes.get('/deliveryman/:id/not-delivered', NotDeliveredController.index);
// Lists completed deliveries
routes.get('/deliveryman/:id/deliveries', DeliveriesController.index);

// Updates an order with the pick up date (start_date)
routes.put(
  '/deliveryman/:deliveryman_id/start-delivery/:order_id',
  DeliveryStartController.update
);
// Updates an order with the end/delivery date (end_date)
routes.put(
  '/deliveryman/end-delivery',
  upload.single('file'),
  DeliveryEndController.update
);

/* Delivery Problems: routes for deliverymen */
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.use(authMiddleware);

// Creates a recipient
routes.post('/recipients', RecipientController.store);
// Edits a recipient
routes.put('/recipients', RecipientController.edit);

// Lists deliverymen
routes.get('/deliverymen', DeliverymanController.index);
// Stores a deliverymen
routes.post('/deliverymen', DeliverymanController.store);
// Updates a deliverymen
routes.put('/deliverymen/:id', DeliverymanController.edit);
// Removes a deliverymen
routes.delete('/deliverymen/:id', DeliverymanController.delete);

// List all registered orders
routes.get('/orders', OrderController.index);
// Store new order
routes.post('/orders', OrderController.store);
// Updates an existing order
routes.put('/orders/:id', OrderController.edit);
// Deletes an existing order
routes.delete('/orders/:id', OrderController.delete);

/* Delivery Problems: routes for admin */
// Lists all deliveries/orders that have a registered problem(s)
routes.get('/delivery-problems', DeliveryProblemController.index);
// Lists all problems that have been registered for a delivery/order
routes.get('/delivery/:id/problems', DeliveryProblemController.show);

// Cancel a delivery that has problem(s)
routes.put(
  '/problem/:id/cancel-delivery',
  CancelDeliveryWithProblemController.edit
);

// Uploads file to ./tmp/uploads
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
