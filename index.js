import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import notFound from './src/middlewares/notFound';
import errorHandler from './src/middlewares/errorHandler';
import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import testRouter from './src/routes/test';

const app = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/test', testRouter);

app.get('/ping', (req, res) => {
    return res.status(200).json('pong');
});

app.use(notFound);
app.use(errorHandler);

export default app;
