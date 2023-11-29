const messageError =document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async(e)=>{
    e.preventDefault();

    const user = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch("http://localhost:3000/api/registro",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        user: user,
        email: email,
        password: password,
      }),
    })
    
    if (!res.ok) return messageError.classList.toggle("escondido",false);
    const resJson = await res.json();

    if(resJson.redirect){
      window.location.href=resJson.redirect;
    }
});