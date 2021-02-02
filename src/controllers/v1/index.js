import { Router } from 'express';

import request from './request';


const v1Router = Router();
v1Router.use('/request', [], request);

export default v1Router;
