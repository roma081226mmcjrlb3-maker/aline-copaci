// OBTENER CIUDADANOS

function obtenerCiudadanos() {

    const datos = localStorage.getItem("ciudadanos");

    if (!datos) {
        return [];
    }

    try {
        const ciudadanos = JSON.parse(datos);

        return Array.isArray(ciudadanos)
            ? ciudadanos
            : [];

    } catch (error) {
        return [];
    }

}


// INICIO DE SESIÓN

document.getElementById("loginForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const usuario = document.getElementById("usuario")
        .value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const tipo = document.getElementById("tipo").value;

    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";


    // ADMINISTRADOR

    if (
        tipo === "admin" &&
        usuario === "admin" &&
        password === "Admin2026"
    ) {

        localStorage.setItem("tipoUsuario", "admin");
        localStorage.setItem("usuarioActual", "admin");

        window.location.href = "admin.html";
        return;

    }


    // MIEMBRO DEL COPACI

    if (
        tipo === "copaci" &&
        usuario === "copaci" &&
        password === "COPACI2026"
    ) {

        localStorage.setItem("tipoUsuario", "copaci");
        localStorage.setItem("usuarioActual", "copaci");

        window.location.href = "copaci.html";
        return;

    }


    // CIUDADANO

    if (tipo === "ciudadano") {

        const ciudadanos = obtenerCiudadanos();

        const ciudadano = ciudadanos.find(function(persona) {

            if (
                !persona ||
                !persona.usuario ||
                persona.password === undefined
            ) {
                return false;
            }

            return (
                String(persona.usuario).trim().toLowerCase() === usuario &&
                String(persona.password) === password
            );

        });


        if (ciudadano) {

            localStorage.setItem("tipoUsuario", "ciudadano");

            localStorage.setItem(
                "usuarioActual",
                ciudadano.usuario
            );

            localStorage.setItem(
                "ciudadanoActual",
                JSON.stringify(ciudadano)
            );

            window.location.href = "ciudadano.html";
            return;

        }

    }


    // ERROR DE ACCESO

    mensaje.textContent =
        "Usuario, contraseña o tipo de usuario incorrectos.";

    mensaje.className = "error";

});
