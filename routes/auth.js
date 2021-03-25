// Path: /api/login
const { Router } = require('express')
const { login, googleSingIn, renewToken } = require('../controllers/auth')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const router = Router()
const validarJWT = require('../middlewares/validarJWT')

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    validarCampos
], login)

router.post('/google', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos
], googleSingIn)

router.get('/renew', validarJWT, renewToken)

module.exports = router