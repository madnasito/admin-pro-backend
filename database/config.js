const mongoose = require('mongoose')
const colors = require('colors')

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })

        console.log('Conectado'.green)

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la Base de datos')
    }
}

module.exports = { dbConnection }