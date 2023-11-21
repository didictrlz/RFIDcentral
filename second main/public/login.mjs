const messageError =document.getElementsByClassName("error")[0];


document.getElementById("login-form").addEventListener("submit", async(e)=>{
    e.preventDefault();

    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    const res = await fetch("http://localhost:3000/api/login",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        user, password,
      })
    });
    
    if (!res.ok) return messageError.classList.toggle("escondido", false);
    const resJson = await res.json();

    if(resJson.redirect){
      window.location.href = resJson.redirect;
    }
});