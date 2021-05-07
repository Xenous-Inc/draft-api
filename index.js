import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import notFound from './src/rest/middlewares/notFound';
import errorHandler from './src/rest/middlewares/errorHandler';
import usersRouter from './src/rest/routes/users';
import authRouter from './src/rest/routes/auth';
import { postsRouter } from './src/rest/routes/posts';
import authMiddleware from './src/rest/middlewares/auth';

const app = express();

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/posts', authMiddleware, postsRouter);

app.get('/ping', (req, res) => {
    return res.status(200).json('pong');
});

app.use(notFound);
app.use(errorHandler);

export default app;
