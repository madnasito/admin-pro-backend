require('dotenv').config()

const express = require('express');
const app = express()
const cors = require('cors')
const { dbConnection } = require('./database/config')

//Configurar CORS
app.use(cors())

//Lectura del Body
app.use(express.json());

//Base de datos
dbConnection()

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))
app.use('/api/hospitales', require('./routes/hospitales'))
app.use('/api/medicos', require('./routes/medicos'))
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


app.listen(process.env.PORT, () => {
    console.log('App en el puerto', process.env.PORT)
})