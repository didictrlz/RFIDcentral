import bcryptjs from 'bcryptjs';
import Usuario from './bd.mjs';

async function login(req, res){
  const { email, password } = req.body;

  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  try {
    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      return res.status(400).send({ status: "Error", message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const esContraseñaCorrecta = await bcryptjs.compare(password, usuario.password);

    if (!esContraseñaCorrecta) {
      return res.status(400).send({ status: "Error", message: "Usuario o contraseña incorrectos" });
    }

    // Si llegamos aquí, el usuario y la contraseña son correctos
    // Puedes realizar acciones adicionales o redireccionar a la página deseada
    return res.status(200).send({ status: "OK", message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
  }
}


async function registro(req, res) {
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
  
    if (!user || !password || !email) {
      return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }
  
    try {
      const usuarioAResvisar = await Usuario.findOne({ email });
  
      if (usuarioAResvisar) {
        return res.status(400).send({ status: "Error", message: "Ya existe una cuenta con este correo" });
      }
  
      const salt = await bcryptjs.genSalt(5);
      const hashPassword = await bcryptjs.hash(password, salt);
      const nuevoUsuario = new Usuario({
        user,
        email,
        password: hashPassword
      });
  
      await nuevoUsuario.save();
      console.log("Usuario agregado:", nuevoUsuario);
      return res.status(201).send({ status: "ok", message: 'Usuario agregado', redirect: "/" });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
    }
  }
  
  export const methods = {
    login,
    registro
  };
