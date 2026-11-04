// ========================================
// FUNCION PARA LEER DATOS DE LOCALSTORAGE
// ========================================

function obtenerDatos(clave) {

    try {

        const datos = JSON.parse(localStorage.getItem(clave));

        return datos || [];

    } catch (error) {

        return [];

    }

}


// ========================================
// DATOS DEL CIUDADANO
// ========================================

let ciudadano = null;

try {

    ciudadano = JSON.parse(
        localStorage.getItem("ciudadanoActual")
    );

} catch (error) {

    ciudadano = null;

}

if (!ciudadano) {

    const usuarioActual = localStorage.getItem("usuarioActual");

    const ciudadanos = obtenerDatos("ciudadanos");

    ciudadano = ciudadanos.find(function(persona) {

        return persona && persona.usuario === usuarioActual;

    });

}


// ========================================
// MOSTRAR DATOS EN CONSTANCIAS
// ========================================

if (document.getElementById("nombre")) {

    if (ciudadano) {

        document.getElementById("nombre").textContent =
            ciudadano.nombre || "";

        document.getElementById("direccion").textContent =
            ciudadano.direccion || "";

        document.getElementById("usuario").textContent =
            ciudadano.usuario || "";

        document.getElementById("correo").textContent =
            ciudadano.correo || "";

    } else {

        document.getElementById("mensaje").textContent =
            "No se encontraron los datos del ciudadano. Inicia sesión nuevamente.";

    }

}


// ========================================
// GENERAR SOLICITUD DE CONSTANCIA
// ========================================

window.solicitarConstancia = function() {

    if (!ciudadano) {
        return;
    }

    let constancias = obtenerDatos("constancias");

    if (!Array.isArray(constancias)) {
        constancias = [];
    }

    const folio =
        "COPACI-" + Date.now().toString().slice(-8);

    const fecha = new Date().toLocaleDateString("es-MX");

    const solicitud = {

        folio: folio,
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

    document.getElementById("folio").textContent = folio;

    document.getElementById("fecha").textContent = fecha;

    document.getElementById("nombreComprobante").textContent =
        ciudadano.nombre || "";

    document.getElementById("direccionComprobante").textContent =
        ciudadano.direccion || "";

    document.getElementById("correoComprobante").textContent =
        ciudadano.correo || "";

    document.getElementById("comprobante").style.display = "block";

    document.getElementById("mensaje").textContent =
        "¡Tu solicitud se generó correctamente!";

};


// ========================================
// GUARDAR REPORTE
// ========================================

const reporteForm = document.getElementById("reporteForm");

if (reporteForm) {

    reporteForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const usuarioActual =
            localStorage.getItem("usuarioActual");

        const asunto =
            document.getElementById("asunto").value.trim();

        const descripcion =
            document.getElementById("descripcion").value.trim();

        const ubicacion =
            document.getElementById("ubicacion").value.trim();


        // OBTENER REPORTES ANTERIORES

        let reportes = obtenerDatos("reportes");

        if (!Array.isArray(reportes)) {
            reportes = [];
        }


        // CREAR NUEVO REPORTE

        const nuevoReporte = {

            id: Date.now(),
            usuario: usuarioActual,
            asunto: asunto,
            descripcion: descripcion,
            ubicacion: ubicacion,
            estado: "Pendiente"

        };


        // GUARDAR REPORTE

        reportes.push(nuevoReporte);

        localStorage.setItem(
            "reportes",
            JSON.stringify(reportes)
        );


        alert("¡Reporte enviado correctamente!");


        // LIMPIAR FORMULARIO

        reporteForm.reset();


        // IR A MIS REPORTES

        window.location.href = "mis-reportes.html";

    });

}
