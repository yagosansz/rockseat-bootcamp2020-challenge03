import { Router } from 'express';

import AdminController from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/admins', AdminController.index);

routes.post('/sessions', SessionController.store);

export default routes;
