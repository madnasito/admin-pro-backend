const express = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const router = express.Router()
const validarJWT = require('../middlewares/validarJWT')
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

router.get('/:busqueda', validarJWT, getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);

module.exports = router