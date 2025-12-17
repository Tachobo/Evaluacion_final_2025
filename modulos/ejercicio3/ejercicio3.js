
import PromptSync from 'prompt-sync';
const prompt = PromptSync();

// CONFIGURACIÓN DE REGLAS (Inmutabilidad) 
const REGLAS_ROL_PERMISOS = {
    "admin": ["lectura", "escritura", "borrado"],
    "editor": ["lectura", "escritura"],
    "visitante": ["lectura"]
};

/* Función con CALLBACK para validar reglas básicas de negocio.
Justificación: Creada para desacoplar la lógica de aceptación de términos y edad.
Recibe: Objeto solicitud y una función de validación.
Retorna: Booleano (true si pasa las reglas básicas). */
const validarReglasBasicas = (solicitud, callback) => {
    const { edad, aceptoCondiciones } = solicitud;
    // La regla básica es ser mayor de edad y haber aceptado términos.
    const cumple = edad >= 18 && aceptoCondiciones === true;
    return callback(cumple);
};

/* Función que retorna una PROMESA para simular validación de antecedentes.
Justificación: Simula latencia de red y una verificación externa asincrónica.
Recibe: Nombre del solicitante (string).
Retorna: Promesa que resuelve un string o rechaza con el motivo. */
const validarAntecedentesExternos = (nombre) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulación: Si el nombre tiene más de 15 caracteres, falla por "error de sistema"
            if (nombre.length > 15) {
                reject("Fallo en la conexión con la base de datos de antecedentes.");
            }
            // Simulación: Algunos usuarios específicos son rechazados por seguridad
            const listaNegra = ["Admin123", "Root", "Hack"];
            if (listaNegra.includes(nombre)) {
                resolve("RECHAZADO: El solicitante se encuentra en la lista de restricción.");
            } else {
                resolve("APROBADO: Sin antecedentes negativos.");
            }
        }, 1200);
    });
};

/* Función de captura de datos por terminal. */
const capturarSolicitud = (existentes) => {
    console.log("\n--- Nueva Solicitud de Acceso ---");
    const s = {};

    // ID Único
    let idValido = false;
    while (!idValido) {
        const idInput = parseInt(prompt("ID de solicitud: "));
        if (!isNaN(idInput) && !existentes.some(sol => sol.id === idInput)) {
            s.id = idInput;
            idValido = true;
        } else { console.error("ID inválido o repetido."); }
    }

    s.nombre = prompt("Nombre del solicitante: ");
    s.edad = parseInt(prompt("Edad: "));
    s.rol = prompt("Rol solicitado (admin, editor, visitante): ").toLowerCase();
    
    // Captura de Arreglo de Permisos
    console.log("Ingrese permisos separados por coma (ej: lectura,escritura):");
    s.permisos = prompt("> ").toLowerCase().split(',').map(p => p.trim());
    
    s.aceptoCondiciones = prompt("¿Acepta condiciones? (s/n): ").toLowerCase() === 's';
    s.estado = "En revisión";

    return s;
};

/* Función Principal ASYNC/AWAIT para coordinar el proceso. */
export async function ejecutarEjercicio3(){
    const solicitudes = [];
    
    // Fase de entrada de datos
    while (true) {
        solicitudes.push(capturarSolicitud(solicitudes));
        if (prompt("¿Agregar otra solicitud? (s/n): ").toLowerCase() !== 's') break;
    }

    console.log("\n=== INICIANDO AUDITORÍA DE ACCESOS ===");

    // Fase de procesamiento con Inmutabilidad
    for (const sol of solicitudes) {
        console.log(`\nSolicitud #${sol.id} - Solicitante: ${sol.nombre}`);
        
        try {
            // VALIDACIÓN DE INTEGRIDAD (Tipos de datos)
            if (isNaN(sol.edad)) throw new Error("La edad debe ser un número.");
            if (!sol.nombre || sol.nombre.length < 3) throw new Error("Nombre demasiado corto.");
            if (sol.permisos.length === 0 || sol.permisos[0] === "") throw new Error("La lista de permisos no puede estar vacía.");

            // VALIDACIÓN DE COHERENCIA (Rol vs Permisos)
            const permisosPermitidos = REGLAS_ROL_PERMISOS[sol.rol] || [];
            const tienePermisosInvalidos = sol.permisos.some(p => !permisosPermitidos.includes(p));
            
            if (tienePermisosInvalidos) {
                throw new Error(`El rol '${sol.rol}' no tiene autorización para los permisos solicitados.`);
            }

            // VALIDACIÓN DE REGLAS BÁSICAS (Uso de Callback)
            const pasaReglasBasicas = validarReglasBasicas(sol, (resultado) => {
                if (!resultado) {
                    if (sol.edad < 18) return "Menor de edad.";
                    if (!sol.aceptoCondiciones) return "No aceptó condiciones.";
                }
                return "OK";
            });

            if (pasaReglasBasicas !== "OK") {
                throw new Error(`Reglas básicas no cumplidas: ${pasaReglasBasicas}`);
            }

            // VALIDACIÓN EXTERNA (Uso de Promesa con Await)
            console.log("Consultando antecedentes...");
            const resultadoExterno = await validarAntecedentesExternos(sol.nombre);
            
            if (resultadoExterno.includes("RECHAZADO")) {
                console.log(`Resultado: RECHAZADA`);
                console.log(`Motivo: ${resultadoExterno}`);
            } else {
                console.log(`Resultado: APROBADA`);
                console.log(`Motivo: Datos consistentes y ${resultadoExterno}`);
            }

        } catch (error) {
            /* Manejo de errores*/
            const mensajeFinal = error.message || error;
            console.error(`Resultado: RECHAZADA`);
            console.error(`Motivo: ${mensajeFinal}`);
        }
    }
    
    console.log("\nAuditoría finalizada");
}
