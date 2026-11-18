# EnglishStep — tutor inteligente adaptativo de inglés

Prototipo académico de cuarto semestre, creado con **HTML, CSS y JavaScript** para practicar tres contenidos de inglés básico: vocabulario, verbo *to be* y presente simple.

## Ejecutar

Abrir `index.html` con un navegador de escritorio. También está disponible el archivo autónomo `DEMO_ABRIR_EN_NAVEGADOR.html`.

## Qué hace el software

- Banco de **18 preguntas** originales: 3 temas × 3 dificultades × 2 preguntas.
- Una sesión de **9 preguntas**: 3 por tema.
- Tras cada respuesta, **Bayesian Knowledge Tracing (BKT)** actualiza una estimación de conocimiento por tema.
- Elige la dificultad mediante reglas: `p < 0.45` = básico, `0.45 <= p < 0.75` = intermedio, `p >= 0.75` = avanzado.
- Muestra pistas y explicaciones, registra las respuestas y ofrece exportar un CSV.

Parámetros didácticos: `P(L0)=0.30`, `P(T)=0.10`, `P(S)=0.10`, `P(G)=0.20`. No fueron entrenados ni calibrados con estudiantes reales.

## Archivos

- `index.html`: pantalla del tutor.
- `estilos.css`: diseño de la página.
- `preguntas.js`: banco de ejercicios.
- `tutor.js`: actualización BKT y reglas de selección; también controla la interfaz.
- `datos/`: CSV con preguntas y resultados sintéticos.
- `pruebas/`: pruebas automáticas y script que reproduce los escenarios simulados.
- `informe/`: documento técnico en Word y PDF.
- `presentacion/`: material de sustentación.

## Pruebas reproducibles

Teniendo Node.js, desde esta carpeta ejecutar:

```sh
node pruebas/validar.js
node pruebas/simular.js
```

`validar.js` comprueba nueve condiciones y `simular.js` reproduce tres perfiles ficticios (27 respuestas en total). **No son datos de estudiantes reales** ni demuestran aumento de aprendizaje.

## Límites

EnglishStep no certifica niveles MCER, no guarda progreso de un día a otro, no ofrece conversación libre ni análisis de pronunciación y no se conecta a Moodle o Canvas. Está diseñado como una demostración de adaptación de dificultad dentro de una sesión.

## Referencias

1. Corbett, A. T. y Anderson, J. R., *Knowledge tracing: Modeling the acquisition of procedural knowledge*, 1994. https://doi.org/10.1007/BF01099821
2. Piech, C. et al., *Deep Knowledge Tracing*, NeurIPS 2015. https://proceedings.neurips.cc/paper_files/paper/2015/hash/bac9162b47c56fc8a4d2a519803d51b3-Abstract.html
3. Council of Europe, *CEFR Descriptors*. https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors
