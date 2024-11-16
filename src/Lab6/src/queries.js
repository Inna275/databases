const QUERIES = {
  CREATE: 'INSERT INTO project (name, description, user_id) VALUES (?, ?, ?)',
  GET_ALL: 'SELECT * FROM project',
  GET_BY_ID: 'SELECT * FROM project WHERE id = ?',
  UPDATE: 'UPDATE project SET name = ?, description = ?, user_id = ? WHERE id = ?',
  DELETE: 'DELETE FROM project WHERE id = ?',
};

export default QUERIES;