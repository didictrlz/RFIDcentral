import bcryptjs from 'bcryptjs';

const usuarios = [{
    user: "a",
    email:"a@a",
    password:"$2a$05$IcJE11ZEi/dMUmNRc2ffhueQBVUNDjQoQ4Xq3Sx276MJmMKJGfWcy"
}]

async function login(req, res){
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    
// Busca el usuario por su correo
    const usuarioAResvisar = usuarios.find(
        (usuario) => usuario.email === email
    );
    if (!usuarioAResvisar) {
        return res
        .status(400)
        .send({ status: "Error", message: "Correo no encontrado" });
    }   

// Ahora puedes verificar la contraseña si es necesario
    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Error al iniciar sesión" });
    }

// El usuario ha iniciado sesión correctamente
// Aquí podrías devolver algún tipo de token de autenticación si lo necesitas
    return res.status(200).send({ status: "OK", message: "Inicio de sesión exitoso", user: usuarioAResvisar });
}

async function registro(req, res){
    console.log(req.body)
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if(!user || !password || !email){
        return res.status(400).send({status: "Error", message: "Los campos están incompletos"})
    }

    const usuarioAResvisar = usuarios.find(usuario => usuario.email === email )
    if(usuarioAResvisar){
        return res.status(400).send({status: "Error", message: "Ya existe una cuenta con este correo"})
    }

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario ={
    user, email, password: hashPassword
    }
    
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status:"ok", message: 'Usuario agregado', redirect:"/"})
}
    
export const methods ={

    login,
    registro
}