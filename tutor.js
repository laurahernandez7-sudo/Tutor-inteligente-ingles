/*
 * EnglishStep - Tutor adaptativo de inglés básico A1.
 *
 * Este archivo tiene dos partes:
 *   A. Funciones del algoritmo BKT (se pueden probar por separado).
 *   B. Funciones que muestran preguntas y resultados en la página.
 *
 * BKT no es una red neuronal ni un chatbot. Aquí se usan parámetros
 * didácticos; no se entrenó el sistema con estudiantes reales.
 */

// ========== A. ALGORITMO =========================================

const CONFIG = {
  inicial: 0.30,      // Estimación antes de responder preguntas.
  aprendizaje: 0.10, // Probabilidad de aprender entre oportunidades.
  descuido: 0.10,     // Fallar aunque se conozca el tema.
  azar: 0.20,        // Acertar sin conocer el tema.
  totalPreguntas: 9
};

const TEMAS = ["vocabulario", "to_be", "presente_simple"];
const NOMBRES_TEMAS = {
  vocabulario: "Vocabulario",
  to_be: "Verbo to be",
  presente_simple: "Presente simple"
};
const NOMBRES_NIVELES = {
  basico: "Básico",
  medio: "Intermedio",
  avanzado: "Avanzado"
};

// Actualiza el conocimiento estimado después de un acierto o error.
function actualizarBKT(conocimiento, acierto) {
  const p = conocimiento;
  const s = CONFIG.descuido;
  const g = CONFIG.azar;
  const t = CONFIG.aprendizaje;

  const conocia = acierto ? p * (1 - s) : p * s;
  const noConocia = acierto ? (1 - p) * g : (1 - p) * (1 - g);

  const posterior = conocia / (conocia + noConocia);
  return posterior + (1 - posterior) * t;
}

// Dos umbrales sencillos para escoger la dificultad siguiente.
function elegirNivel(conocimiento) {
  if (conocimiento < 0.45) return "basico";
  if (conocimiento < 0.75) return "medio";
  return "avanzado";
}

// Se alternan los temas para que cada uno aparezca tres veces.
function elegirTema(numeroPregunta) {
  return TEMAS[numeroPregunta % TEMAS.length];
}

// Elige una pregunta NO usada, del nivel recomendado si hay disponible.
// Si se agotan las de ese nivel, usa la más cercana (limitación del banco).
function elegirPregunta(banco, idsUsados, tema, conocimiento) {
  const disponibles = banco.filter(p =>
    p.tema === tema && !idsUsados.includes(p.id)
  );

  const niveles = ["basico", "medio", "avanzado"];
  const preferido = niveles.indexOf(elegirNivel(conocimiento));

  disponibles.sort((a, b) => {
    const distanciaA = Math.abs(niveles.indexOf(a.nivel) - preferido);
    const distanciaB = Math.abs(niveles.indexOf(b.nivel) - preferido);
    return distanciaA - distanciaB;
  });

  return disponibles[0] || null;
}

// Reutilizamos estas funciones en las pruebas automáticas con Node.js.
if (typeof module !== "undefined") {
  module.exports = { CONFIG, TEMAS, actualizarBKT, elegirNivel, elegirTema, elegirPregunta };
}

// ========== B. PÁGINA WEB =========================================

