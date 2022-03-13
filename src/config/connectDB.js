// get the client
import mysql from 'mysql2/promise';

// create the connection to database
const pool = mysql.createPool({ //create pool
  host: 'localhost',
  user: 'root',
  database: 'heatly'
});
export default pool;
