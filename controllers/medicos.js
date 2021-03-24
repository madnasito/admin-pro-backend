const { response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async(req, res = response) => {

    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;

    const medico = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre')
        .limit(limit)
        .skip(skip)

    res.json({
        ok: true,
        medico
    })
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save()

        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            ok: false,
            err: 'Hable con el administrador'
        })
    }

    res.json({
        ok: true,
        msg: 'Crear medico'
    })
}

const actualizarMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'Actualizar medico'
    })
}

const borrarMedico = (req, res) => {

    res.json({
        ok: true,
        msg: 'Borrar medico'
    })
}

module.exports = { getMedicos, crearMedico, actualizarMedico, borrarMedico }