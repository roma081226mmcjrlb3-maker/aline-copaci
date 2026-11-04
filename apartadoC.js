
/* ==========================================
   APARTADO C: REPORTES CIUDADANOS
   LUMINARIAS Y BACHEO
   COPACI NICOLÁS ROMERO
========================================== */

/* Obtener reportes guardados */

function obtenerReportesC() {
    return JSON.parse(localStorage.getItem("reportes")) || [];
}

/* Guardar reportes */

function guardarReportesC(reportes) {
    localStorage.setItem("reportes", JSON.stringify(reportes));
}

/* Evitar que el texto ingresado se interprete como HTML */

function protegerTextoC(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, function(caracter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[caracter];
    });
}

/* ==========================================
   PREPARAR FORMULARIO DE REPORTES
========================================== */

function prepararFormularioC() {
    const formulario = document.getElementById("reporteForm");

    if (!formulario) return;

    /* Tipo de reporte */

    if (!document.getElementById("tipoReporte")) {
        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "tipoReporte";
        etiqueta.textContent = "Tipo de reporte:";

        const tipo = document.createElement("select");
        tipo.id = "tipoReporte";
        tipo.required = true;

        tipo.innerHTML = `
            <option value="">Selecciona el tipo de reporte</option>
            <option value="Luminaria">Luminaria</option>
            <option value="Bacheo">Bacheo</option>
        `;

        const asunto = document.getElementById("asunto");

        formulario.insertBefore(etiqueta, asunto);
        formulario.insertBefore(tipo, asunto);
    }

    /* Entre calles */

    if (!document.getElementById("entreCalles")) {
        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "entreCalles";
        etiqueta.textContent = "Entre qué calles se encuentra:";

        const campo = document.createElement("input");
        campo.type = "text";
        campo.id = "entreCalles";
        campo.placeholder = "Ejemplo: entre calle Hidalgo y Morelos";
        campo.required = true;

        const descripcion = document.getElementById("descripcion");

        formulario.insertBefore(etiqueta, descripcion);
        formulario.insertBefore(campo, descripcion);
    }

    /* Gravedad del bache */

    if (!document.getElementById("gravedad")) {
        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "gravedad";
        etiqueta.textContent = "Gravedad del problema:";

        const gravedad = document.createElement("select");
        gravedad.id = "gravedad";
        gravedad.innerHTML = `
            <option value="">Selecciona la gravedad</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
        `;

        gravedad.required = true;

        const boton = formulario.querySelector("button[type='submit']");

        formulario.insertBefore(etiqueta, boton);
        formulario.insertBefore(gravedad, boton);
    }

    /* Ajustar campos según el tipo de reporte */

    const tipo = document.getElementById("tipoReporte");
    const gravedad = document.getElementById("gravedad");

    function actualizarCampos() {
        const esBacheo = tipo.value === "Bacheo";

        gravedad.disabled = !esBacheo;
        gravedad.required = esBacheo;

        if (!esBacheo) {
            gravedad.value = "";
        }
    }

    tipo.addEventListener("change", actualizarCampos);
    actualizarCampos();
}

/* ==========================================
   REGISTRAR REPORTE
========================================== */

function registrarReporteC(event) {
    event.preventDefault();

    const ciudadano = JSON.parse(
        localStorage.getItem("ciudadanoActual")
    );

    const usuario = localStorage.getItem("usuarioActual");

    if (!usuario || !ciudadano) {
        alert("Inicia sesión como ciudadano antes de enviar un reporte.");
        return;
    }

    const tipo = document.getElementById("tipoReporte").value;
    const asunto = document.getElementById("asunto").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const entreCalles = document.getElementById("entreCalles").value.trim();
    const gravedad = document.getElementById("gravedad").value;

    if (!tipo || !asunto || !descripcion || !ubicacion || !entreCalles) {
        alert("Completa todos los campos del reporte.");
        return;
    }

    if (tipo === "Bacheo" && !gravedad) {
        alert("Selecciona la gravedad del bache.");
        return;
    }

    const reportes = obtenerReportesC();

    const nuevoReporte = {
        id: Date.now(),
        usuario: usuario,
        nombre: ciudadano.nombre || usuario,
        tipo: tipo,
        asunto: asunto,
        descripcion: descripcion,
        ubicacion: ubicacion,
        entreCalles: entreCalles,
        gravedad: tipo === "Bacheo" ? gravedad : "No aplica",
        fecha: new Date().toLocaleDateString("es-MX"),
        estado: "Pendiente"
    };

    reportes.push(nuevoReporte);
    guardarReportesC(reportes);

    alert("Tu reporte se registró correctamente.");

    window.location.href = "mis-reportes.html";
}

