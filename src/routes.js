import { Router } from 'express';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// List admins in the database
routes.get('/admins', AdminController.index);

// Create a session for users trying to authenticate
routes.post('/sessions', SessionController.store);

routes.post('/recipients', authMiddleware, RecipientController.store);
routes.put('/recipients', authMiddleware, RecipientController.edit);

export default routes;
