# Реалізація інформаційного та програмного забезпечення

## SQL-скрипт для створення на початкового наповнення бази даних

```sql

CREATE SCHEMA IF NOT EXISTS db;

CREATE TABLE IF NOT EXISTS db.role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS db.user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    role_id INT NOT NULL REFERENCES db.role (id) ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS db.media_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    file_path VARCHAR(128) NOT NULL UNIQUE,
    user_id INT NOT NULL REFERENCES db.user (id) ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS db.project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES db.user (id) ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS db.analysis_task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    user_id INT NOT NULL REFERENCES db.user (id) ON DELETE NO ACTION,
    project_id INT NOT NULL REFERENCES db.project (id) ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS db.task_content (
    media_content_id INT NOT NULL REFERENCES db.media_content (id) ON DELETE NO ACTION,
    analysis_task_id INT NOT NULL REFERENCES db.analysis_task (id) ON DELETE NO ACTION,
    PRIMARY KEY (media_content_id, analysis_task_id)
);

CREATE TABLE IF NOT EXISTS db.report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT NOW(),
    analysis_task_id INT NOT NULL REFERENCES db.analysis_task (id) ON DELETE NO ACTION
);

INSERT INTO db.role (name, description)
VALUES ('User Role', 'description for User Role'),
       ('Tech Expert Role', 'description for Tech Expert Role'),
       ('Media Content Analyst Role', 'description for Media Content Analyst Role');

INSERT INTO db.user (name, email, password, role_id)
VALUES
    ('Mock user1', 'test1@test.com', '$2a$12$v.HK88e3zeXbJdQptStutOTyFBitIOdSlOxIfNeOcPey/ZKjtaWPm', 1),
    ('Mock user2', 'test2@test.com', '$2a$12$6IpiXsVmylfNzPBD29YbU.bchJr9IztZpYD/A9PrwUuIn4jEFQEd2', 1),
    ('Mock user3', 'test3@test.com', '$2a$12$363l0yY4Cxy3Gj.hr7D85OJmf0qkvd.tc0VIBxn4svkLazvsbBo3S', 1),
    ('Mock user4', 'test4@test.com', '$2a$12$auMQTmDv9D7lISYaCd7ZQO3VSXUbcjQQrcxdiooQO0EJY3q2bY4hW', 1),
    ('Mock user5', 'test5@test.com', '$2a$12$nRJp1Ad6rRHfzD7l5WLKk.c7EZ/FSuADv0MsM1qYnHSE4YxcG4joO', 1);

INSERT INTO db.media_content (title, description, type, file_path, user_id)
VALUES
    ('media content 1', '...', 'jpg', 'path/to/media/content/1', 1),
    ('media content 2', '...', 'png', 'path/to/media/content/2', 2),
    ('media content 3', '...', 'pdf', 'path/to/media/content/3', 3),
    ('media content 4', '...', 'pdf', 'path/to/media/content/4', 4),
    ('media content 5', '...', 'txt', 'path/to/media/content/5', 5);

INSERT INTO db.project (name, description, user_id)
VALUES
    ('Project 1', '...', 1),
    ('Project 2', '...', 2),
    ('Project 3', '...', 3);

INSERT INTO db.analysis_task (name, status, user_id, project_id)
VALUES
    ('analysis task 1', 'pending', 1, 1),
    ('analysis task 2', 'in progress ', 2, 1),
    ('analysis task 3', 'completed', 3, 1),
    ('analysis task 4', 'paused', 1, 2),
    ('analysis task 5', 'cancelled', 1, 3);

INSERT INTO db.task_content (media_content_id, analysis_task_id)
VALUES
    (5,1),
    (2,1),
    (2,2),
    (1,2),
    (1,5);

INSERT INTO db.report (name, content, analysis_task_id)
VALUES
    ('report 1', '...', 1),
    ('report 2', '...', 2),
    ('report 3', '...', 3),
    ('report 4', '...', 4),
    ('report 5', '...', 5);


```

## RESTfull сервіс для управління даними

### Підключення до бази даних
```javascript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
```

### Налаштування сервера
```javascript
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
```

