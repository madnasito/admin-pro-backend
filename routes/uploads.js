//Ruta = api/uploads
const express = require('express')
const router = express.Router()
const validarJWT = require('../middlewares/validarJWT')
const { fileUpload, retornaImagen } = require('../controllers/uploads')
const expressFileUpload = require('express-fileupload')

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload)

router.get('/:tipo/:foto', retornaImagen)

module.exports = router