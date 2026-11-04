// REGISTRO DE CIUDADANOS

document.getElementById("registroForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";

    // VALIDAR CAMPOS

    if (!nombre || !direccion || !usuario || !correo || !password || !confirmar) {

        mensaje.textContent = "Completa todos los campos.";
        mensaje.className = "error";
        return;

    }

    // CONFIRMAR CONTRASEÑA

    if (password !== confirmar) {

        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.className = "error";
        return;

    }

    // OBTENER CIUDADANOS REGISTRADOS

    let ciudadanos = [];

    try {

        ciudadanos = JSON.parse(localStorage.getItem("ciudadanos")) || [];

        if (!Array.isArray(ciudadanos)) {
            ciudadanos = [];
        }

    } catch (error) {

        ciudadanos = [];

    }

    // COMPROBAR SI YA EXISTE EL USUARIO O CORREO

    const existe = ciudadanos.some(function(ciudadano) {

        return ciudadano &&
            (
                String(ciudadano.usuario || "").toLowerCase() === usuario.toLowerCase() ||
                String(ciudadano.correo || "").toLowerCase() === correo.toLowerCase()
            );

    });

    if (existe) {

        mensaje.textContent = "El usuario o correo ya está registrado.";
        mensaje.className = "error";
        return;

    }

    // CREAR NUEVO CIUDADANO

    const nuevoCiudadano = {

        nombre: nombre,
        direccion: direccion,
        usuario: usuario,
        correo: correo,
        password: password

    };

    ciudadanos.push(nuevoCiudadano);

    // GUARDAR EN LOCALSTORAGE

    localStorage.setItem("ciudadanos", JSON.stringify(ciudadanos));

    mensaje.textContent = "Cuenta creada correctamente.";
    mensaje.className = "exito";

    // REGRESAR AL INICIO DE SESIÓN

    setTimeout(function() {

        window.location.href = "index.html";

    }, 1500);

});
