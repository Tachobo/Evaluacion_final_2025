/* Se importa la librería prompt-sync para poder solicitar datos al usuario por consola.
Esto es necesario porque Node.js no permite capturar entradas de forma directa. */
import PromptSync from 'prompt-sync';
const prompt = PromptSync();

// Definimos los límites para la prioridad. Usamos 'const' para que estos valores sean fijos.
const MIN_PRIORIDAD = 0;
const MAX_PRIORIDAD = 10;

/* Esta función revisa si el nuevo identificador ya existe en la lista de solicitudes.
Recibe el nuevo ID y el arreglo de IDs existentes para compararlos. */
const validarDuplicidad = (identificador, solicitudesExistentes) => {
    // Usamos el método .some() para buscar la coincidencia. Devuelve 'true' en el primer match.
    const esDuplicado = solicitudesExistentes.some(sol => sol.identificador === identificador);
    if (esDuplicado) {
    // Si hay duplicado, se lanza un error que será atrapado por el try/catch de la captura.
        throw new Error(" El identificador ya existe, no puede estar repetido.");
    }
};

/* Esta función se encarga de la validación estricta de todos los tipos y rangos de datos.
Lanza un error si encuentra cualquier dato inválido antes del procesamiento asíncrono. */
const validarDatosSolicitud = (solicitud) => {
    // Desestructuramos el objeto para acceder a las propiedades de forma limpia.
    const { identificador, nombre, tipoSolicitud, prioridad, estadoInicial, requisitosCumplidos } = solicitud;

    // Validación de Identificador: comprueba que sea un número entero positivo.
    if (typeof identificador !== 'number' || isNaN(identificador) || identificador % 1 != 0 || identificador <= 0) {
        throw new Error(" El Identificador debe ser un número entero positivo.");
    }

    // Validación de Nombre: comprueba que sea un 'string' y que .trim().length > 0 (no solo espacios).
    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
        throw new Error(" El Nombre debe ser una cadena de texto no vacía.");
    }

    // Validación de Prioridad: comprueba que sea un número entero entre los límites 0 y 10.
    if (typeof prioridad !== 'number' || !Number.isInteger(prioridad) || prioridad < MIN_PRIORIDAD || prioridad > MAX_PRIORIDAD) {
        throw new Error(" La prioridad debe ser un número ENTERO entre " + MIN_PRIORIDAD + " y " + MAX_PRIORIDAD);
    }

    // Validación de Estado: comprueba que el valor sea estrictamente booleano.
    if (typeof estadoInicial !== 'boolean') {
        throw new Error(" El estado debe ser verdadero o falso.");
    }
    
    // Validación de Requisitos: comprueba que sea un arreglo válido y no vacío.
    if (!Array.isArray(requisitosCumplidos) || requisitosCumplidos.length === 0) {
        throw new Error(" La lista de requisitos no es válida.");
    }
};

/* Función que cumple el requisito de usar Callbacks.
Recorre la lista de requisitos y ejecuta el 'callback' al finalizar el conteo. */
const analizarRequisitosConCallback = (requisitos, callback) => {
    let cumplidos = 0;
    // Se usa for...of para recorrer el arreglo y mutar el contador.
    for (const requisito of requisitos) {
        if (requisito === true) {
            cumplidos++;
        }
    }
    // Llama al callback, entregando el mensaje y el resultado final del conteo.
    callback("Se analizaron los requisitos.", cumplidos);
};

/* Función que cumple el requisito de usar Promesas. Simula una operación asincrónica
de 2 segundos. Se resuelve si cumple la lógica de negocio o se rechaza si falla. */
const procesarAsincronoConPromesa = (solicitud) => {
    return new Promise((resolve, reject) => {
        // Usamos setTimeout para simular la espera de la operación externa (2 segundos).
        setTimeout(() => {
            // Regla de negocio: Si el tipo es 'urgente' y la prioridad es baja (< 8), la Promesa se rechaza.
            if (solicitud.tipoSolicitud.toLowerCase() === 'urgente' && solicitud.prioridad < 8) {
                reject("Fallo: Solicitud Urgente necesita prioridad alta.");
            } else {
                // Si la lógica es válida, la Promesa se resuelve con el mensaje de éxito.
                resolve("Exito: La solicitud de " + solicitud.nombre + " fue procesada.");
            }
        }, 2000); 
    });
};

