
/* ==========================================
   APARTADO B: SOLICITUD DE CONSTANCIAS
   COPACI NICOLÁS ROMERO
========================================== */

/* Obtener los datos del ciudadano */

function obtenerCiudadanoB() {
    const actual = JSON.parse(
        localStorage.getItem("ciudadanoActual")
    );

    if (actual) {
        return actual;
    }

    const usuario = localStorage.getItem("usuarioActual");
    const ciudadanos = JSON.parse(
        localStorage.getItem("ciudadanos")
    ) || [];

    return ciudadanos.find(c => c.usuario === usuario) || null;
}

/* Mostrar los datos del ciudadano */

function mostrarDatosConstancia() {
    const ciudadano = obtenerCiudadanoB();

    if (!ciudadano) {
        const mensaje = document.getElementById("mensaje");

        if (mensaje) {
            mensaje.textContent =
                "Inicia sesión como ciudadano para solicitar una constancia.";
        }

        return;
    }

    const nombre = document.getElementById("nombre");
    const direccion = document.getElementById("direccion");
    const usuario = document.getElementById("usuario");
    const correo = document.getElementById("correo");

    if (nombre) nombre.textContent = ciudadano.nombre || "";
    if (direccion) direccion.textContent = ciudadano.direccion || "";
    if (usuario) usuario.textContent = ciudadano.usuario || "";
    if (correo) correo.textContent = ciudadano.correo || "";
}

/* Generar un folio único */

function generarFolioB() {
    const fecha = new Date();
    const numero = Date.now().toString().slice(-7);

    return "COPACI-" + fecha.getFullYear() + "-" + numero;
}

/* Guardar y generar la solicitud */

function solicitarConstancia() {
    const ciudadano = obtenerCiudadanoB();
    const mensaje = document.getElementById("mensaje");

    if (!ciudadano) {
        if (mensaje) {
            mensaje.textContent =
                "No se encontraron los datos del ciudadano. Inicia sesión nuevamente.";
        }
        return;
    }

    const constancias = JSON.parse(
        localStorage.getItem("constancias")
    ) || [];

    const fecha = new Date().toLocaleDateString("es-MX");

    const solicitud = {
        folio: generarFolioB(),
        nombre: ciudadano.nombre,
        direccion: ciudadano.direccion,
        usuario: ciudadano.usuario,
        correo: ciudadano.correo,
        fecha: fecha,
        estado: "Pendiente"
    };

    constancias.push(solicitud);

    localStorage.setItem(
        "constancias",
        JSON.stringify(constancias)
    );

    /* Mostrar los datos en el comprobante */

    document.getElementById("folio").textContent =
        solicitud.folio;

    document.getElementById("fecha").textContent =
        solicitud.fecha;

    document.getElementById("nombreComprobante").textContent =
        solicitud.nombre;

    document.getElementById("direccionComprobante").textContent =
        solicitud.direccion;

    document.getElementById("correoComprobante").textContent =
        solicitud.correo;

    const comprobante = document.getElementById("comprobante");

    if (comprobante) {
        comprobante.style.display = "block";
    }

    if (mensaje) {
        mensaje.textContent =
            "Tu solicitud se registró correctamente.";
    }
}

/* Cargar datos al abrir la página */

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("comprobante")) {
        mostrarDatosConstancia();
    }
});

/* Permitir que el botón HTML llame a la función */

window.solicitarConstancia = solicitarConstancia;
