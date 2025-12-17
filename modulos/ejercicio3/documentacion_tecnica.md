1. Documentación Técnica
Datos de Entrada:

Rol: Admin, Editor o Visitante.

Permisos: Una lista de lo que el usuario quiere hacer.

Aceptación de condiciones: Un sí o no (booleano).

Riesgo: Si un "Visitante" pide permisos de "Admin", el sistema debe frenarlo por seguridad.

Descripción del Proceso:

Variables: REGLAS_ROL_PERMISOS es un objeto fijo (inmutable) que tiene la lista blanca de qué puede hacer cada quién.

Flujo Paso a Paso: 1. Recibimos los datos del usuario. 2. Un Callback revisa si aceptó los términos y si es mayor de edad. 3. El sistema compara su Rol con sus Permisos. 4. Una Promesa consulta antecedentes de seguridad fuera del sistema.

Manejo de Errores: Si alguien es menor de edad, el programa lanza un error personalizado: "Reglas básicas no cumplidas: Menor de edad". El sistema es "inmune" a bloqueos porque el catch maneja cualquier falla de red o de datos.