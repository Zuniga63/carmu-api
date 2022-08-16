import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { connect } from './db';
import routes from './routes';
import swaggerSetup from './docs/swagger';

// Initial config
dotenv.config();
connect();

const app = express();

// add middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/', routes);
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.set('port', process.env.PORT || process.env.APP_PORT || '8080');
app.set('env', process.env.APP_ENV || 'local');
app.set('host', process.env.APP_HOST);

if (app.get('env') === 'local') {
  const url = `${app.get('host')}:${app.get('port')}`;
  app.set('host', url);
}

export default app;
