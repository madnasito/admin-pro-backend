const jwt = require('jsonwebtoken')
const { response } = require('express')
const validarJWT = (req, res = response, next) => {

    //Leer el Token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            err: 'No hay Token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next()

    } catch (error) {
        return res.status(401).json({
            ok: false,
            err: 'Token no válido'
        })
    }
}

module.exports = validarJWT