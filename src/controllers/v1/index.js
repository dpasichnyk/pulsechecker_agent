import { Router } from 'express';

import schedule from './schedule';

const v1Router = Router();
v1Router.use('/schedule', [], schedule);

export default v1Router;
