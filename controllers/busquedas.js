const { response } = require('express')
const Usuario = require('../models/usuario')
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i')

    const [usuarios, medicos, hospitales] = await Promise.all([
        await Usuario.find({ nombre: regex }).limit(2),
        await Medico.find({ nombre: regex }).limit(2),
        await Hospital.find({ nombre: regex }).limit(2),
    ])

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })

    console.log(busqueda)
}

const getDocumentosColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i')
    let data = []

    switch (tabla) {
        case 'medicos':

            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img')
            break;

        case 'hospitales':

            data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img')
            break;

        case 'usuarios':

            data = await Usuario.find({ nombre: regex }).populate('usuario', 'nombre img')
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser "usuarios/medicos/hospitales"'
            })
    }

    res.json({
        ok: true,
        resultados: data
    })
}

module.exports = {
    getTodo,
    getDocumentosColeccion
}