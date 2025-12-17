Datos seleccionados: 1. ID repetido (para probar que el sistema no se confunde). 2. Monto de 15,000 (para probar que el límite de 10,000 funciona). 3. Visitante pidiendo borrar (para probar la seguridad de roles).

Justificación: Se eligen estos casos "límite" para demostrar que el código es robusto y no solo funciona cuando todo está bien, sino que sabe qué hacer cuando algo está mal.

Resultados: Se espera que en los errores el programa diga "RECHAZADA" con el motivo exacto y que al final el resumen de totales coincida con lo ingresado.