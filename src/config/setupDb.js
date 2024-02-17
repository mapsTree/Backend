const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'adi',
  password: 'adi',
  database: 'mapstree_db',
  port: 3306,
  multipleStatements:true
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);

  fs.readFile('../../mapsTree.sql', 'utf8', (err, sql) => {
    if (err) {
      console.error('error reading SQL file:', err);
      return;
    }

    connection.query(sql, (err, result) => {
      if (err) {
        console.error('error executing SQL:', err);
        return;
      }

      console.log('SQL executed successfully');
      connection.end();
    });
  });
});