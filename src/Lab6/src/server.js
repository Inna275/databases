import express from 'express';
import router from './router.js';
import errorHandlingMiddleware from './errorMiddleware.js';

const PORT = 3000;

const app = express();

app.use(express.json());

app.use('/projects', router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
