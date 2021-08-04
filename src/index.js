const app = require('./config/server');

require('./app/routes/app')(app);

app.listen(app.get('port'), () => {
    console.log("Servidor corriendo en http://localhost:3000")
})