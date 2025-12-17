1. Documentación Técnica

Datos de Entrada:
Identificador: Número entero único. Se valida que no esté repetido para no cruzar información.
Nombre: Texto. No puede estar vacío.
Prioridad: Número del 0 al 10. Si es bajo en solicitudes "urgentes", el sistema lo rechaza.
Captura: Se usa prompt para recibir el dato y try/catch para validar que sea el tipo correcto (ej: que no metan letras en el ID).

Descripción del Proceso:
Variables: solicitudes (es nuestra lista o arreglo de objetos).
Ciclos: Usamos un while para que puedas registrar cuantas personas quieras y un for para procesarlas todas al final.

Lógica Principal: El programa revisa si la solicitud está activa. Luego, usa un Callback para contar requisitos y una Promesa para simular el tiempo de procesamiento (2 segundos).

Manejo de Errores: Si pones un ID repetido, el programa lanza un mensaje: "Error: El identificador ya existe". Gracias al try/catch, el programa no se traba y te pide el dato otra vez.