const { response } = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    let limit = Number(req.query.limit) || 5;
    let skip = Number(req.query.skip) || 0;

    // const usuario = await Usuario.find({}, 'nombre email role google')
    //     .limit(limit)
    //     .skip(skip);

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario
        .find({})
        .skip(skip)
        .limit(limit),

        Usuario.count()
    ])

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password, name } = req.body


    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const usuario = new Usuario(req.body)

        //Encriptar contraseña
        usuario.password = bcrypt.hashSync(password, 10)

        await usuario.save()

        //Generar el Token
        const token = await generarJWT(usuario.id)

        return res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Error inesperado... Revisar logs'
        })
    }

}

const actualizarUsuario = async(req, res = response) => {
    //TODO: Validar Token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese ID'
            })
        }

        //Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con este email'
                })
            }
        }

        campos.email = email

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true })

        return res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese ID'
            })
        }

        const usuarioBorrado = await Usuario.findOneAndDelete(uid)

        return res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}
module.exports = { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario }