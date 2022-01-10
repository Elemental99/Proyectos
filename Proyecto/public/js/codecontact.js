const formulario = document.getElementById("caja-contacto");
const inputs = document.querySelectorAll("#caja-contacto input");

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{5,40}$/, // Letras y espacios, pueden llevar acentos.
    telefono: /^.{10,10}$/, // Letras y espacios, pueden llevar acentos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            if (expresiones.nombre.test(e.target.value)) {
                document.getElementById("n-error").innerHTML = "";
                document.getElementById("s-error").innerHTML = "";
            } else {
                document.getElementById("n-error").innerHTML =
                    "Nombre no válido";
            }
            break;
        case "telefono":
            if (expresiones.telefono.test(e.target.value)) {
                document.getElementById("t-error").innerHTML = "";
                document.getElementById("s-error").innerHTML = "";
            } else {
                document.getElementById("t-error").innerHTML =
                    "Telefono no valida";
            }
            break;
        case "correo":
            if (expresiones.correo.test(e.target.value)) {
                document.getElementById("c-error").innerHTML = "";
                document.getElementById("s-error").innerHTML = "";
            } else {
                document.getElementById("c-error").innerHTML =
                    "Correo no válido";
            }
            break;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});
