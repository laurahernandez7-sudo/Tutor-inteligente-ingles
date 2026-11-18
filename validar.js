/* Pruebas básicas sin librerías externas. Ejecutar: node pruebas/validar.js */
const assert = require("node:assert/strict");
const preguntas = require("../preguntas.js");
const { CONFIG, TEMAS, actualizarBKT, elegirNivel, elegirTema, elegirPregunta } = require("../tutor.js");
let pasaron = 0;
function prueba(nombre, ejecutar) {
  ejecutar();
  pasaron++;
  console.log("OK " + pasaron + ": " + nombre);
}

prueba("Hay 18 preguntas", () => assert.equal(preguntas.length, 18));
prueba("Cada pregunta tiene cuatro opciones", () => assert.ok(preguntas.every(p => p.opciones.length === 4)));
prueba("Las respuestas correctas tienen índice válido", () => assert.ok(preguntas.every(p => p.correcta >= 0 && p.correcta < 4)));
prueba("No hay identificadores repetidos", () => assert.equal(new Set(preguntas.map(p => p.id)).size, 18));
prueba("Hay seis preguntas por tema", () => TEMAS.forEach(t => assert.equal(preguntas.filter(p => p.tema === t).length, 6)));
prueba("Después de acertar la estimación sube", () => assert.ok(actualizarBKT(0.30, true) > 0.30));
prueba("Después de fallar la estimación baja", () => assert.ok(actualizarBKT(0.30, false) < 0.30));
prueba("La probabilidad permanece entre 0 y 1", () => {
  [0.01, 0.30, 0.95].forEach(p => [true, false].forEach(a => {
    const nueva = actualizarBKT(p, a);
    assert.ok(nueva >= 0 && nueva <= 1);
  }));
});
prueba("Se respetan los tres umbrales de dificultad", () => {
  assert.equal(elegirNivel(0.30), "basico");
  assert.equal(elegirNivel(0.60), "medio");
  assert.equal(elegirNivel(0.90), "avanzado");
});
prueba("Las preguntas no se repiten y se alternan temas", () => {
  const usados = [];
  for (let paso = 0; paso < CONFIG.totalPreguntas; paso++) {
    const tema = elegirTema(paso);
    const q = elegirPregunta(preguntas, usados, tema, 0.30);
    assert.equal(q.tema, tema);
    assert.ok(!usados.includes(q.id));
    usados.push(q.id);
  }
});
console.log(`\nRESULTADO: ${pasaron}/10 pruebas superadas.`);
