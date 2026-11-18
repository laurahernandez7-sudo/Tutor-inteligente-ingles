/* Tutor de inglés A1: modelo BKT por habilidad.
   Parámetros ilustrativos: NO estimados ni entrenados con estudiantes reales. */
const CONFIG = Object.freeze({inicio:0.30, aprender:0.10, descuido:0.10, azar:0.20, maxEjercicios:9});
const TEMAS = ['vocabulario','to_be','presente_simple'];
const ETIQUETAS = {vocabulario:'Vocabulario',to_be:'Verbo to be',presente_simple:'Presente simple'};
const NIVELES = {basico:'Básico',medio:'Intermedio',avanzado:'Avanzado'};
function actualizarBKT(anterior, acierto){
 const {aprender:T,descuido:S,azar:G}=CONFIG;
 const conocia=acierto?anterior*(1-S):anterior*S;
 const noConocia=acierto?(1-anterior)*G:(1-anterior)*(1-G);
 const posterior=conocia/(conocia+noConocia);
 return posterior+(1-posterior)*T;
}
function nivelPara(prob){return prob<0.45?'basico':prob<0.75?'medio':'avanzado';}
function temaPara(numero){return TEMAS[numero%TEMAS.length];}
function seleccionar(banco, usados, tema, prob){
 const disponibles=banco.filter(q=>q.tema===tema && !usados.includes(q.id));
 return disponibles.find(q=>q.nivel===nivelPara(prob)) || disponibles[0] || null;
}
const TutorCore={CONFIG,TEMAS,ETIQUETAS,NIVELES,actualizarBKT,nivelPara,temaPara,seleccionar};
if(typeof module!=='undefined')module.exports=TutorCore;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);
 let sesion=null,actual=null,pistaUsada=false,respondida=false;
 function promedio(){return TEMAS.reduce((s,t)=>s+sesion.dominio[t],0)/TEMAS.length;}
 function estado(){
  $('avance').textContent=`${sesion.historial.length} / ${CONFIG.maxEjercicios}`;
  $('aciertos').textContent=sesion.historial.filter(x=>x.acierto).length;
  TEMAS.forEach(t=>{
   $('p-'+t).textContent=Math.round(sesion.dominio[t]*100)+' %';
   $('b-'+t).style.width=Math.round(sesion.dominio[t]*100)+'%';
  });
 }
 function pregunta(){
  estado();
  if(sesion.historial.length>=CONFIG.maxEjercicios){finalizar();return;}
  const tema=temaPara(sesion.historial.length);
  actual=seleccionar(PREGUNTAS,sesion.historial.map(x=>x.id),tema,sesion.dominio[tema]);
  if(!actual){finalizar();return;}
  respondida=false;pistaUsada=false;
  $('numero').textContent=`Pregunta ${sesion.historial.length+1} de ${CONFIG.maxEjercicios}`;
  $('tema').textContent=ETIQUETAS[tema];
  $('nivel-pregunta').textContent=NIVELES[actual.nivel];
  $('pregunta').textContent=actual.pregunta;
  $('opciones').replaceChildren();
  actual.opciones.forEach((op,i)=>{let btn=document.createElement('button');btn.className='opcion';btn.textContent=String.fromCharCode(65+i)+'. '+op;btn.addEventListener('click',()=>responder(i));$('opciones').append(btn);});
  $('pista-texto').textContent='';$('retro').hidden=true;$('continuar').hidden=true;$('pista').hidden=false;
 }
 function responder(i){
  if(respondida)return;
  respondida=true;
  const acierto=i===actual.correcta,tema=actual.tema,antes=sesion.dominio[tema];
  sesion.dominio[tema]=actualizarBKT(antes,acierto);
  sesion.historial.push({orden:sesion.historial.length+1,tema,id:actual.id,nivel:actual.nivel,acierto,
    eleccion:actual.opciones[i],respuesta:actual.opciones[actual.correcta],pista:pistaUsada,antes,despues:sesion.dominio[tema]});
  [...$('opciones').children].forEach((b,j)=>{b.disabled=true;if(j===actual.correcta)b.classList.add('correcta');if(j===i&&!acierto)b.classList.add('incorrecta');});
  $('retro').hidden=false;$('resultado').textContent=acierto?'¡Muy bien! Correct answer.':'Vamos a revisarlo.';
  $('resultado').className=acierto?'bien':'mal';
  $('explicacion').textContent=actual.explicacion+' Respuesta correcta: '+actual.opciones[actual.correcta]+'.';
  $('pista').hidden=true;$('continuar').hidden=false;estado();
 }
 function empezar(){
  sesion={alias:$('alias').value.trim().slice(0,40)||'Estudiante',dominio:Object.fromEntries(TEMAS.map(t=>[t,CONFIG.inicio])),historial:[]};
  $('nombre-estudiante').textContent=sesion.alias;
  $('inicio').hidden=true;$('actividad').hidden=false;$('final').hidden=true;pregunta();
 }
 function finalizar(){
  $('actividad').hidden=true;$('final').hidden=false;
  $('total').textContent=sesion.historial.filter(x=>x.acierto).length+'/'+sesion.historial.length;
  $('promedio').textContent=Math.round(promedio()*100)+' %';
  const menor=TEMAS.reduce((m,t)=>sesion.dominio[t]<sesion.dominio[m]?t:m,TEMAS[0]);
  $('recomendacion').textContent='Te recomendamos repasar: '+ETIQUETAS[menor]+'. Este valor es una estimación del modelo, no una nota ni certificación de inglés.';
  $('historial').replaceChildren();
  sesion.historial.forEach(e=>{const tr=document.createElement('tr');[e.orden,ETIQUETAS[e.tema],NIVELES[e.nivel],e.acierto?'Correcta':'Incorrecta',Math.round(e.despues*100)+' %'].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td);});$('historial').append(tr);});
 }
 function csvSeguro(x){return '"'+String(x).replace(/"/g,'""')+'"';}
 function descargar(){
  const campos=['alias','orden','tema','id','nivel','acierto','eleccion','respuesta','pista','bkt_antes','bkt_despues'];
  const lineas=[campos.join(',')];
  sesion.historial.forEach(e=>lineas.push([sesion.alias,e.orden,e.tema,e.id,e.nivel,e.acierto,e.eleccion,e.respuesta,e.pista,e.antes.toFixed(4),e.despues.toFixed(4)].map(csvSeguro).join(',')));
  const blob=new Blob(['\ufeff'+lineas.join('\r\n')],{type:'text/csv;charset=utf-8'});
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='registro_tutor_ingles.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500);
 }
 $('comenzar').addEventListener('click',empezar);
 $('pista').addEventListener('click',()=>{if(!respondida){pistaUsada=true;$('pista-texto').textContent='Pista: '+actual.pista;}});
 $('continuar').addEventListener('click',pregunta);
 $('descargar').addEventListener('click',descargar);
 $('reiniciar').addEventListener('click',()=>{$('final').hidden=true;$('inicio').hidden=false;});
}
