/* Banco de ejercicios de inglés básico A1.
   3 temas × 3 dificultades × 2 preguntas = 18 preguntas.
   Todas las preguntas se escribieron para este prototipo. */

const PREGUNTAS = [
  {
    "id": "V01",
    "tema": "vocabulario",
    "nivel": "basico",
    "pregunta": "What does 'apple' mean in Spanish?",
    "opciones": [
      "Manzana",
      "Naranja",
      "Libro",
      "Puerta"
    ],
    "correcta": 0,
    "pista": "Es una fruta roja o verde.",
    "explicacion": "'Apple' significa 'manzana'."
  },
  {
    "id": "V02",
    "tema": "vocabulario",
    "nivel": "basico",
    "pregunta": "Choose the English word for 'casa'.",
    "opciones": [
      "Chair",
      "House",
      "School",
      "Street"
    ],
    "correcta": 1,
    "pista": "Es el lugar donde vive una familia.",
    "explicacion": "'Casa' se dice 'house'."
  },
  {
    "id": "V03",
    "tema": "vocabulario",
    "nivel": "medio",
    "pregunta": "Complete: 'I drink ____ every morning.'",
    "opciones": [
      "window",
      "water",
      "teacher",
      "blue"
    ],
    "correcta": 1,
    "pista": "Busca una palabra que nombre una bebida.",
    "explicacion": "'Water' significa 'agua' y puede beberse."
  },
  {
    "id": "V04",
    "tema": "vocabulario",
    "nivel": "medio",
    "pregunta": "What is the opposite of 'big'?",
    "opciones": [
      "Long",
      "Small",
      "Happy",
      "Fast"
    ],
    "correcta": 1,
    "pista": "'Big' significa 'grande'.",
    "explicacion": "El antónimo de 'big' es 'small' (pequeño)."
  },
  {
    "id": "V05",
    "tema": "vocabulario",
    "nivel": "avanzado",
    "pregunta": "Complete: 'The bank is ____ the supermarket.'",
    "opciones": [
      "next to",
      "hungry",
      "yesterday",
      "reading"
    ],
    "correcta": 0,
    "pista": "Necesitas una expresión de ubicación.",
    "explicacion": "'Next to' indica que dos lugares están uno al lado del otro."
  },
  {
    "id": "V06",
    "tema": "vocabulario",
    "nivel": "avanzado",
    "pregunta": "Complete: 'I am hungry. I want something to ____.'",
    "opciones": [
      "eat",
      "sleep",
      "listen",
      "drive"
    ],
    "correcta": 0,
    "pista": "'Hungry' indica que una persona tiene hambre.",
    "explicacion": "La expresión 'something to eat' se usa para algo de comer."
  },
  {
    "id": "B01",
    "tema": "to_be",
    "nivel": "basico",
    "pregunta": "Complete: 'She ___ a student.'",
    "opciones": [
      "am",
      "are",
      "is",
      "be"
    ],
    "correcta": 2,
    "pista": "Con she se usa la tercera persona singular.",
    "explicacion": "Con 'she' corresponde 'is': She is a student."
  },
  {
    "id": "B02",
    "tema": "to_be",
    "nivel": "basico",
    "pregunta": "Complete: 'I ___ from Colombia.'",
    "opciones": [
      "is",
      "am",
      "are",
      "be"
    ],
    "correcta": 1,
    "pista": "'I' lleva una forma especial de 'to be'.",
    "explicacion": "Con 'I' se usa 'am': I am from Colombia."
  },
  {
    "id": "B03",
    "tema": "to_be",
    "nivel": "medio",
    "pregunta": "Complete: 'They ___ not at home.'",
    "opciones": [
      "is",
      "am",
      "are",
      "be"
    ],
    "correcta": 2,
    "pista": "'They' es plural.",
    "explicacion": "Con 'they' se usa 'are': They are not at home."
  },
  {
    "id": "B04",
    "tema": "to_be",
    "nivel": "medio",
    "pregunta": "Complete the question: '___ he your brother?'",
    "opciones": [
      "Are",
      "Am",
      "Is",
      "Do"
    ],
    "correcta": 2,
    "pista": "Las preguntas con to be invierten verbo y sujeto.",
    "explicacion": "La pregunta correcta es 'Is he your brother?'."
  },
  {
    "id": "B05",
    "tema": "to_be",
    "nivel": "avanzado",
    "pregunta": "Choose the correct negative sentence.",
    "opciones": [
      "We not are late.",
      "We are not late.",
      "We is not late.",
      "We do not are late."
    ],
    "correcta": 1,
    "pista": "La negación va después de 'are'.",
    "explicacion": "La oración correcta es 'We are not late'."
  },
  {
    "id": "B06",
    "tema": "to_be",
    "nivel": "avanzado",
    "pregunta": "Complete: 'My friends and I ___ ready for class.'",
    "opciones": [
      "is",
      "am",
      "are",
      "be"
    ],
    "correcta": 2,
    "pista": "El sujeto equivale a we.",
    "explicacion": "'My friends and I' es plural: are ready."
  },
  {
    "id": "P01",
    "tema": "presente_simple",
    "nivel": "basico",
    "pregunta": "Complete: 'I ___ English every day.'",
    "opciones": [
      "studies",
      "study",
      "studying",
      "studied"
    ],
    "correcta": 1,
    "pista": "Con I el verbo va en su forma base.",
    "explicacion": "En presente simple: 'I study English every day'."
  },
  {
    "id": "P02",
    "tema": "presente_simple",
    "nivel": "basico",
    "pregunta": "Complete: 'He ___ soccer on Sundays.'",
    "opciones": [
      "play",
      "playing",
      "plays",
      "played"
    ],
    "correcta": 2,
    "pista": "Con he, los verbos regulares llevan -s.",
    "explicacion": "'He plays soccer on Sundays' es correcto."
  },
  {
    "id": "P03",
    "tema": "presente_simple",
    "nivel": "medio",
    "pregunta": "Complete: 'She ___ coffee in the morning.'",
    "opciones": [
      "don't drink",
      "doesn't drink",
      "doesn't drinks",
      "not drink"
    ],
    "correcta": 1,
    "pista": "Con she se usa doesn't + verbo base.",
    "explicacion": "La negación correcta es 'She doesn't drink coffee'."
  },
  {
    "id": "P04",
    "tema": "presente_simple",
    "nivel": "medio",
    "pregunta": "Complete: '___ you like music?'",
    "opciones": [
      "Does",
      "Are",
      "Do",
      "Is"
    ],
    "correcta": 2,
    "pista": "Las preguntas en presente simple con you usan un auxiliar.",
    "explicacion": "'Do you like music?' es la forma correcta."
  },
  {
    "id": "P05",
    "tema": "presente_simple",
    "nivel": "avanzado",
    "pregunta": "Choose the correct sentence.",
    "opciones": [
      "My brother go to university every day.",
      "My brother goes to university every day.",
      "My brother going to university every day.",
      "My brother does goes to university every day."
    ],
    "correcta": 1,
    "pista": "En tercera persona singular, go cambia a goes.",
    "explicacion": "En tercera persona singular se dice 'goes'."
  },
  {
    "id": "P06",
    "tema": "presente_simple",
    "nivel": "avanzado",
    "pregunta": "Complete: 'The students ___ English on Mondays.'",
    "opciones": [
      "studies",
      "studying",
      "study",
      "does study"
    ],
    "correcta": 2,
    "pista": "'The students' es un sujeto plural.",
    "explicacion": "En presente simple con plural usamos 'study'."
  }
];

// Permite usar el mismo banco en las pruebas con Node.js.
if (typeof module !== "undefined") {
  module.exports = PREGUNTAS;
}