// Esta condición permite importar el algoritmo en Node.js sin abrir la web.
if (typeof document !== "undefined") {
  const porId = id => document.getElementById(id);

  let sesion = null;
  let preguntaActual = null;
  let yaRespondio = false;
  let solicitoPista = false;

  function mostrarProgreso() {
    const total = sesion.respuestas.length;
    porId("avance").textContent = `${total} / ${CONFIG.totalPreguntas}`;
    porId("aciertos").textContent = sesion.respuestas.filter(r => r.acierto).length;

    TEMAS.forEach(tema => {
      const porcentaje = Math.round(sesion.conocimiento[tema] * 100);
      porId("p-" + tema).textContent = porcentaje + " %";
      porId("b-" + tema).style.width = porcentaje + "%";
    });
  }

  function comenzar() {
    const alias = porId("alias").value.trim().slice(0, 40) || "Estudiante";
    sesion = {
      alias,
      conocimiento: Object.fromEntries(TEMAS.map(tema => [tema, CONFIG.inicial])),
      respuestas: []
    };

    porId("nombre-estudiante").textContent = alias;
    porId("inicio").hidden = true;
    porId("final").hidden = true;
    porId("actividad").hidden = false;
    mostrarPregunta();
  }

  function mostrarPregunta() {
    mostrarProgreso();
    const numero = sesion.respuestas.length;

    if (numero === CONFIG.totalPreguntas) {
      mostrarResumen();
      return;
    }

    const tema = elegirTema(numero);
    const usadas = sesion.respuestas.map(r => r.id);
    preguntaActual = elegirPregunta(PREGUNTAS, usadas, tema, sesion.conocimiento[tema]);

    yaRespondio = false;
    solicitoPista = false;
    porId("numero").textContent = `PREGUNTA ${numero + 1} DE ${CONFIG.totalPreguntas}`;
    porId("tema").textContent = NOMBRES_TEMAS[tema];
    porId("nivel-pregunta").textContent = NOMBRES_NIVELES[preguntaActual.nivel];
    porId("pregunta").textContent = preguntaActual.pregunta;
    porId("pista-texto").textContent = "Puedes solicitar una pista antes de responder.";
    porId("retro").hidden = true;
    porId("pista").hidden = false;
    porId("continuar").hidden = true;

    const contenedor = porId("opciones");
    contenedor.replaceChildren();
    preguntaActual.opciones.forEach((opcion, indice) => {
      const boton = document.createElement("button");
      boton.className = "opcion";
      boton.textContent = `${String.fromCharCode(65 + indice)}. ${opcion}`;
      boton.addEventListener("click", () => responder(indice));
      contenedor.appendChild(boton);
    });
  }

  function responder(indice) {
    if (yaRespondio) return;
    yaRespondio = true;

    const p = preguntaActual;
    const acierto = indice === p.correcta;
    const antes = sesion.conocimiento[p.tema];
    const despues = actualizarBKT(antes, acierto);
    sesion.conocimiento[p.tema] = despues;

    sesion.respuestas.push({
      numero: sesion.respuestas.length + 1,
      tema: p.tema,
      id: p.id,
      nivel: p.nivel,
      acierto,
      elegida: p.opciones[indice],
      correcta: p.opciones[p.correcta],
      pista: solicitoPista,
      antes,
      despues
    });

    [...porId("opciones").children].forEach((boton, i) => {
      boton.disabled = true;
      if (i === p.correcta) boton.classList.add("correcta");
      if (i === indice && !acierto) boton.classList.add("incorrecta");
    });

    porId("retro").hidden = false;
    porId("resultado").textContent = acierto ? "¡Correcto!" : "Todavía no. Revisemos.";
    porId("resultado").className = acierto ? "acierto" : "error";
    porId("explicacion").textContent = p.explicacion + " Respuesta correcta: " + p.opciones[p.correcta] + ".";
    porId("pista").hidden = true;
    porId("continuar").hidden = false;
    mostrarProgreso();
  }

  function mostrarResumen() {
    porId("actividad").hidden = true;
    porId("final").hidden = false;
    const correctas = sesion.respuestas.filter(r => r.acierto).length;
    porId("total").textContent = `${correctas} / ${CONFIG.totalPreguntas}`;
    const promedio = TEMAS.reduce((s, t) => s + sesion.conocimiento[t], 0) / TEMAS.length;
    porId("promedio").textContent = Math.round(promedio * 100) + " %";

    const masDificil = TEMAS.reduce((a, b) =>
      sesion.conocimiento[a] < sesion.conocimiento[b] ? a : b
    );
    porId("recomendacion").textContent =
      "Tema recomendado para repasar: " + NOMBRES_TEMAS[masDificil] +
      ". Este resultado es una estimación matemática, no una nota o nivel certificado.";

    const tabla = porId("historial");
    tabla.replaceChildren();
    sesion.respuestas.forEach(r => {
      const fila = document.createElement("tr");
      const columnas = [r.numero, NOMBRES_TEMAS[r.tema], NOMBRES_NIVELES[r.nivel],
        r.acierto ? "Correcta" : "Incorrecta", Math.round(r.despues * 100) + " %"];
      columnas.forEach(valor => {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
      });
      tabla.appendChild(fila);
    });
  }

  function descargarCSV() {
    const encabezados = ["alias", "numero", "tema", "pregunta_id", "nivel", "acierto",
      "respuesta_elegida", "respuesta_correcta", "pista", "bkt_antes", "bkt_despues"];

    // Entrecomillamos el contenido para abrirlo bien en Excel.
    const escapar = valor => '"' + String(valor).replace(/"/g, '""') + '"';
    const filas = sesion.respuestas.map(r => [sesion.alias, r.numero, r.tema, r.id,
      r.nivel, r.acierto, r.elegida, r.correcta, r.pista,
      r.antes.toFixed(4), r.despues.toFixed(4)].map(escapar).join(","));

    const contenido = "\ufeff" + [encabezados.join(","), ...filas].join("\r\n");
    const enlace = document.createElement("a");
    const url = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
    enlace.href = url;
    enlace.download = "registro_tutor_ingles.csv";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  porId("comenzar").addEventListener("click", comenzar);
  porId("pista").addEventListener("click", () => {
    if (!yaRespondio) {
      solicitoPista = true;
      porId("pista-texto").textContent = "Pista: " + preguntaActual.pista;
    }
  });
  porId("continuar").addEventListener("click", mostrarPregunta);
  porId("descargar").addEventListener("click", descargarCSV);
  porId("reiniciar").addEventListener("click", () => {
    porId("final").hidden = true;
    porId("inicio").hidden = false;
  });
}
