function Vregistro(){

const nombreInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const contraseñaInput = document.getElementById("password");
const rfcInput = document.getElementsByTagName("rfc");

const nombreRegex = /^[a-zA-Z\s]+$+ ^ [sS] {0,25}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2-4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const rfcRegex = /^[0-9\s]+$+ ^ [sS] {0,13}$/;

formulario.addEventListener("submit", (e) =>{
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trin();
    const password = contraseñaInput.trin();
    const rfc = rfcInput.trin();
});


}