/* Tres escenarios simulados, NO alumnos reales. Ejecutar: node pruebas/simular.js */
const { CONFIG, TEMAS, actualizarBKT, elegirTema, elegirPregunta } = require("../tutor.js");
const PREGUNTAS = require("../preguntas.js");
const fs = require("node:fs");
const path = require("node:path");

const perfiles = [
  { nombre: "Aciertos constantes", patron: [1,1,1,1,1,1,1,1,1] },
  { nombre: "Errores constantes",  patron: [0,0,0,0,0,0,0,0,0] },
  { nombre: "Respuestas variadas",  patron: [1,0,1,0,1,0,1,0,1] }
];
const registros = [];
const resumen = [];

for (const perfil of perfiles) {
  const dominio = Object.fromEntries(TEMAS.map(t => [t, CONFIG.inicial]));
  const usados = [];

  perfil.patron.forEach((respuesta, paso) => {
    const tema = elegirTema(paso);
    const pregunta = elegirPregunta(PREGUNTAS, usados, tema, dominio[tema]);
    usados.push(pregunta.id);
    const antes = dominio[tema];
    const despues = actualizarBKT(antes, Boolean(respuesta));
    dominio[tema] = despues;
    registros.push([perfil.nombre, paso + 1, tema, pregunta.id, pregunta.nivel,
      respuesta, antes.toFixed(4), despues.toFixed(4)]);
  });

  const totalAciertos = perfil.patron.reduce((a, b) => a + b, 0);
  const promedio = TEMAS.reduce((a, t) => a + dominio[t], 0) / TEMAS.length;
  resumen.push([perfil.nombre, totalAciertos, CONFIG.totalPreguntas,
    ...TEMAS.map(t => Number((dominio[t] * 100).toFixed(2)).toString()),
    Number((promedio * 100).toFixed(2)).toString()]);
}

function guardar(nombre, encabezados, filas) {
  const texto = [encabezados, ...filas].map(fila => fila.join(",")).join("\n") + "\n";
  fs.writeFileSync(path.join(__dirname, "..", "datos", nombre), texto, "utf8");
}
guardar("pruebas_simuladas.csv",
  ["perfil","paso","tema","pregunta_id","nivel","acierto_simulado","estimacion_antes","estimacion_despues"], registros);
guardar("resumen_pruebas.csv",
  ["perfil","aciertos","preguntas","vocabulario","to_be","presente_simple","promedio"], resumen);

console.log("Se generaron 27 interacciones ficticias (3 perfiles x 9 preguntas).");
console.table(resumen.map(r => ({ perfil: r[0], aciertos: r[1], promedioBKT: r[6] + "%" })));
