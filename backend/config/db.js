require('dotenv').config({ path: './config/.env' });
const mysql = require('mysql');

let db = mysql.createConnection({
  host : process.env.DATABASE_HOST,
  user : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE,
  charset: 'utf8mb4'
});

// Connexion a la BDD
db.connect((err) => {
  if(!err){
    console.log('DATABASE CONNECTED !');
  } else {
    throw err;
  }
})

module.exports = db;