const mysql = require('mysql');

function addVerifyCodeToRDS(email, code,_password) {
    console.log('here:password is:',_password);
  const connection = mysql.createConnection({
    host: 'project-astra-rds.c5y9t5m5qhwe.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'heyhey1234',
    database: 'astraDB',
  });

  const selectQuery = `SELECT * FROM Temp_Verify WHERE email='${email}'`;

  connection.query(selectQuery, (error, results, fields) => {
    if (error) {
      console.error(error);
      connection.end();
      return;
    }

    if (results.length > 0) {
      const updateQuery = `UPDATE Temp_Verify SET code='${code}' WHERE email='${email}'`;

      connection.query(updateQuery, (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Code updated for email: ${email}`);
        }
        connection.end();
      });
    } else {
      const insertQuery = `INSERT INTO Temp_Verify (email, code, password) VALUES ('${email}','${code}','${_password}')`;

      console.log(insertQuery);
      connection.query(insertQuery, (error, results, fields) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Code added for email: ${email}`);
        }
        connection.end();
      });
    }
  });
}

// addVerifyCodeToRDS('hello@gmail.com', '12300456');
module.exports = addVerifyCodeToRDS;