// Ruta = /api/medico

const express = require('express')
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos')
const { check } = require('express-validator')

const validarJWT = require('../middlewares/validarJWT')
const { validarCampos } = require('../middlewares/validar-campos')
const router = express.Router()

router.get('/' /*, validarJWT */ , getMedicos)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('hospital', 'Por favor ingrese el ID del hospital a asignar').isMongoId(),
    validarCampos
], crearMedico)

router.put('/:id', actualizarMedico)

router.delete('/:id', borrarMedico)

module.exports = router