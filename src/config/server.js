const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const session = require('express-session');

const app = express(); // iniciar servidor

app.set('port', process.env.PORT || 3000); // config puerto



app.set('view engine', 'ejs'); // gestor de vistas

app.set('views', path.join(__dirname, '../app/views')); //ruta de las vistas


//middlewares (recibir info de los formularios)
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// config dotenv (variables de entorno)
dotenv.config({path: path.join(__dirname, '../env/.env')});

// config ruta de recursos css
app.use('/resources', express.static(path.join(__dirname, '../public')));

// config sesiones dentro de la app
//config variables de sessión
app.use(session({
    secret: 'secret',       //clave secreta
    proxy: true,
    resave: true,
    saveUninitialized: true,
}));


module.exports = app; 

