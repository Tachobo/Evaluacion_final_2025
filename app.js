// IMPORTACIÓN DE MÓDULOS
// Importamos la librería para capturar datos por consola.
import PromptSync from 'prompt-sync';

/* Importamos las funciones desde './modulos/index.js'. 
Gracias al archivo 'index.js' (barril), no necesitamos importar 
ruta por ruta de cada ejercicio, centralizamos todo aquí. */
import { ejecutarEjercicio1 } from './modulos/index.js';
import { ejecutarEjercicio2 } from './modulos/index.js';
import { ejecutarEjercicio3 } from './modulos/index.js';

// Inicializamos prompt-sync
const prompt = PromptSync();

/* FUNCIÓN PRINCIPAL DEL MENÚ
Se define como 'async' porque adentro invocaremos ejercicios 
que realizan operaciones asíncronas (como Promesas y Timeouts). */
async function menuPrincipal() {
    let salir = false; // Bandera de control para mantener el menú abierto.

    // Bucle principal: se repetirá hasta que el usuario decida salir.
    while (!salir) {
        console.log();
        console.log("EJERCICIOS");
        console.log();
        console.log("1. Ejecutar Sistema de Solicitudes");
        console.log("2. Validación de operaciones");
        console.log("3. Validación solicitudes de acceso");
        console.log("0. Salir");
        console.log();
        
        // Capturamos la opción del usuario
        const opcion = prompt("Seleccione una opción: ");

        /*ESTRUCTURA DE CONTROL SWITCH
        Evaluamos la opción ingresada. Usamos 'await' en las llamadas
        a los ejercicios para que el menú "espere" a que el ejercicio 
        termine antes de volver a mostrar las opciones.
        */
        switch (opcion) {
            case '1':
                console.clear(); // Limpia la consola para mayor orden (opcional).
                // Llamamos a la función exportada del Ejercicio 1.
                // Usamos 'await' porque esa función es asíncrona.
                await ejecutarEjercicio1(); 
                break;

            case '2':
                console.clear();
                await ejecutarEjercicio2(); 
                break;

            case '3':
                console.clear();
                await ejecutarEjercicio3(); 
                break;

            case '0':
                console.log("\nCerrando el sistema... ¡Hasta nunca!");
                salir = true; // Cambiamos la bandera para romper el ciclo 'while'.
                break;

            default:
                // Manejo de entradas no contempladas en el menú.
                console.log("\nError: '" + opcion + "' no es una opción válida.");
                break;
        }
    }
}

// EJECUCIÓN INICIAL
// Invocamos la función del menú para arrancar la aplicación.
menuPrincipal();