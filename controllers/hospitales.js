const { response } = require('express')
const Hospital = require('../models/hospital')

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img')

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res) => {

    const uid = req.uid
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });


    try {

        const hospitalDB = await hospital.save()

        return res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid

    try {

        const hospital = await Hospital.findById(id)

        if (!hospital) {

            return res.status(404).json({
                ok: true,
                err: 'Hospital no encontrado'
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true })

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            err: 'Hable con el administrador'
        })
    }

}

const borrarHospital = async(req, res = response) => {

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id)

        if (!hospital) {

            return res.status(404).json({
                ok: true,
                err: 'Hospital no encontrado'
            })
        }

        const hospitalBorrado = await Hospital.findByIdAndDelete(id)

        res.json({
            ok: true,
            hospital: hospitalBorrado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            err: 'Hable con el administrador'
        })
    }
}

module.exports = { getHospitales, crearHospital, actualizarHospital, borrarHospital }