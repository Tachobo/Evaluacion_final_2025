1. Documentación Técnica

Datos de Entrada:

Tipo de Operación: Solo letras (ej: "Pago"). Riesgo: Si metes números, los reportes finales saldrán mal.

Valor: Dinero de la operación (máximo 10,000).

Captura: Se captura desde la terminal y se valida que los números sean positivos.

Descripción del Proceso:

Variables: aprobadas, rechazadas e invalidas son contadores que van sumando según el resultado.

Justificación: Usamos async/await porque el sistema debe "esperar" a que el servidor de fondos responda antes de pasar a la siguiente operación.

Operadores: Usamos || para que, si el servidor falla, el programa siempre tenga un mensaje de error que mostrar.

Manejo de Errores: Si el servidor rechaza un pago (como en los IDs impares), el programa captura ese fallo, lo marca como "Rechazada" y sigue con la siguiente sin cerrarse.