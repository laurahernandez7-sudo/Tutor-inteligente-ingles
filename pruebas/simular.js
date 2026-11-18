/* Genera los 27 registros sintéticos a partir del mismo código BKT de la aplicación.
   Ejecutar desde la raíz: node pruebas/simular.js
   NO son respuestas de alumnos reales. */
const fs=require('fs');
const path=require('path');
const core=require('../tutor.js');
const banco=require('../preguntas.js');
const output=path.join(__dirname,'..','datos');
const casos=[
 ['Aciertos constantes',Array(9).fill(true)],
 ['Errores constantes',Array(9).fill(false)],
 ['Respuestas variadas',[true,false,true,false,true,false,true,false,true]]
];
const filas=[];const resumen=[];
for(const [perfil,respuestas] of casos){
 const dominio=Object.fromEntries(core.TEMAS.map(t=>[t,core.CONFIG.inicio]));
 const usados=[];
 for(let i=0;i<respuestas.length;i++){
  const tema=core.temaPara(i),q=core.seleccionar(banco,usados,tema,dominio[tema]);
  if(!q) throw new Error('Banco insuficiente en '+tema);
  usados.push(q.id);const antes=dominio[tema],acierto=respuestas[i];
  dominio[tema]=core.actualizarBKT(antes,acierto);
  filas.push([perfil,i+1,tema,q.id,q.nivel,acierto?1:0,antes.toFixed(4),dominio[tema].toFixed(4)]);
 }
 const promedio=core.TEMAS.reduce((s,t)=>s+dominio[t]*100,0)/core.TEMAS.length;
 resumen.push({perfil,aciertos:respuestas.filter(Boolean).length,preguntas:9,
  vocabulario:Number((dominio.vocabulario*100).toFixed(2)),
  to_be:Number((dominio.to_be*100).toFixed(2)),
  presente_simple:Number((dominio.presente_simple*100).toFixed(2)),
  promedio:Number(promedio.toFixed(2))});
}
function celda(x){let y=String(x);return /[,"\n]/.test(y)?'"'+y.replace(/"/g,'""')+'"':y;}
const csv=(head,rows)=>[head,...rows].map(row=>row.map(celda).join(',')).join('\r\n')+'\r\n';
fs.writeFileSync(path.join(output,'pruebas_simuladas.csv'),csv(['perfil','paso','tema','pregunta_id','nivel','acierto_simulado','estimacion_antes','estimacion_despues'],filas),'utf8');
fs.writeFileSync(path.join(output,'resumen_pruebas.csv'),csv(['perfil','aciertos','preguntas','vocabulario','to_be','presente_simple','promedio'],resumen.map(r=>[r.perfil,r.aciertos,r.preguntas,r.vocabulario,r.to_be,r.presente_simple,r.promedio])),'utf8');
fs.writeFileSync(path.join(__dirname,'resumen_pruebas.json'),JSON.stringify(resumen,null,2)+'\n','utf8');
console.log('Listo: '+filas.length+' respuestas SIMULADAS; '+resumen.length+' perfiles.');
console.table(resumen);
