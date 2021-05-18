const express = require ('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

//Conexión Data Base
const { mongoose } = require('./database.js');

//Configuraciones
app.set('port', process.env.PORT || 3100 );

//Middleware
app.use(morgan('dev')); //Enviar mensajes a consola de lo que el usuario pide de manera externa
app.use(express.json()); //Obtener los datos del usuario en request.body
app.use(cors()); //Permite la comunicación desde fuera del servidor

//Rutas del servidor
app.use('/api/empleados',require('./routes/empleados.routes'));


//Iniciar servidor 
app.listen(app.get('port'), ()=>{
    console.log("Servidor corriendo en el puerto " + app.get('port'));
});