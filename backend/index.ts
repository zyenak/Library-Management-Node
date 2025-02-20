import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import express, { Request, Response } from 'express';
import routes from './routes';
import { bodyParser, requestLogger } from './middlewares';
import sequelize from './config/db';

const app = express();

// Middleware
app.use(cors());
app.use(requestLogger);
app.use(bodyParser);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Task Management API!');
});

// Routes
app.use('/api', routes);

// Define a port
const PORT = process.env.PORT || 4000;

// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});