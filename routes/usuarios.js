// Ruta: /api/usuarios

const express = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const router = express.Router()
const validarJWT = require('../middlewares/validarJWT')
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios')

router.get('/', validarJWT, getUsuarios)

router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
        validarCampos
    ],
    crearUsuario
)

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail().not().isEmpty(),
    validarCampos
], actualizarUsuario)

router.delete('/:id', validarJWT, borrarUsuario)

module.exports = router