const path = require('path')
const { response } = require('express')
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const router = require('../routes/uploads');
const { fstat } = require('fs');

uuidv4()

const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['medicos', 'hospitales', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo seleccionado no es un medico, usuario u hospital'
        })
    }

    //Validar existencia de un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: 'No hay un archivo'
        });
    }

    //Procesar una imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]

    //Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            err: 'La extensiones validas son ' + extensionesValidas.join(', ')
        })
    }

    //Validar extensión del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`

    //Mover imagen
    file.mv(path, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        actualizarImagen(tipo, id, nombreArchivo)

        res.json({
            ok: true,
            nombreArchivo
        })
    })


}

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-image.jpg`)
        returnres.sendFile(pathImg)

    }
}

module.exports = {
    fileUpload,
    retornaImagen
}