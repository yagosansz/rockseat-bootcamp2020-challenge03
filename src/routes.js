import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// List admins in the database
routes.get('/admins', AdminController.index);

// Create a session for users trying to authenticate
routes.post('/sessions', SessionController.store);

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

// Uploads file to ./tmp/uploads
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
