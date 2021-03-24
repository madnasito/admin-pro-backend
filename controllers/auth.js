const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const generarJWT = require('../helpers/jwt')

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe este usuario'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Generar Token
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = { login }