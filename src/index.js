const express = require(`express`);
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');

const { error404, nextHandler } = require('./utils/errors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use('/users', routes.userRoutes);

// Error handler
app.use(nextHandler);

// 404 handler
app.use(error404);

// Un handeled rejection rejection handler
process.on('unhandledRejection', (error) => {
  throw error;
});

// Un caught exception handler
process.on('uncaughtException', (error) => {
  console.error(
    `${new Date().toUTCString()} uncaughtException:`,
    error.message
  );
  console.error(error);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
