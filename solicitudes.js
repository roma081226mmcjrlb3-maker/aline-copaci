// OBTENER DATOS DEL CIUDADANO

let ciudadano = null;

try {

    ciudadano = JSON.parse(
        localStorage.getItem("ciudadanoActual")
    );

} catch (error) {

    ciudadano = null;

}


// BUSCAR CIUDADANO SI NO HAY DATOS GUARDADOS

if (!ciudadano) {

    const usuarioActual = localStorage.getItem("usuarioActual");

    let ciudadanos = [];

    try {

        ciudadanos = JSON.parse(
            localStorage.getItem("ciudadanos")
        ) || [];

    } catch (error) {

        ciudadanos = [];

    }

    ciudadano = ciudadanos.find(function(persona) {

        return persona && persona.usuario === usuarioActual;

    });

}


// MOSTRAR DATOS DEL CIUDADANO

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


// GENERAR SOLICITUD DE CONSTANCIA

window.solicitarConstancia = function() {

    if (!ciudadano) {
        return;
    }

    let constancias = [];

    try {

        constancias = JSON.parse(
            localStorage.getItem("constancias")
        ) || [];

        if (!Array.isArray(constancias)) {
            constancias = [];
        }

    } catch (error) {

        constancias = [];

    }


    // GENERAR FOLIO Y FECHA

    const folio =
        "COPACI-" + Date.now().toString().slice(-8);

    const fecha = new Date().toLocaleDateString("es-MX");


    // CREAR SOLICITUD

    const solicitud = {

        folio: folio,
        nombre: ciudadano.nombre,
        direccion: ciudadano.direccion,
        usuario: ciudadano.usuario,
        correo: ciudadano.correo,
        fecha: fecha,
        estado: "Pendiente"

    };


    // GUARDAR SOLICITUD

    constancias.push(solicitud);

    localStorage.setItem(
        "constancias",
        JSON.stringify(constancias)
    );


    // MOSTRAR DATOS EN EL COMPROBANTE

    document.getElementById("folio").textContent = folio;

    document.getElementById("fecha").textContent = fecha;

    document.getElementById("nombreComprobante").textContent =
        ciudadano.nombre || "";

    document.getElementById("direccionComprobante").textContent =
        ciudadano.direccion || "";

    document.getElementById("correoComprobante").textContent =
        ciudadano.correo || "";


    // MOSTRAR COMPROBANTE

    document.getElementById("comprobante").style.display = "block";

    document.getElementById("mensaje").textContent =
        "¡Tu solicitud se generó correctamente!";

};
