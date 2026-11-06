// Teste de percurso e estados. Não requer servidor; não substitui revisão visual.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const nodes=new Map(),listeners={};
function el(id){if(!nodes.has(id))nodes.set(id,{hidden:true,textContent:'',innerHTML:'',className:'',style:{},open:false,focus(){},setAttribute(){},addEventListener(type,fn){listeners[id+':'+type]=fn},querySelector(s){return el(id+s)},showModal(){this.open=true},close(){this.open=false},getContext(){return new Proxy({},{get(t,k){return t[k]||(()=>{})},set(t,k,v){t[k]=v;return true}})}});return nodes.get(id)}
class Music{play(){return Promise.resolve()}pause(){}}
const sandbox={FrontierMusic:Music,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){},hidden:false},window:{addEventListener(){},matchMedia:()=>({matches:false})},requestAnimationFrame(){},setTimeout(){},setInterval(){},clearInterval(){},console};
let src=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8').replace(/\}\)\(\);\s*$/,`globalThis.test={start,update,draw,interact,advance,player,canMove,objective,nextScene,finishScene,continueTransition,togglePause,openBag,closeBag,showItem,keys,filmBlocking,get:()=>({stage,area,cinematic,transitioning,dialog,water,checked,hasDocs,returned,ended,flashback,dailyLife,paused,filmScene})};})();`);vm.runInNewContext(src,sandbox);const t=sandbox.test;
function scene(){let n=0,previous=-1;while(t.get().cinematic&&n++<4000){t.update(.04);const c=t.get().cinematic;if(c&&c.index!==previous){previous=c.index;t.draw();if(c.kind==='flashback'&&t.get().filmScene>=2){const blocking=t.filmBlocking();for(const army of blocking.army)for(const civilian of [...blocking.civilians,...blocking.family])assert(civilian.y-31>army.y+60,'Civis devem ficar separados da rua militar')}}}assert(n<4000,'Cena deve terminar sem pressionar E')}
function reach(target){const q=[[Math.round(t.player.x/4),Math.round(t.player.y/4)]],seen=new Set(q[0].join(','));let found;for(let i=0;i<q.length;i++){const[x,y]=q[i];if(Math.hypot(x*4-target.x,y*4-target.y)<18){found={x:x*4,y:y*4};break}for(const[dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){let nx=x+dx,ny=y+dy,k=nx+','+ny;if(!seen.has(k)&&t.canMove(nx*4,ny*4)){seen.add(k);q.push([nx,ny])}}}assert(found,'Objetivo inacessível '+target.id);Object.assign(t.player,found)}
function approach(){reach(t.objective());t.update(.04)}
t.draw();t.start();assert(t.get().cinematic);assert.equal(t.get().cinematic.steps.reduce((total,step)=>total+step.duration,0),86);assert(t.get().cinematic.steps.every(step=>step.duration>=10));t.togglePause();const frozen=t.get().cinematic.time;t.update(2);assert.equal(t.get().cinematic.time,frozen);t.togglePause();scene();assert(t.get().transitioning);assert(!t.get().dialog);assert(!t.get().cinematic);assert(el('dialogue').hidden);const pos=t.player.x;t.keys.add('d');t.update(2);assert.equal(t.player.x,pos);t.continueTransition();assert(!t.get().transitioning);assert(!t.get().dialog);
approach();assert(t.get().cinematic);scene();assert.equal(t.get().stage,1);
approach();t.interact();assert(t.get().hasDocs);scene();assert(!el('bagDialog').open,'Pasta detalhada deve ser opcional');t.openBag();for(const item of ['overview','documents','letter','photo'])t.showItem(item);t.closeBag();
approach();scene();assert.equal(t.get().stage,2);
approach();t.interact();scene();assert(t.get().water);
approach();assert(t.get().cinematic);scene();assert.equal(t.get().stage,3);
approach();t.interact();assert.equal(t.get().area,1);assert(!t.get().dialog);
approach();assert(t.get().cinematic);assert(!t.canMove(310,210));scene();assert(t.get().checked);assert(t.canMove(310,210));
approach();scene();assert(t.get().transitioning);assert(!t.get().ended);t.continueTransition();assert(t.get().dailyLife);scene();assert(t.get().ended);assert(!el('ending').hidden);
el('restart').onclick();assert(!t.get().ended);assert(!t.get().water);assert(!t.get().checked);assert(!t.get().dailyLife);t.finishScene();assert(t.get().transitioning);t.continueTransition();assert.equal(t.get().stage,0);
// Ivo não é necessário para avançar: as explicações ficam opcionais.
Object.assign(t.player,{x:229,y:288});t.interact();assert(t.get().dialog);while(t.get().dialog)t.advance();assert(!t.get().cinematic);
console.log('PASS: flashback de 86 segundos; contexto familiar; civis separados da rua militar; cenas automáticas; pausa; transição exclusiva e bloqueio de movimento; objetivos alcançáveis; pasta opcional; preparação sem conversa obrigatória com Ivo; fronteira automática; cotidiano e final; reinício e pulo.');
