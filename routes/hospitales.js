// Ruta = /api/hospitales

const express = require('express')
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales')

const validarJWT = require('../middlewares/validarJWT')
const router = express.Router()
const check = require('express-validator').check
const { validarCampos } = require('../middlewares/validar-campos')

router.get('/' /*, validarJWT */ , getHospitales)

router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es necesario').not().isEmpty(),
        validarCampos
    ],
    crearHospital
)

router.put('/:id', actualizarHospital)

router.delete('/:id', borrarHospital)

module.exports = router