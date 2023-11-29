const messageError =document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async(e)=>{
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const resJson = await res.json();
  
      if (res.ok) {
        // Redireccionar a la página de inicio después de un inicio de sesión exitoso
        window.location.href = "/operarios";
      } else {
        // Mostrar mensaje de error en el formulario si es necesario
        messageError.classList.toggle("escondido", false);
        console.error("Error al iniciar sesión:", resJson.message);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  });