/* ==========================================
   MOSTRAR REPORTES
========================================== */

function mostrarReportesC() {
    const lista = document.getElementById("listaReportes");

    if (!lista) return;

    const reportes = obtenerReportesC();
    const esPanelCOPACI = window.location.pathname
        .toLowerCase()
        .endsWith("consultar.html");

    const usuario = localStorage.getItem("usuarioActual");

    const reportesMostrar = esPanelCOPACI
        ? reportes
        : reportes.filter(reporte => reporte.usuario === usuario);

    lista.innerHTML = "";

    if (reportesMostrar.length === 0) {
        lista.innerHTML = `
            <article class="tarjeta">
                <h3>No hay reportes registrados</h3>
                <p>
                    ${esPanelCOPACI
                        ? "Todavía no existen reportes ciudadanos."
                        : "Aún no has realizado ningún reporte."}
                </p>
            </article>
        `;
        return;
    }

    reportesMostrar.forEach(function(reporte) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `
            <h3>${protegerTextoC(reporte.tipo || reporte.asunto || "Reporte")}</h3>

            <p><strong>Folio:</strong> ${protegerTextoC(reporte.id)}</p>
            <p><strong>Ciudadano:</strong> ${protegerTextoC(reporte.nombre || reporte.usuario)}</p>
            <p><strong>Asunto:</strong> ${protegerTextoC(reporte.asunto)}</p>
            <p><strong>Descripción:</strong> ${protegerTextoC(reporte.descripcion)}</p>
            <p><strong>Ubicación:</strong> ${protegerTextoC(reporte.ubicacion)}</p>
            <p><strong>Entre calles:</strong> ${protegerTextoC(reporte.entreCalles || "No especificado")}</p>
            <p><strong>Gravedad:</strong> ${protegerTextoC(reporte.gravedad || "No especificada")}</p>
            <p><strong>Fecha:</strong> ${protegerTextoC(reporte.fecha || "No especificada")}</p>
            <p><strong>Estado:</strong> ${protegerTextoC(reporte.estado || "Pendiente")}</p>
        `;

        /* Los botones para atender solo aparecen en consultar.html */

        if (esPanelCOPACI) {
            const controles = document.createElement("div");

            controles.innerHTML = `
                <hr>
                <h4>Actualizar estado</h4>
                <button type="button" data-estado="Pendiente">Pendiente</button>
                <button type="button" data-estado="En proceso">En proceso</button>
                <button type="button" data-estado="Resuelto">Resuelto</button>
            `;

            controles.querySelectorAll("button").forEach(function(boton) {
                boton.addEventListener("click", function() {
                    cambiarEstadoC(reporte.id, boton.dataset.estado);
                });
            });

            tarjeta.appendChild(controles);
        }

        lista.appendChild(tarjeta);
    });
}

/* ==========================================
   CAMBIAR ESTADO DEL REPORTE
========================================== */

function cambiarEstadoC(id, nuevoEstado) {
    const reportes = obtenerReportesC();

    const reporte = reportes.find(function(elemento) {
        return String(elemento.id) === String(id);
    });

    if (!reporte) {
        alert("No se encontró el reporte.");
        return;
    }

    reporte.estado = nuevoEstado;

    guardarReportesC(reportes);
    mostrarReportesC();

    alert("El estado cambió a: " + nuevoEstado);
}

/* Mantener disponible la función para los controles */

window.cambiarEstado = cambiarEstadoC;

/* ==========================================
   INICIAR APARTADO C
========================================== */

document.addEventListener("DOMContentLoaded", function() {
    prepararFormularioC();

    const formulario = document.getElementById("reporteForm");

    if (formulario) {
        formulario.addEventListener("submit", registrarReporteC);
    }

    mostrarReportesC();
});
