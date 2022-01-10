const formulario = document.getElementById("caja-login");
const inputs = document.querySelectorAll("#caja-login input");

const expresiones = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, // 8 caracters, una letra mayuscula y minuscula.
    nombre_usuario: /^[a-zA-ZÀ-ÿ\s]{1,20}$/,
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "contrasena":
            if (expresiones.password.test(e.target.value)) {
                document.getElementById("p-error").innerHTML = "";
            } else {
                document.getElementById("p-error").innerHTML =
                    "La contraseña debe incluir una letra mayúscula, minuscula y un numero";
            }
            break;
        case "nombre_usuario":
            if (expresiones.nombre_usuario.test(e.target.value)) {
                document.getElementById("c-error").innerHTML = "";
            } else {
                document.getElementById("c-error").innerHTML =
                    "Nombre de usuario no válido";
            }
            break;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
});