### Роутинг
```javascript
import express from 'express';
import { getProjects, 
         getProjectById, 
         createProject, 
         updateProject, 
         deleteProject } from './controller.js';

const router = express.Router();

router.post('/', createProject);

router.get('/', getProjects);

router.get('/:id', getProjectById);

router.put('/:id', updateProject);

router.delete('/:id', deleteProject);

export default router;
```

### Логіка для CRUD операцій
```javascript
import pool from './connection.js';
import QUERIES from './queries.js';
import HTTP_STATUS_CODES from './statusCodes.js';
import sendResponse from './sendResponse.js';
import errorFactory from './errorFactory.js';

const { CREATE, GET_ALL, GET_BY_ID, UPDATE, DELETE } = QUERIES;

const { OK, CREATED } = HTTP_STATUS_CODES;

const createProject = async (req, res, next) => {
  const { name, description, user_id } = req.body;

  if (!name || !description || !user_id) {
    return next(errorFactory.missingFields());
  }

  const values = [name, description, user_id];

  try {
    await pool.execute(CREATE, values);
    sendResponse(res, CREATED);
  } catch (err) {
    next(errorFactory.createError(err.message));
  }
};

const getProjects = async (req, res, next) => {
  try {
    const [results] = await pool.execute(GET_ALL);
    sendResponse(res, OK, results);
  } catch (err) {
    next(errorFactory.getError(err.message));
  }
};

const getProjectById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [results] = await pool.execute(GET_BY_ID, [id]);

    if (results.length === 0) {
      return next(errorFactory.notFound());
    }

    sendResponse(res, OK, results[0]);
  } catch (err) {
    next(errorFactory.getError(err.message));
  }
};

const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, user_id } = req.body;

  if (!name || !description || !user_id) {
    return next(errorFactory.missingFields());
  }

  const values = [name, description, user_id, id];

  try {
    const [result] = await pool.execute(UPDATE, values);

    if (result.affectedRows === 0) {
      return next(errorFactory.notFound());
    }

    sendResponse(res, OK);
  } catch (err) {
    next(errorFactory.updateError(err.message));
  }
};

const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(DELETE, [id]);

    if (result.affectedRows === 0) {
      return next(errorFactory.notFound());
    }

    sendResponse(res, OK);
  } catch (err) {
    next(errorFactory.deleteError(err.message));
  }
};

export { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
};
```

### Відправка відповіді
```javascript
const sendResponse = (res, statusCode, data = null) => {
  const response = { message: 'Success' };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

export default sendResponse;
```

### Обробка помилок
```javascript
import HTTP_STATUS_CODES from './statusCodes.js';

const { INTERNAL_SERVER_ERROR } = HTTP_STATUS_CODES;

const errorHandlingMiddleware = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
    error: err.message || 'Internal Server Error',
  };

  if (err.details) {
    response.details = err.details;
  }

  res.status(response.statusCode).json(response);
};

export default errorHandlingMiddleware;
```

### Фабрика помилок
```javascript
import HTTP_STATUS_CODES from './statusCodes.js';

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = HTTP_STATUS_CODES;

const formError = (message, statusCode = INTERNAL_SERVER_ERROR, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

const errorFactory = {
  missingFields: () => {
    return formError('Missing fields', BAD_REQUEST);
  },

  notFound: () => {
    return formError('Resource not found', NOT_FOUND);
  },

  createError: (details = null) => {
    return formError('Create error', INTERNAL_SERVER_ERROR, details);
  },

  getError: (details = null) => {
    return formError('Get error', INTERNAL_SERVER_ERROR, details);
  },

  updateError: (details = null) => {
    return formError('Update error', INTERNAL_SERVER_ERROR, details);
  },

  deleteError: (details = null) => {
    return formError('Delete error', INTERNAL_SERVER_ERROR, details);
  },
};

export default errorFactory;
```

### SQL запити
```javascript
const QUERIES = {
  CREATE: 'INSERT INTO project (name, description, user_id) VALUES (?, ?, ?)',
  GET_ALL: 'SELECT * FROM project',
  GET_BY_ID: 'SELECT * FROM project WHERE id = ?',
  UPDATE: 'UPDATE project SET name = ?, description = ?, user_id = ? WHERE id = ?',
  DELETE: 'DELETE FROM project WHERE id = ?',
};

export default QUERIES;
```

### Коди статусів HTTP
```javascript
const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export default HTTP_STATUS_CODES;
```
