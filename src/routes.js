import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// List admins in the database
routes.get('/admins', AdminController.index);

// Create a session for users trying to authenticate
routes.post('/sessions', SessionController.store);

routes.post('/recipients', authMiddleware, RecipientController.store);
routes.put('/recipients', authMiddleware, RecipientController.edit);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
