const { response } = require('express')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

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

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if (!medico) {

            return res.status(404).json({
                ok: false,
                err: 'No se ha encontrado el medico'
            })
        }

        const hospital = await Hospital.findById(req.body.hospital)

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                err: 'Ingrese un hospital correcto'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            err: 'Hable con el administrador'
        })
    }

}

const borrarMedico = async(req, res) => {

    const id = req.params.id;
    const uid = req.params.uid;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                err: 'No se ha encontrado el medico'
            })
        }

        const medicoBorrado = await Medico.findByIdAndRemove(id)

        res.json({
            ok: true,
            medicoBorrado
        })

    } catch (error) {
        return res.status(400).json({
            ok: false,
            err: 'Hable con el administrador'
        })
    }
}

module.exports = { getMedicos, crearMedico, actualizarMedico, borrarMedico }