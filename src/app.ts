import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { connect } from './db';
import routes from './routes';
import swaggerSetup from './docs/swagger';

// Initial config
dotenv.config();
connect();

// Global Config for Dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const app = express();

// add middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.set('port', process.env.PORT || process.env.APP_PORT || '8080');
app.set('env', process.env.APP_ENV || 'local');
app.set('host', process.env.APP_HOST);

if (app.get('env') === 'local') {
  const url = `${app.get('host')}:${app.get('port')}`;
  app.set('host', url);
}

export default app;
