Documentación Técnica


Datos de Entrada

Identificador: Número entero único. Se valida que no esté repetido para no cruzar información.

Nombre: Texto. No puede estar vacío.
Tipo de solicitud: ejemplo (urgente)

Prioridad: Número del 0 al 10. Si es bajo en solicitudes "urgentes", el sistema lo rechaza.

Estado (booleano): true (activo) o false (inactivo)


Procesos

Captura de información y validación: Se usa un bucle while y varios bloques try/catch, para cada dato igresado, con el fin de que, no existan identificadores duplicados(para esto de uso .some), los datos ingresados sean correctos segun las reglas anteriormente mencionadas y que no se permitan datos vacios.

Analisis de requisitos mediante el uso de callback: Se implemento una función llamada analizarRequisitosConCallback para procesar el arreglo de requisitos recibido, dicha funcion realiza un conteo de cuantos valores de ellos son true, y ejecuta otra funcion que informa el resultado final de dicho conteo. 

Validación por medio de promesa: Se uso la promesa llamada proesarAsincronoConPromesa, esto simula la verificación externa con un retardo de 2 segundos, en este caso se uso como regla el tipo de solicitud y prioridad, para ser resuelta la promesa con exito en base a esta regla, debe ser urgente con una prioridad mayor o igual a 8, si no se cumple con esto, la promesa se rechaza, caso contrario, se resuelve con exito. 

Control de flujo y procesamiento en secuencia: El sistema recorre el conjunto de solicitudes con un bloque for of, se uso await para que cada solicitud se procese de manera ordenada.


Manejo de errores

Validación: Se lanzan errores con throw new error, si los datos no cumplen los requisitos estipulados. 

Proteccion del ciclo: Cada iteracion del proceso esta envuelto en un bloque try catch, con el fin de que, si una solicitud falla, ya sea por validacion o porque la promesa fue rechazada, el error sea capturado y mostrado en consola, asi el sistema puede continuar con la siguiente solicitud sin detenerse.


Datos de salida

Confirmación de registro de cada ID.

Resumen del análisis de requisitos (vía callback).

Resultado de Aprobación: Mensaje de éxito si la promesa se resuelve.

Resultado de Fallo: Mensaje detallado del error si la solicitud es rechazada o inválida.

Mensaje de cierre: "PROCESAMIENTO COMPLETO".


Justificación técnica

Uso de async/await: Permite manejar la simulación de red o procesos pesados de forma legible, evitando el uso del triangulo infernal de las callback.

Desestructuración de Objetos: Se utiliza para acceder a las propiedades de la solicitud de forma limpia y eficiente en las validaciones.

Modularización: La separación de lógica (validación, captura, procesamiento) facilita la escalabilidad del código.

Robustez: El uso intensivo de try/catch garantiza que el sistema sea tolerante a fallos y que un dato corrupto no rompa toda la ejecución.
