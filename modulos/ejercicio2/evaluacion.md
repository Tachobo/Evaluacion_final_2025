• Datos de prueba seleccionados
Valor excedido: Ingresar un valor de 15000 (el máximo es 10000).

ID Impar (Fallo de servidor): Usar ID 103 o 107.

Tipo con números: Escribir "Pago123" en el tipo de operación.

• Justificación técnica de los datos
El valor excedido prueba que los límites de dinero funcionen correctamente.

El ID impar es clave para ver si la "Promesa" del servidor funciona bien al rechazar la operación por falta de fondos.

El tipo con números verifica que el filtro de "solo letras" esté activo.

• Procedimiento de prueba paso a paso
Ingresar una operación con valor 15000 y confirmar que el try/catch capture el error de rango.

Ingresar una operación válida pero con ID impar (ej. 1).

Esperar 1.5 segundos y verificar que el sistema marque la operación como "RECHAZADA" por el servidor, pero que permita ver el Resumen Final al terminar.

• Resultados esperados
Fallo: Mensajes como: "Valor fuera de rango" o "Servidor: Fondos insuficientes".

Éxito: Ajuste automático del valor (tasa del 10%) y mensaje de "Operación Aprobada".