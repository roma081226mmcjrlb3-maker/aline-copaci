
/* ==========================================
   APARTADO A: REGISTRO E INICIO DE SESIÓN
   COPACI NICOLÁS ROMERO
========================================== */

function obtenerCiudadanos() {
    return JSON.parse(localStorage.getItem("ciudadanos")) || [];
}

function guardarCiudadanos(ciudadanos) {
    localStorage.setItem("ciudadanos", JSON.stringify(ciudadanos));
}

/* ==========================================
   REGISTRO
========================================== */

const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmar = document.getElementById("confirmar").value;
        const mensaje = document.getElementById("mensaje");

        if (!nombre || !direccion || !usuario || !correo || !password || !confirmar) {
            mensaje.textContent = "Completa todos los campos.";
            return;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correo)) {
            mensaje.textContent = "Escribe un correo válido.";
            return;
        }

        if (password !== confirmar) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            return;
        }

        if (password.length < 6) {
            mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
            return;
        }

        const ciudadanos = obtenerCiudadanos();

        const duplicado = ciudadanos.some(function(c) {
            return c.usuario.toLowerCase() === usuario.toLowerCase() ||
                   c.correo.toLowerCase() === correo;
        });

        if (duplicado) {
            mensaje.textContent = "El usuario o correo ya está registrado.";
            return;
        }

        ciudadanos.push({
            nombre,
            direccion,
            usuario,
            correo,
            password
        });

        guardarCiudadanos(ciudadanos);

        mensaje.textContent = "¡Cuenta creada correctamente!";
        registroForm.reset();
    });
}

/* ==========================================
   INICIO DE SESIÓN
========================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value;
        const tipo = document.getElementById("tipo").value;
        const mensaje = document.getElementById("mensaje");

        if (!usuario || !password || !tipo) {
            mensaje.textContent = "Completa todos los campos.";
            return;
        }

        if (tipo === "admin" && usuario === "admin" && password === "Admin2026") {
            localStorage.setItem("tipoUsuario", "admin");
            localStorage.setItem("usuarioActual", usuario);
            window.location.href = "admin.html";
            return;
        }

        if (tipo === "copaci" && usuario === "copaci" && password === "COPACI2026") {
            localStorage.setItem("tipoUsuario", "copaci");
            localStorage.setItem("usuarioActual", usuario);
            window.location.href = "copaci.html";
            return;
        }

        if (tipo === "ciudadano") {
            const ciudadanos = obtenerCiudadanos();

            const encontrado = ciudadanos.find(function(c) {
                return c.usuario.toLowerCase() === usuario.toLowerCase() &&
                       c.password === password;
            });

            if (encontrado) {
                localStorage.setItem("tipoUsuario", "ciudadano");
                localStorage.setItem("usuarioActual", encontrado.usuario);
                localStorage.setItem("ciudadanoActual", JSON.stringify(encontrado));

                window.location.href = "ciudadano.html";
                return;
            }
        }

        mensaje.textContent = "Usuario, contraseña o tipo de cuenta incorrectos.";
    });
}
