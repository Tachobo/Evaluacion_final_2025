/* Se importa la librería para interactuar con la consola.
Node.js requiere este módulo para capturar lo que el usuario escribe. */
import PromptSync from 'prompt-sync';
const prompt = PromptSync();

/* Definimos constantes para las reglas de negocio.
Usamos inmutabilidad (const) porque los límites de operación y prioridad
son reglas fijas que no deben cambiar durante la ejecución. */
const VALOR_MAXIMO = 10000;
const PRIORIDAD_MIN = 1;
const PRIORIDAD_MAX = 5;

/* Función para validar que los datos de la solicitud sean consistentes.
Comprueba tipos de datos y rangos antes de permitir el procesamiento. */
const validarConsistencia = (operacion) => {
    const { id, tipo, valor, prioridad } = operacion;

    if (typeof id !== 'number' || id <= 0) {
        throw new Error("ID inválido: debe ser un número positivo.");
    }
    if (typeof tipo !== 'string' || tipo.trim().length === 0) {
        throw new Error("Tipo inválido: la operación no puede estar vacía.");
    }
    if (typeof valor !== 'number' || valor < 0 || valor > VALOR_MAXIMO) {
        throw new Error(`Valor fuera de rango: máximo permitido ${VALOR_MAXIMO}.`);
    }
    if (prioridad < PRIORIDAD_MIN || prioridad > PRIORIDAD_MAX) {
        throw new Error(`Prioridad fuera de rango: debe ser entre ${PRIORIDAD_MIN} y ${PRIORIDAD_MAX}.`);
    }
};

/* Función que implementa un CALLBACK.
Se encarga de aplicar un "impuesto" o "tasa" al valor de la operación.
El callback permite que la acción final dependa de una lógica externa. */
const aplicarTasaConCallback = (valor, callback) => {
    // Calculamos una tasa fija del 10%
    const tasa = valor * 0.10;
    const valorFinal = valor + tasa;
    // Ejecutamos el callback para devolver el resultado procesado
    callback(valorFinal);
};

/* Función que implementa una PROMESA.
Simula la verificación de fondos o permisos en un servidor externo. */
const verificarServidorConPromesa = (id) => {
    return new Promise((resolve, reject) => {
        /* Simulamos un retraso de 1.5 segundos para representar un proceso asíncrono. */
        setTimeout(() => {
            // Simulamos que las operaciones con ID par son aprobadas por el servidor
            if (id % 2 === 0) {
                resolve("Servidor: Conexión exitosa y fondos verificados.");
            } else {
                reject("Servidor: Fondos insuficientes o error de conexión.");
            }
        }, 1500);
    });
};

/* Función para capturar los datos de cada solicitud operativa.
Retorna un objeto con la información validada. */
const capturarOperacion = (existentes) => {
    console.log("\n--- Registro de Nueva Operación ---");
    const operacion = {};
    let esValido = false;

    /* Captura de ID:
    Usa un bucle para asegurar que el ID sea un número y no esté repetido. */
    while (!esValido) {
        try {
            const input = parseInt(prompt("ID de operación: "));
            if (isNaN(input)) throw new Error("El ID debe ser un número.");
            if (existentes.some(o => o.id === input)) throw new Error("ID ya registrado.");
            operacion.id = input;
            esValido = true;
        } catch (e) { console.error(e.message); }
    }

    /* Captura de Tipo:
    Valida que solo contenga letras usando la lógica simple de 'includes'. */
    esValido = false;
    while (!esValido) {
        const input = prompt("Tipo de operación (solo letras): ");
        const tieneNumeros = '0123456789'.split('').some(n => input.includes(n));
        if (input && input.trim().length > 0 && !tieneNumeros) {
            operacion.tipo = input;
            esValido = true;
        } else { console.error("Error: Solo se permiten letras."); }
    }

    /* Captura de Valor:
    Asegura que el valor sea numérico. */
    esValido = false;
    while (!esValido) {
        const input = parseFloat(prompt("Valor asociado: "));
        if (!isNaN(input) && input >= 0) {
            operacion.valor = input;
            esValido = true;
        } else { console.error("Error: Ingrese un valor numérico válido."); }
    }

    /* Captura de Prioridad y Estado:
    Se definen valores básicos para el flujo del ejercicio. */
    operacion.prioridad = Math.floor(Math.random() * 5) + 1; // Prioridad aleatoria 1-5
    operacion.estado = true; // Estado inicial activo

    return operacion;
};

/* Función principal 'ejecutar'.
Gestiona el flujo asíncrono con async/await y genera el resumen final. */
export async function ejecutarEjercicio2(){
    // Arreglo de objetos (Colección principal)
    const solicitudes = []; 
    
    // Contadores para el resumen final
    let aprobadas = 0;
    let rechazadas = 0;
    let invalidas = 0;

    /* Bucle de captura:
    Permite al usuario llenar el arreglo de objetos. */
    while (true) {
        const op = capturarOperacion(solicitudes);
        solicitudes.push(op); // Guardamos el objeto en el arreglo
        if (prompt("¿Registrar otra? (s/n): ").toLowerCase() !== 's') break;
    }

    console.log("\n=== PROCESANDO JORNADA LABORAL ===");

    /* Bucle de procesamiento:
    Recorre el arreglo de objetos de forma secuencial. */
    for (const item of solicitudes) {
        console.log(`\n> Operación #${item.id} [${item.tipo}]`);

        /* El bloque try/catch asegura que si una solicitud falla, 
        el sistema pase a la siguiente sin detenerse. */
        try {
            // Validación de datos
            validarConsistencia(item);

            // Uso de Callback para proceso dependiente
            aplicarTasaConCallback(item.valor, (nuevoValor) => {
                console.log(`   - Tasa aplicada. Valor ajustado: ${nuevoValor}`);
            });

            // Uso de await para la Promesa del servidor
            const respuesta = await verificarServidorConPromesa(item.id);
            console.log(`   - ${respuesta}`);
            console.log("RESULTADO: Operación Aprobada.");
            aprobadas++;

        } catch (error) {
            /* Extraemos el mensaje de error de forma segura. Si error.message no existe, usamos el error directamente. */
            const mensajeFinal = error.message || error;

            if (mensajeFinal.includes("Servidor")) {
                console.error(`RECHAZADA: ${mensajeFinal}`);
                rechazadas++;
            } else {
                console.error(`INVÁLIDA: ${mensajeFinal}`);
                invalidas++;
            }
        }
    }

    /* Resumen Final:
    Muestra las estadísticas de la ejecución. */
    console.log();
    console.log("RESUMEN FINAL");
    console.log();
    console.log(`Total Procesadas: ${solicitudes.length}`);
    console.log(`Aprobadas:        ${aprobadas}`);
    console.log(`Rechazadas:       ${rechazadas}`);
    console.log(`Inválidas:        ${invalidas}`);
    console.log();
}
