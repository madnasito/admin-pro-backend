const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const generarJWT = require('../helpers/jwt')
const { googleVerify } = require('../helpers/google-verify')

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

const googleSingIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken)

        const usuarioDB = await Usuario.findOne({ email })
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            //Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save()

        //Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            msg: 'Google Sign In',
            usuario,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            error,
            msg: "Token no es correcto"
        })
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid)

    res.json({
        ok: true,
        uid
    })
}

module.exports = { login, googleSingIn, renewToken }