/* Función que maneja toda la entrada de datos del usuario.
Utiliza el patrón 'while (!valorValido)' junto con 'try/catch' para
forzar la validación estricta de cada campo antes de que el flujo avance.
*/
const capturarSolicitud = (solicitudesExistentes) => {
    console.log("\n Ingreso de datos");
    // Se crea un NUEVO objeto vacío. Este objeto es la UNIDAD DE DATOS (una solicitud individual).
    const solicitud = {}; 
    let valorValido = false; // Bandera de control para los bucles de validación.

    /* Bucle para el Identificador:
    1. El 'while' asegura que el usuario ingrese un valor válido (número entero único).
    2. El 'try' intenta convertir y validar la unicidad.
    3. Si falla 'parseInt()' o 'validarDuplicidad()', el error pasa al 'catch'.
    4. Si tiene éxito, 'valorValido = true' detiene el bucle. */
    while (!valorValido) {
        try {
            const input = parseFloat(prompt("1. Ingrese el identificador (numero entero): "));
            if (isNaN(input) || input % 1 != 0) throw new Error("Debe ser un número entero.");
            validarDuplicidad(input, solicitudesExistentes); // Valida que el ID no esté repetido.
            solicitud.identificador = input;
            valorValido = true;
        } catch (error) {
            console.error(error.message); // Muestra el error y el bucle reinicia.
        }
    }

    /* Bucle para el Nombre:
    1. Se reinicia 'valorValido' a 'false'.
    2. La condición 'if' verifica que 'input' exista, sea 'string', y que '.trim().length > 0' (no solo espacios).
    3. Si se cumple, se asigna el dato y se sale del bucle. */
    valorValido = false;
    while (!valorValido) {
        const input = prompt("2. Ingrese el nombre: ");
        if (typeof input === 'string' && input.trim().length > 0) {
            solicitud.nombre = input;
            valorValido = true; 
        } else {
            console.error("Error: El nombre debe ser texto y no puede estar vacío.");
        }
    }
    
    /* Bucle para Tipo de Solicitud:
       El proceso es idéntico al del Nombre, solo verifica que el texto no esté vacío. */
    valorValido = false;
    while (!valorValido) {
        const input = prompt("3. Ingrese tipo solicitud (ej. urgente): ");
        if (input && input.trim().length > 0) {
            solicitud.tipoSolicitud = input;
            valorValido = true;
        } else {
            console.error("Error: El tipo de solicitud no puede estar vacío.");
        }
    }

    /* Bucle para la Prioridad:
    1. Usa 'try/catch' para manejar errores de 'parseInt()'.
    2. El 'if' evalúa tres condiciones obligatorias: que sea número, que sea entero, y que esté en el rango 0-10.
    3. Si alguna de las condiciones es falsa, lanza un error que reinicia el bucle. */
    valorValido = false;
    while (!valorValido) {
        try {
            const input = parseFloat(prompt("4. Ingrese prioridad (0-10, solo números enteros): "));
            if (isNaN(input) || input % 1 != 0 || input < 0 || input > 10) {
                throw new Error("Número inválido. Debe ser un número ENTERO entre 0 y 10.");
            }
            solicitud.prioridad = input;
            valorValido = true;
        } catch (error) {
            console.error(error.message);
        }
    }

    /* Bucle para el Estado Inicial:
       Valida la entrada del usuario y la convierte a booleano, que es el tipo de dato requerido. */
    valorValido = false;
    while (!valorValido) {
        const input = prompt("5. Ingrese estado (activo/inactivo): ").toLowerCase();
        if (input === 'activo' || input === 'inactivo') {
            solicitud.estadoInicial = (input === 'activo'); // Asigna 'true' o 'false'.
            valorValido = true;
        } else {
            console.error("Error: Escriba 'activo' o 'inactivo'.");
        }
    }

    // Asignación de Requisitos Cumplidos (Arreglo fijo para simular la entrada).
    solicitud.requisitosCumplidos = [true, true, true, false, true]; 

    return solicitud; // Retorna el objeto unitario para ser agregado al arreglo principal.
};

/* Función principal que controla todo el flujo del programa.
Utiliza 'async' para habilitar el uso de 'await' en el manejo de Promesas. */
export async function ejecutarEjercicio1(){
    // Se declara el arreglo que almacenará el conjunto de objetos (solicitudes)
    const solicitudes = []; 

    console.log("SISTEMA DE VALIDACIÓN DE SOLICITUDES");

    /* Primer Bucle: Captura de múltiples solicitudes.
       Se ejecuta con 'while(true)' y solo se detiene con la instrucción 'break'. */
    while (true) {
        try {
            const nueva = capturarSolicitud(solicitudes); // Captura y retorna un objeto unitario.
            // Añade el objeto retornado ('nueva') a la colección principal ('solicitudes').
            // De esta forma, 'solicitudes' se convierte en el ARREGLO DE OBJETOS requerido.
            solicitudes.push(nueva); 
            
            console.log(`\n Solicitud ID ${nueva.identificador} registrada.`);
            let continuar = prompt("¿Desea agregar otra? (si/no): ");
            if (continuar.toLowerCase() !== 'si') {
                break; // Detiene el bucle de captura.
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    console.log("\nINICIANDO PROCESAMIENTO...");

    /* Segundo Bucle: Procesamiento individual y secuencial.
       El 'for...of' recorre la colección de objetos (el arreglo 'solicitudes'). */
    for (const solicitud of solicitudes) {
        console.log(`Analizando ID: ${solicitud.identificador}`);
        
        /* Bloque try/catch: Este es el mecanismo de Manejo de Errores que permite que el programa no se detenga.
           Si una solicitud falla, el catch la registra y permite que el bucle continúe con la siguiente. */
        try {
            // 1. Ejecutamos la validación síncrona final.
            validarDatosSolicitud(solicitud);

            // 2. Control de Flujo: Rechazo Rápido.
            if (solicitud.estadoInicial === false) {
                console.log("Solicitud rechazada: El estado es INACTIVO.");
                continue; // 'continue' pasa inmediatamente al siguiente elemento del arreglo, ahorrando tiempo.
            }

            // 3. Ejecutamos la función con Callback.
            analizarRequisitosConCallback(solicitud.requisitosCumplidos, (mensaje, total) => {
                console.log(` ${mensaje} Requisitos cumplidos: ${total} de ${solicitud.requisitosCumplidos.length}.`);
            });

            // 4. Uso de AWAIT: Espera el resultado del proceso asíncrono (Promesa).
            const resultado = await procesarAsincronoConPromesa(solicitud);
            
            // 5. Salida de Éxito.
            console.log(`APROBADA y PROCESADA: ${resultado}`);

        } catch (error) {
            // El 'catch' atrapa tanto los 'throw' como los 'reject' de la Promesa.
            console.error(`FALLO (ID: ${solicitud.identificador}): ${error.message || error}`);
        }
        
        console.log();
    }

    console.log("PROCESAMIENTO COMPLETO. FIN DEL SISTEMA");
}