import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// List admins in the database
routes.get('/admins', AdminController.index);

// Create a session for users trying to authenticate
routes.post('/sessions', SessionController.store);

// Creates a recipient
routes.post('/recipients', authMiddleware, RecipientController.store);
// Edits a recipient
routes.put('/recipients', authMiddleware, RecipientController.edit);

// Lists deliverymen
routes.get('/deliverymen', authMiddleware, DeliverymanController.index);
// Stores a deliverymen
routes.post('/deliverymen', authMiddleware, DeliverymanController.store);
// Updates a deliverymen
routes.put('/deliverymen/:id', authMiddleware, DeliverymanController.edit);
// Removes a deliverymen
routes.delete('/deliverymen/:id', authMiddleware, DeliverymanController.delete);

// Uploads file to ./tmp/uploads
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
