import express from 'express';
import bodyParser from 'body-parser';
// import apiV1 from './controllers/v1';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
// app.use('/v1', apiV1);

export default app;
