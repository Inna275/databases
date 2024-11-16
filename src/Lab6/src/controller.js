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
