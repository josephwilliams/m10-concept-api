require('dotenv').config()
import express, { json } from 'express';
const app = express();
import path from 'path';
import router from './router';

import cors from 'cors';
import sslRedirect from 'heroku-ssl-redirect';

// enable cors
app.use(cors());

// enable ssl redirect
app.use(sslRedirect());

// TODO: setup basicAuthMiddleware
// app.use(basicAuthMiddleware);

app.use('/', router);

const PORT = (process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
