Documento de Evaluación: Ejercicio 1 (Solicitudes y Urgencia)
• Datos de prueba seleccionados
ID Duplicado: Ingresar el ID 101 dos veces seguidas.

Urgencia sin Prioridad: Tipo: "Urgente", Prioridad: 5.

Datos correctos: Tipo: "Normal", Prioridad: 9, ID: 105.

• Justificación 
El ID repetido prueba que la función validarDuplicidad detenga el proceso antes de dañar la lista.

La prioridad baja en urgente pone a prueba la lógica de la "Promesa", verificando si el sistema sabe rechazar algo que no cumple con el nivel de importancia requerido.

• Procedimiento de prueba paso a paso
Arrancar el programa y capturar la primera solicitud con ID 101.

Intentar registrar una segunda con el mismo ID y verificar que el sistema lance el mensaje de error.

Registrar una solicitud "Urgente" con prioridad baja y esperar 2 segundos para ver el rechazo asíncrono.

• Resultados esperados
Fallo: El programa debe decir: "El identificador ya existe" o "Fallo: Solicitud Urgente necesita prioridad alta".

Éxito: Debe mostrar: "La solicitud de [Nombre] fue procesada".