/* const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((error) => {
    if(error){
        console.log('El error de conexión es : ' + error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});

module.exports = connection; */
const mysql = require('mysql')

const conexion_db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

function handleDisconnect(conexion_db) {
    connection = mysql.createPool(conexion_db);

    connection.getConnection((err) =>{
        if (err) {
            console.error('Error when connection to db', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', (err)=>{
        console.error('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
}

handleDisconnect(conexion_db);
module.exports = connection;