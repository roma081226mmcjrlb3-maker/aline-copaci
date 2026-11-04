// ========================================
// OBTENER DATOS DE LOCALSTORAGE
// ========================================

function obtenerDatos(clave) {

    try {

        const datos = JSON.parse(localStorage.getItem(clave));

        return Array.isArray(datos) ? datos : [];

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

    const constancias = obtenerDatos("constancias");

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

        if (!usuarioActual) {

            alert("Inicia sesión para enviar un reporte.");
            return;

        }

        const asunto =
            document.getElementById("asunto").value.trim();

        const descripcion =
            document.getElementById("descripcion").value.trim();

        const ubicacion =
            document.getElementById("ubicacion").value.trim();

        const reportes = obtenerDatos("reportes");

        const nuevoReporte = {

            id: Date.now(),
            usuario: usuarioActual,
            asunto: asunto,
            descripcion: descripcion,
            ubicacion: ubicacion,
            estado: "Pendiente"

        };

        reportes.push(nuevoReporte);

        localStorage.setItem(
            "reportes",
            JSON.stringify(reportes)
        );

        alert("¡Reporte enviado correctamente!");

        reporteForm.reset();

        window.location.href = "mis-reportes.html";

    });

}


// ========================================
// MOSTRAR MIS REPORTES
// ========================================

function mostrarReportes() {

    const lista = document.getElementById("listaReportes");

    if (!lista) {
        return;
    }

    const usuarioActual =
        localStorage.getItem("usuarioActual");

    const reportes = obtenerDatos("reportes");

    const misReportes = reportes.filter(function(reporte) {

        return reporte && reporte.usuario === usuarioActual;

    });

    lista.innerHTML = "";

    if (misReportes.length === 0) {

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        const titulo = document.createElement("h3");
        titulo.textContent = "No tienes reportes todavía.";

        const descripcion = document.createElement("p");
        descripcion.textContent =
            "Cuando realices un reporte, aparecerá aquí.";

        const enlace = document.createElement("a");
        enlace.href = "reporte.html";
        enlace.className = "boton";
        enlace.textContent = "Crear reporte";

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(enlace);

        lista.appendChild(tarjeta);

        return;

    }


    // MOSTRAR CADA REPORTE

    misReportes.forEach(function(reporte) {

        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const titulo = document.createElement("h3");
        titulo.textContent = reporte.asunto || "Sin asunto";

        const descripcion = document.createElement("p");
        descripcion.textContent =
            "Descripción: " + (reporte.descripcion || "");

        const ubicacion = document.createElement("p");
        ubicacion.textContent =
            "Ubicación: " + (reporte.ubicacion || "");

        const estado = document.createElement("p");

        const textoEstado = document.createElement("strong");
        textoEstado.textContent = "Estado: ";

        const valorEstado = document.createElement("span");
        valorEstado.className = "estado";
        valorEstado.textContent = reporte.estado || "Pendiente";

        estado.appendChild(textoEstado);
        estado.appendChild(valorEstado);

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(ubicacion);
        tarjeta.appendChild(estado);

        lista.appendChild(tarjeta);

    });

}


// EJECUTAR CONSULTA DE REPORTES

mostrarReportes();
