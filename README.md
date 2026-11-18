# EnglishStep — tutor adaptativo de inglés básico A1

Proyecto académico de cuarto semestre, asignatura **Sistemas Inteligentes**, Universidad de Ibagué.

**Autoras:** Laura Sofía Hernández Martínez y María Fernanda Rodríguez.  
**Docente (última autora del informe):** Alexandra LaCruz.

## ¿Qué problema resuelve?

Un cuestionario común presenta siempre la misma dificultad. EnglishStep estima de forma sencilla el desempeño por tema para ajustar la dificultad de la siguiente pregunta y dar pistas y explicaciones.

## ¿Qué incluye?

- **18 preguntas originales**, sobre vocabulario, verbo *to be* y presente simple (6 por tema).
- **9 preguntas por práctica**, alternando los tres temas.
- **BKT (Bayesian Knowledge Tracing)** con parámetros didácticos para cada tema.
- Tres dificultades **dentro del material A1**: básico, intermedio y avanzado. No corresponden a A1/A2/B1.
- Retroalimentación inmediata, pistas, resumen y exportación CSV.
- **No utiliza IA generativa**, no está conectado a Moodle y no certifica inglés.

## ¿Cómo abrirlo?

1. Descarga todos los archivos y deja `index.html`, `estilos.css`, `preguntas.js` y `tutor.js` juntos.
2. Haz doble clic en `index.html` con Edge o Chrome.
3. Introduce un alias opcional y realiza una práctica de nueve preguntas.
4. Al terminar, descarga `registro_tutor_ingles.csv`.

No se instala nada ni se requiere Internet. También se incluye un archivo autónomo `ABRIR_ENGLISHSTEP.html` en la entrega completa.

## ¿Dónde está la inteligencia?

En `tutor.js` se encuentran las funciones:

- `actualizarBKT`: calcula la nueva estimación después de cada respuesta.
- `elegirNivel`: compara la estimación con los umbrales 45 % y 75 %.
- `elegirPregunta`: busca una pregunta sin repetir, de dificultad acorde con la estimación.

Parámetros ilustrativos: `P(L0)=0.30`, `P(T)=0.10`, `P(S)=0.10` y `P(G)=0.20`. **No fueron ajustados con estudiantes reales.**

## ¿Cómo verificar el código?

Con Node.js opcional, ejecutar desde la carpeta raíz:

```bash
node pruebas/validar.js
node pruebas/simular.js
```

`validar.js` comprueba diez comprobaciones de la implementación; `simular.js` genera tres perfiles simulados de nueve respuestas cada uno (27 interacciones). Las pruebas verifican comportamiento de software, **no mejoras del aprendizaje real**.

## Datos y enlaces

- Código: https://github.com/laurahernandez7-sudo/Tutor-inteligente-de-ingles
- Datos: https://drive.google.com/drive/folders/16ehLLxjAKKG1AFCxIvfNg58m9niRTtuj?usp=sharing
- Referencias y metodología: informe técnico incluido en el paquete de entrega.

## Límites

No diagnostica nivel CEFR real, no almacena progreso entre días, no corrige pronunciación ni texto libre, no conversa y no integra un LMS. Se trata de un prototipo pequeño y reproducible para demostrar adaptación por tema.
