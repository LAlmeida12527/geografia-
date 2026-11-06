/* Fronteira da Esperança — Canvas 2D, sem bibliotecas ou dependências. */
(() => {
'use strict';
const $=id=>document.getElementById(id), canvas=$('game'),ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;
const W=640,H=384,keys=new Set();
let started=false,paused=false,ended=false,area=0,stage=0,hasDocs=false,returned=false,dialog=null,last=0,clock=0,sound=false,audio=null,musicTimer=null;
let flashback=false,filmScene=0,filmTime=0,checked=false,inspecting=false,inspectionDone=null,typing=0,visibleChars=0,activeFace='N',lastLetter=-1;
let cinematic=null,transitioning=false,transitionDone=null,dailyLife=false;let water=false,route=false,bagScene='memories',filmElapsed=0;let trail=[];const family=[{x:338,y:239},{x:350,y:250}];
const player={x:305,y:286,dir:0,walk:0};
const colors={ground:'#858567',road:'#b2a382',grass:'#717e55',dark:'#3e4c3d',cream:'#ded1a5'};
const npcs=[{id:'lia',name:'Lia · Moradora de Aurora',x:338,y:239,color:'#a86e57',hair:'#584337',initial:'L'},{id:'ivo',name:'Ivo · Professor da vila',x:229,y:288,color:'#7c8892',hair:'#c4c0a0',initial:'I'},{id:'tomas',name:'Tomás · Militar da passagem',x:504,y:130,color:'#667953',hair:'#474b3b',initial:'T'}];
const borderNPC={id:'sara',name:'Sara · Equipe de acolhimento',x:473,y:165,color:'#d6d3ba',hair:'#674735',initial:'S'};
const villageBlocks=[{x:66,y:65,w:131,h:99},{x:66,y:229,w:119,h:91},{x:390,y:243,w:139,h:99},{x:404,y:54,w:89,h:57},{x:274,y:51,w:63,h:55},{x:252,y:177,w:43,h:35},{x:562,y:30,w:57,h:324}];
const borderBlocks=[{x:370,y:57,w:163,h:83},{x:185,y:60,w:46,h:96},{x:183,y:245,w:47,h:94},{x:355,y:264,w:153,h:61}];
const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};
function line(x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function hash(x,y){let n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)}
function label(text,x,y,color='#e3d8af',size=7){ctx.fillStyle='#263729aa';ctx.fillRect(x-4,y-8,text.length*size*.6+8,size+6);ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.fillText(text,x,y)}
function ground(border=false){rect(0,0,W,H,colors.ground);for(let y=0;y<H;y+=8)for(let x=0;x<W;x+=8){let n=hash(x,y);rect(x,y,8,8,n>.7?'#89896a':n<.2?'#7e8361':'#858567');if(n>.65){rect(x+2,y+3,2,1,'#a29a77');rect(x+5,y+6,1,1,'#626f50')}}
if(!border){rect(202,0,39,384,'#b1a17e');rect(195,0,7,384,'#969171');rect(242,0,5,384,'#9a9371');rect(0,161,566,68,'#b4a17f');rect(0,166,640,53,colors.road);rect(310,205,48,179,colors.road);rect(489,100,65,83,colors.road);rect(312,263,98,25,colors.road);rect(290,139,25,48,colors.road);for(let y=168;y<218;y+=9)line(0,y,560,y,'#ab9d7c');}
else{rect(0,163,640,78,'#b6a784');rect(0,174,640,54,'#bcad8b');for(let x=0;x<640;x+=20){rect(x,165,10,2,'#c7b794');rect(x+6,234,12,2,'#a19375')}rect(232,154,45,99,'#aaa07e');}
for(let i=0;i<170;i++){let x=hash(i,2)*640,y=hash(i,3)*384;rect(x,y,hash(i,4)*3+1,1,'#6e765640')}
}
function windowArt(x,y,broken=false){rect(x-1,y-1,17,22,'#6f6950');rect(x,y,15,19,'#414e47');rect(x+2,y+2,5,7,'#85958a');rect(x+8,y+2,5,7,'#74887e');rect(x+7,y,1,19,'#b0a17c');rect(x,y+10,15,2,'#b0a17c');rect(x-2,y+19,19,3,'#b8a77f');if(broken){line(x,y+3,x+13,y+16,'#7e765c',3);line(x+2,y+14,x+13,y+4,'#928464',3)}}
function house(x,y,w,h,roof='#7b6553',ruined=false){rect(x+6,y+14,w+6,h+2,'#414d3d60');rect(x,y+25,w,h-25,'#b4a184');rect(x+3,y+29,w-6,h-32,'#c6b18d');rect(x+6,y+33,w-12,3,'#d2bf99');rect(x,y+h-8,w,8,'#8e8368');for(let j=0;j<4;j++){rect(x+8+j*27,y+h-19,11,2,'#b09b7e');rect(x+19+j*24,y+h-37,8,2,'#b29d7e')}
rect(x-4,y+7,w+8,34,'#4d4e3d');for(let j=0;j<8;j++){let inset=Math.abs(3-j)*2;rect(x-3+inset,y+3+j*4,w+6-inset*2,4,j%2?roof:'#89745a');for(let i=0;i<w;i+=13)rect(x+i+(j%2?6:0),y+4+j*4,1,3,'#615a47')}
rect(x+6,y-3,10,22,'#a18d70');rect(x+5,y-5,12,4,'#c1ac86');rect(x+w/2-8,y+h-29,17,29,'#514e3b');rect(x+w/2-6,y+h-27,12,27,'#6a6149');rect(x+w/2+4,y+h-15,2,2,'#d3bc83');rect(x+w/2-12,y+h,25,4,'#b4a681');windowArt(x+12,y+h-39,ruined);if(w>85)windowArt(x+w-30,y+h-39,ruined);
if(ruined){rect(x+w-31,y+9,23,14,'#424b3d');rect(x+w-21,y+22,22,9,'#434b3c');line(x+w-14,y+41,x+w-24,y+56,'#80735d');line(x+w-24,y+56,x+w-17,y+70,'#80735d');for(let i=0;i<9;i++)rect(x+w-24+hash(i,3)*45,y+h+hash(i,8)*14,6,3,i%2?'#9d9276':'#6e725b')}
}
function tree(x,y,dry=false){rect(x+4,y+4,18,5,'#39472f55');rect(x+6,y-19,4,26,'#625b40');rect(x+10,y-16,2,20,'#847451');if(dry){line(x+7,y-9,x-3,y-23,'#5b5a43',3);line(x+8,y-15,x+19,y-30,'#5b5a43',3);line(x+8,y-22,x+5,y-39,'#5b5a43',3);line(x-1,y-20,x-7,y-21,'#5b5a43',2);line(x+15,y-25,x+15,y-34,'#5b5a43',2)}else{rect(x-9,y-35,31,21,'#495f3f');rect(x-3,y-44,21,33,'#526b44');rect(x-12,y-30,37,12,'#566d46');rect(x-4,y-39,19,7,'#718053');rect(x-8,y-26,15,5,'#667e4e');rect(x+11,y-30,12,11,'#435f3d');rect(x-1,y-42,11,3,'#81905b')}}
function crate(x,y){rect(x+2,y+5,19,15,'#3d48384d');rect(x,y,18,17,'#6c6248');rect(x+2,y+2,14,13,'#a18a5e');rect(x+3,y+4,12,2,'#b6a273');rect(x+3,y+10,12,1,'#75664a');line(x+2,y+14,x+15,y+2,'#716347',2);rect(x,y,18,2,'#baa477')}
function fence(x,y,w){for(let i=0;i<w;i+=13){rect(x+i,y-8,3,20,'#62634a');rect(x+i+1,y-8,1,19,'#96906a')}rect(x,y-3,w,3,'#8a825f');rect(x,y+5,w,2,'#7d7657')}
function lamp(x,y){rect(x+2,y-39,3,45,'#4d5445');rect(x-4,y-44,16,3,'#454d40');rect(x-2,y-41,12,10,'#c3b582');rect(x-1,y-40,9,7,'#e0c88f');rect(x-4,y-31,16,3,'#5b5d45');rect(x-2,y+5,10,3,'#5b624a')}
function well(x,y){rect(x+2,y+10,39,12,'#444e3b66');rect(x,y,36,18,'#706d57');rect(x+2,y-3,32,17,'#b4ab87');rect(x+5,y,26,8,'#445c55');rect(x+6,y+8,26,4,'#999779');rect(x+3,y-23,3,26,'#6a6247');rect(x+30,y-23,3,26,'#6a6247');rect(x-2,y-25,40,5,'#7e6b4c');rect(x+1,y-29,34,4,'#a18a5c');line(x+17,y-21,x+17,y+4,'#c4b389')}
function sandbag(x,y,w){for(let j=0;j<2;j++)for(let i=0;i<w;i+=12){let off=j*4;rect(x+i+off,y+j*6,12,6,'#736f51');rect(x+i+off+1,y+j*6,10,4,'#aca17a');rect(x+i+off+2,y+j*6,8,1,'#bfb48b')}}
function bench(x,y){rect(x,y,30,5,'#8c7c58');rect(x,y-6,30,4,'#a18d63');rect(x+2,y-6,2,17,'#655f45');rect(x+26,y-6,2,17,'#655f45')}
function village(){ground();fence(47,52,143);fence(47,341,140);fence(365,359,175);fence(359,56,28);house(67,64,130,99,'#806953',true);house(65,228,120,91,'#8b7355');house(390,242,139,100,'#6b7460',true);house(405,53,87,58,'#707959');house(273,49,65,58,'#7d7158');well(255,188);bench(281,242);bench(357,207);crate(40,149);crate(25,157);crate(165,175);crate(426,137);crate(445,140);crate(373,309);crate(356,315);sandbag(405,112,68);sandbag(523,128,28);fence(559,28,13);for(let y=30;y<357;y+=16){rect(569,y,3,16,'#434d3e');line(571,y,623,y+12,'#56614a');line(571,y+12,623,y,'#56614a')}
for(let i=0;i<12;i++){tree(590+hash(i,6)*45,27+i*30,i%3===0)}
[[31,63],[38,260],[20,340],[253,355],[353,327],[365,86],[553,264],[551,365],[16,130],[254,54],[36,206],[550,77]].forEach(([x,y],i)=>tree(x,y,i%3!==0));lamp(191,214);lamp(375,221);lamp(486,181);lamp(240,130);sandbag(475,32,70);rect(489,34,61,4,'#5f6549');for(let x=490;x<550;x+=10)rect(x,34,6,4,'#d4b878');rect(552,4,4,49,'#535f45');label('FRONTEIRA ↑',480,64,'#e3d8af',7);label('AURORA',87,151,'#d9cc9e',6);
// Roupa no varal, flores resistentes e bagagem da família.
line(84,215,173,215,'#777758');rect(84,211,2,15,'#6e7150');rect(173,211,2,15,'#6e7150');rect(104,216,11,8,'#9c9b7d');rect(124,216,9,7,'#8c7761');rect(147,216,13,8,'#b8ae87');crate(354,250);rect(357,243,10,8,'#8d7150');rect(360,241,4,3,'#b19b6d');for(let i=0;i<8;i++){rect(43+i*3,295+hash(i,9)*20,1,5,'#596f46');rect(43+i*3,294+hash(i,9)*20,2,2,'#c4b575')}
if(stage===1&&!hasDocs){rect(122,326,13,9,'#e0d3ac');rect(125,324,11,8,'#f1e4bc');rect(127,327,7,1,'#a99a72');rect(127,329,5,1,'#a99a72')}
}
function borderMap(){ground(true);rect(0,0,185,149,'#6e7d59');rect(0,255,180,129,'#6e7d59');for(let i=0;i<23;i++){tree(15+hash(i,7)*154,40+hash(i,8)*100,i%4===0);tree(15+hash(i,12)*150,290+hash(i,11)*94,i%5===0)}
// Leito do rio e ponte de pedra.
rect(190,0,37,162,'#586f68');rect(190,243,37,141,'#586f68');for(let y=0;y<384;y+=13){rect(195,y,17,2,'#78928a');rect(213,y+6,10,1,'#859b8b')}for(let y=0;y<150;y+=18){rect(184,y,8,15,'#8e9275');rect(226,y,7,15,'#899071')}rect(182,155,54,9,'#74775f');rect(182,240,54,9,'#74775f');rect(184,154,50,4,'#bbb494');rect(184,239,50,4,'#bbb494');for(let x=185;x<237;x+=15){rect(x,148,5,15,'#c5b996');rect(x,234,5,15,'#c5b996')}
house(371,56,162,85,'#7d8b6b');rect(431,102,28,17,'#ede6c6');rect(442,103,6,14,'#a36e57');rect(438,107,14,5,'#a36e57');label('ACOLHIMENTO',410,92,'#e9e3c4',7);sandbag(284,137,50);sandbag(285,251,50);fence(280,26,3);for(let y=27;y<135;y+=14){rect(281,y,2,11,'#606f51');line(281,y,350,y+10,'#68795b')}
rect(351,273,160,51,'#d1c7a0');for(let i=0;i<8;i++){rect(351+i*20,273,10,50,i%2?'#bbb894':'#cecca8')}rect(349,268,164,5,'#8d9271');rect(349,319,164,5,'#727d60');rect(349,268,3,59,'#697659');rect(510,268,3,59,'#697659');rect(417,283,26,40,'#747e62');bench(392,239);crate(540,130);crate(548,148);crate(333,294);tree(590,90);tree(567,299);tree(528,355);lamp(355,180);lamp(546,240);rect(294,163,4,52,'#5b674e');rect(294,162,62,6,'#d1bf8c');for(let x=298;x<356;x+=13)rect(x,163,6,5,'#8d7252');label('POSTO DO VALE',390,44,'#e8dcaf',8);label('← AURORA',38,251,'#dfd3a9',7);
// Pessoas esperando atendimento.
sprite(443,226,'#a28259','#554839',0,0);sprite(460,233,'#8f6d5c','#514536',0,0,true);sprite(510,204,'#7a8b7b','#b9ac8c',0,0);
}
function sprite(x,y,coat,hair,dir=0,walk=0,child=false){x=Math.round(x);y=Math.round(y);let step=walk?Math.sin(walk*11)*2:0, bob=walk?Math.abs(Math.sin(walk*11)):0;ctx.globalAlpha=.25;rect(x-7,y-2,16,5,'#25382c');ctx.globalAlpha=1;if(child){ctx.save();ctx.translate(x,y);ctx.scale(.75,.75);x=0;y=0}
rect(x-4,y-9,4,8+step,'#3d4540');rect(x+2,y-9,4,8-step,'#3d4540');rect(x-5,y-2+step,5,3,'#4b4436');rect(x+2,y-2-step,5,3,'#4b4436');rect(x-6,y-21-bob,13,14,coat);rect(x-8,y-18-bob+step,3,10,'#bda17b');rect(x+7,y-18-bob-step,3,10,'#bda17b');rect(x-5,y-29-bob,11,11,'#d4b28b');rect(x-6,y-29-bob,13,5,hair);rect(x-5,y-31-bob,10,3,hair);rect(x-6,y-25-bob,3,5,hair);if(dir===1)rect(x-5,y-24-bob,2,2,'#414b3a');else if(dir===2)rect(x+4,y-24-bob,2,2,'#414b3a');else if(dir===3)rect(x-5,y-26-bob,11,6,hair);else{rect(x-2,y-24-bob,1,2,'#414b3a');rect(x+3,y-24-bob,1,2,'#414b3a');rect(x,y-20-bob,3,1,'#b28a65')}
// Sacoche et foulard: silhouette reconnaissable du protagoniste.
if(coat==='#bb9e63'){rect(x-6,y-18-bob,12,3,'#b87754');line(x+5,y-17-bob,x-3,y-7-bob,'#6a6247',2);rect(x-7,y-11-bob,6,7,'#796b49');rect(x-7,y-11-bob,6,2,'#9e8a5a')}
if(child)ctx.restore();}
function marker(x,y){let b=Math.sin(clock*3)*2;rect(x-5,y-49+b,10,12,'#293b2a');rect(x-4,y-50+b,8,11,'#e0c481');rect(x-1,y-48+b,2,5,'#6c6445');rect(x-1,y-42+b,2,2,'#6c6445');rect(x-2,y-38+b,4,2,'#e0c481')}
function objective(){if(area&&!checked)return {x:274,y:207,id:'military'};if(area)return {x:473,y:165,id:'sara'};if(stage===0)return npcs[0];if(stage===1)return hasDocs?npcs[0]:{x:130,y:336,id:'docs'};if(stage===2){if(!water)return{x:278,y:232,id:'water'};if(!route)return npcs[1];return npcs[2]}return{x:520,y:18,id:'exit'}}
function nearest(){const entities=area?[borderNPC,{id:'military',name:'Sargento Duarte · Controle de fronteira',x:274,y:207}]:[...npcs,...(stage===2&&!water?[{id:'water',x:278,y:232}]:[]),...(stage===1&&!hasDocs?[{id:'docs',x:130,y:336}]:[]),{id:'exit',x:520,y:18}];let best=null,dist=40;for(const n of entities){const d=Math.hypot(n.x-player.x,n.y-player.y);if(d<dist){dist=d;best=n}}return best}
function updateJournal(){ $('preparation').textContent='PREPARAÇÃO · '+(water?'✓ Água':'○ Água')+' / '+(route?'✓ Rota':'↑ Rota do vale');let current=Math.min(stage,3);for(let i=0;i<4;i++){$('q'+i).className=ended||i<current?'done':i===current?'active':'';if(ended||i<current)$('q'+i).querySelector('.step').textContent='✓'}$('progressCount').textContent=ended?'04 / 04':String(current+1).padStart(2,'0')+' / 04';$('inspectBag').disabled=!!cinematic||transitioning||!(hasDocs||returned);$('inventoryText').innerHTML=hasDocs?'Documentos da família<small>Memórias de uma vida em Aurora.</small>':returned?'Documentos entregues<small>A família está pronta para partir.</small>':'Um pouco de coragem.<small>E espaço para o essencial.</small>';const goals=['Encontre sua mãe na praça, perto da mala.','Busque os documentos na entrada da casa a sudoeste.',!water?'Encha a cantil no poço para a caminhada.':'Siga a placa ao norte e encontre Tomás no portão.',area&&!checked?'Apresente a pasta ao militar, antes da barreira.':area?'Procure Sara na entrada do posto de acolhimento.':'Siga ao norte pelo portão, rumo à fronteira.'];$('gameStatus').textContent=ended?'Jornada concluída · Um novo começo':goals[current];if(stage===1&&hasDocs)$('gameStatus').textContent='Leve os documentos de volta para Lia.';if(dailyLife&&!ended)$('gameStatus').textContent='Cenas do cotidiano · Recomeçar leva tempo.';}
function talk(name,lines,complete,initial){if(cinematic||transitioning)return;$('dockIdle').hidden=true;keys.clear();dialog={name,lines,index:0,complete};activeFace=initial||name[0];$('dialogue').hidden=false;$('interaction').hidden=true;showLine()}
function showLine(){const entry=dialog.lines[dialog.index];const text=typeof entry==='string'?entry:entry.text;activeFace=typeof entry==='string'?activeFace:(entry.face||activeFace);$('speaker').textContent=typeof entry==='string'?dialog.name:(entry.name||dialog.name);dialog.text=text;typing=0;visibleChars=0;$('dialogueText').textContent='';$('nextDialogue').innerHTML=(dialog.index===dialog.lines.length-1?'Concluir':'Continuar')+' <kbd>E ↵</kbd>';if(flashback){filmScene=dialog.index;filmTime=0;if(filmScene===2||filmScene===3)impact()}drawFace(activeFace,0)}
function advance(){if(paused)return;if(cinematic){nextScene();return}if(transitioning){continueTransition();return}if(!dialog||inspecting||$('infoModal').open)return;if(visibleChars<dialog.text.length){typing=dialog.text.length/34;visibleChars=dialog.text.length;$('dialogueText').textContent=dialog.text;drawFace(activeFace,0);return}dialog.index++;if(dialog.index<dialog.lines.length)showLine();else{const cb=dialog.complete;dialog=null;$('dialogue').hidden=true;$('dockIdle').hidden=false;cb?.();updateJournal();canvas.focus()}}
const speech=(face,name,text)=>({face,name,text});
function playScene(kind,steps,complete){
 keys.clear();player.walk=0;dialog=null;$('dialogue').hidden=false;$('interaction').hidden=true;$('dockIdle').hidden=true;$('nextDialogue').textContent='Próxima cena →';
 cinematic={kind,steps,index:0,time:0,elapsed:0,complete};$('skipScene').hidden=false;$('scenePace').hidden=false;showSceneStep();updateJournal();
}
function showSceneStep(){const step=cinematic.steps[cinematic.index];activeFace=step.face||'N';$('speaker').textContent=step.name||'';$('dialogueText').textContent=step.text||'';drawFace(activeFace,0);$('scenePace').textContent='CENA AUTOMÁTICA · '+(cinematic.index+1)+' / '+cinematic.steps.length+' · Esc pausa';if(cinematic.kind==='flashback'){filmScene=cinematic.index;filmTime=0;if(filmScene===2)impact()}}
function nextScene(){if(!cinematic||paused)return;const current=cinematic;current.index++;current.time=0;if(current.index<current.steps.length)showSceneStep();else finishScene()}
function finishScene(){if(!cinematic)return;const done=cinematic.complete;cinematic=null;keys.clear();$('dialogue').hidden=true;$('dockIdle').hidden=false;$('skipScene').hidden=true;$('scenePace').hidden=true;done?.();updateJournal();canvas.focus()}
function updateScene(dt){const c=cinematic;c.time+=dt;c.elapsed+=dt;const step=c.steps[c.index],p=Math.min(1,c.time/(step.duration||4));if(c.kind==='flashback'){filmTime=c.time;filmElapsed=c.elapsed;$('filmHeading').textContent='FLASHBACK · AURORA · '+(c.index<2?'NA VÉSPERA':'MADRUGADA DA INVASÃO')}
if(c.kind==='checkpoint'){player.x=254;player.y=220;family[0]={x:245,y:202};family[1]={x:231,y:218};}
if(c.kind==='welcome'){player.x=466;player.y=196;family[0]={x:443,y:191};family[1]={x:426,y:204};}
if(c.kind==='daily'){if(c.index===4){player.x=443;player.y=240;family[0]={x:408,y:240};family[1]={x:425,y:239}}if(c.index===0){family[0]={x:440,y:220};family[1]={x:425+22*p,y:235}}if(c.index===1){player.x=426;player.y=238;family[0]={x:408,y:240};family[1]={x:425,y:239}}if(c.index===2){family[1]={x:450+58*p,y:245};}if(c.index===3){player.x=530;player.y=220;}}
const speaking=step.text&&c.time<Math.min(2.5,(step.text.length/32));drawFace(activeFace,speaking?1+Math.floor(clock*10)%2:0);
if(c.kind==='daily')family[1].walk=(c.index===0||c.index===2)?c.time:0;if(c.time>=(step.duration||4))nextScene();}
function interact(){if(!started||paused||ended||inspecting||transitioning||$('infoModal').open)return;if(cinematic){nextScene();return}if(dialog){advance();return}const n=nearest();if(!n)return;
switch(n.id){
case 'lia':if(stage===0)meetFamily();else if(stage===1&&hasDocs)returnFamily();else talk('Lia · Sua mãe',[stage===1?'A pasta ficou na entrada da nossa casa, perto do varal.':'Estou pronta. Vamos levar água e seguir pelo vale.'],null,'L');break;
case 'docs':collectFolder();break;
case 'water':if(!water)playScene('water',[{face:'N',name:'Preparar a caminhada',text:'Água para o caminho.',duration:4}],()=>{water=true;route=true;updateJournal()});break;
case 'ivo':talk('Ivo · Conversa opcional',[
'Quem precisa sair de casa mas continua no próprio país está em deslocamento interno. Ao atravessar uma fronteira, vocês podem buscar proteção em outro país.',
'A escola virou abrigo. A guerra também muda a função dos lugares: onde havia aulas, agora famílias procuram um teto.'
],null,'I');break;
case 'tomas':if(stage<2||!water){talk('Tomás · Militar',['Reúna sua família e leve água. A estrada da escola está interditada; a passagem é pelo vale.'],null,'T');break}confirmRoute();break;
case 'exit':if(stage>=3)changeArea(1);break;
case 'military':if(!checked)checkpointScene();else talk('Duarte · Militar',['Passagem aberta. A equipe de acolhimento está à frente.'],null,'D');break;
case 'sara':if(checked)welcomeScene();break;
}}
function meetFamily(){playScene('reunion',[
{face:'L',name:'Lia · Sua mãe',text:'A pasta ficou em casa. Está na entrada, junto ao varal.',duration:4},
{face:'N',name:'Noa',text:'Vou buscar. Fiquem juntos aqui.',duration:3}
],()=>{stage=1})}
function collectFolder(){hasDocs=true;drawPhoto('photoThumb');playScene('photo',[
{face:'N',name:'O que levamos conosco',text:'Documentos, uma carta… e o aniversário de Davi.',duration:5},
{face:'N',name:'Noa',text:'Ainda temos essa lembrança.',duration:3}
],()=>{updateJournal();$('inspectBag').disabled=false})}
function returnFamily(){playScene('return',[
{face:'L',name:'Lia',text:'Você trouxe a fotografia… Obrigada, filho.',duration:4},
{face:'N',name:'Preparar a partida',text:'Agora, água e uma rota segura.',duration:3}
],()=>{hasDocs=false;returned=true;stage=2;family[0]={x:338,y:239};family[1]={x:353,y:252}})}
function confirmRoute(){if(stage>=3)return;playScene('route',[
{face:'T',name:'Tomás · Militar',text:'A estrada principal está fechada. Sigam ao norte, pela ponte do vale.',duration:5}
],()=>{stage=3;route=true})}
function changeArea(next){area=next;checked=false;player.x=55;player.y=206;family[0]={x:35,y:206};family[1]={x:18,y:206};trail=[];keys.clear();$('location').textContent='Fronteira · Posto do Vale';$('areaTag').innerHTML='A TRAVESSIA DO VALE<span>Uma passagem. Muitas incertezas.</span>';$('areaTag').hidden=false;updateJournal()}
function checkpointScene(){playScene('checkpoint',[
{face:'D',name:'Duarte · Controle de fronteira',text:'Parem. De onde vêm? Documentos, por favor.',duration:4},
{face:'L',name:'Lia',text:'De Aurora. Somos três. Estamos fugindo dos combates.',duration:4},
{face:'D',name:'Conferência dos documentos',text:'Lia, Noa e Davi. A família aguarda enquanto o militar confere a pasta.',duration:5},
{face:'D',name:'Duarte',text:'Podem passar. Procurem a equipe de acolhimento.',duration:4}
],()=>{checked=true;updateJournal()})}
function welcomeScene(){playScene('welcome',[
{face:'S',name:'Sara · Acolhimento',text:'Há água e um lugar para descansar. Vamos orientar o pedido de proteção.',duration:5},
{face:'L',name:'Lia',text:'Também precisamos encontrar minha irmã, Mara.',duration:4}
],()=>{setMusic('hope');showTransition('ALGUNS DIAS DEPOIS','Abrigo temporário do Vale',beginDaily)})}
function beginDaily(){dailyLife=true;$('areaTag').innerHTML='ABRIGO TEMPORÁRIO DO VALE<span>A vida precisa continuar.</span>';playScene('daily',[
{face:'S',name:'Água e atendimento',text:'Primeiro, as necessidades de hoje.',duration:6},
{face:'L',name:'Um lugar temporário',text:'A família organiza o pouco que conseguiu trazer.',duration:6},
{face:'N',name:'Voltar a aprender',text:'Davi encontra outras crianças em uma atividade de acolhimento.',duration:7},
{face:'N',name:'Reencontrar quem ficou longe',text:'No ponto de comunicação, Noa deixa uma mensagem para Mara.',duration:6},
{face:'N',name:'Um primeiro passo',text:'A fotografia encontra um novo lugar junto da família.',duration:5}
],completeJourney)}
function completeJourney(){dailyLife=true;ended=true;family[0]={x:408,y:240};family[1]={x:425,y:239};player.x=443;player.y=240;$('ending').hidden=false;$('interaction').hidden=true;updateJournal()}
function showTransition(title,subtitle,done){cinematic=null;dialog=null;transitioning=true;transitionDone=done;keys.clear();$('dialogue').hidden=true;$('dockIdle').hidden=false;$('skipScene').hidden=true;$('scenePace').hidden=true;$('transitionTitle').textContent=title;$('transitionSubtitle').textContent=subtitle;$('presentCard').hidden=false;}
function continueTransition(){if(!transitioning)return;const done=transitionDone;transitioning=false;transitionDone=null;$('presentCard').hidden=true;keys.clear();done?.();updateJournal();canvas.focus()}

// Retratos originais em pixel art: boca acompanha somente o texto que está sendo revelado.
const faces={N:['#4a4236','#bb9e63','#d4b28b'],L:['#584337','#a86e57','#d4ae88'],I:['#c4c0a0','#7c8892','#c2a184'],T:['#474b3b','#667953','#c4a37d'],D:['#343d32','#576b50','#ab8466'],S:['#674735','#d6d3ba','#c29372'],V:['#4b493e','#66714b','#c0a17a']};
function drawFace(id,mouth=0){const c=$('portraitCanvas'),p=c.getContext('2d');p.imageSmoothingEnabled=false;const [hair,coat,skin]=faces[id]||faces.N;const r=(x,y,w,h,col)=>{p.fillStyle=col;p.fillRect(x,y,w,h)};r(0,0,64,64,'#8a9772');r(3,3,58,58,'#c2c8a3');r(8,50,48,14,coat);r(17,44,30,17,coat);r(26,37,13,14,skin);r(18,13,29,29,'#574b38');r(20,13,25,29,skin);r(17,9,31,12,hair);r(15,16,8,id==='L'||id==='S'?31:15,hair);r(43,15,6,id==='L'||id==='S'?32:15,hair);r(22,20,18,3,'#e3bb90');r(19,28,3,7,skin);r(45,28,3,7,skin);const blink=Math.sin(clock*1.3)>.996;r(24,27,5,blink?1:4,'#e4dcc3');r(36,27,5,blink?1:4,'#e4dcc3');r(26,27,2,blink?1:4,'#3b493a');r(36,27,2,blink?1:4,'#3b493a');r(23,24,7,1,hair);r(35,24,7,1,hair);r(31,30,3,5,'#b58b69');r(29,38,9,mouth===2?4:mouth===1?2:1,'#6e4439');if(mouth===2)r(31,38,5,1,'#e2c8a5');if(id==='I'){r(22,26,9,1,'#514e45');r(34,26,9,1,'#514e45');r(30,28,5,1,'#514e45');r(28,36,11,2,hair)}if(id==='T'||id==='D'||id==='V'){r(15,9,35,9,coat);r(14,16,37,3,'#3e4b39');r(30,11,5,4,'#c3b681')}if(id==='N'){r(17,48,30,5,'#b87754');r(36,51,6,13,'#a2694b')}if(id==='S'){r(40,53,3,9,'#9f5e4b');r(37,56,9,3,'#9f5e4b')}}
function soldier(x,y){sprite(x,y,'#667953','#474b3b');rect(x-8,y-30,17,6,'#55684d');rect(x-9,y-25,19,2,'#384d3a');rect(x-5,y-18,11,2,'#3d5140');line(x-8,y-14,x+7,y-6,'#343d33',3);rect(x+5,y-10,3,9,'#343d33')}
function beginFilm(){filmElapsed=0;flashback=true;filmScene=0;filmTime=0;setMusic('aurora');$('filmHeading').hidden=false;playScene('flashback',[
{face:'N',name:'Aurora · Na véspera',text:'Um dia comum, antes da guerra.',duration:4},
{face:'L',name:'Lia',text:'Noa, traga seu irmão para dentro.',duration:4},
{face:'N',name:'A invasão',text:'Motores. Depois, a primeira explosão.',duration:5},
{face:'V',name:'Militar · Na rua',text:'Área interditada! Procurem abrigo!',duration:5},
{face:'L',name:'Lia',text:'Longe da janela. Fiquem juntos!',duration:4},
{face:'N',name:'A casa deixa de ser segura',text:'Os combates chegaram à nossa rua.',duration:4},
{face:'L',name:'Lia',text:'Pela praça. Só o que conseguirmos carregar.',duration:5},
{face:'N',name:'A partida',text:'Não era uma viagem. Era uma fuga.',duration:4}
],endFilm)}
function endFilm(){flashback=false;filmTime=0;$('filmHeading').hidden=true;$('areaTag').hidden=false;showTransition('DE VOLTA AO PRESENTE','Aurora · Na manhã seguinte',()=>updateJournal())}
function impact(){if(!sound||!audio)return;const count=audio.sampleRate*.7,buffer=audio.createBuffer(1,count,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<count;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(audio.sampleRate*.12))*.16;const src=audio.createBufferSource(),f=audio.createBiquadFilter();src.buffer=buffer;f.type='lowpass';f.frequency.value=220;src.connect(f);f.connect(audio.destination);src.start()}
function drawFilm(){
ctx.save();const intense=filmScene>=2,shake=intense&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?Math.sin(filmElapsed*22)*1.2:0;ctx.translate(shake,0);ground();
house(67,64,130,99,'#806953',filmScene>=3);house(65,228,120,91,'#8b7355');house(390,242,139,100,'#6b7460',filmScene>=4);house(405,53,87,58,'#707959');well(255,188);tree(40,145);tree(362,84);lamp(375,221);fence(47,341,140);
if(!intense){sprite(305,211,'#bb9e63','#4a4236');sprite(134,222,'#a86e57','#584337');sprite(326+Math.sin(filmTime)*8,206,'#8f6d5c','#514536',0,filmTime,true);sprite(227,178,'#7c8892','#c4c0a0');line(84,215,173,215,'#777758');rect(104,216,11,8,'#9c9b7d');label('UM DIA COMUM, ANTES DA GUERRA',193,67,'#e5dbb3',9)}else{
rect(0,0,W,H,'#22364788');
// Coluna militar atravessa a rua; silhuetas distintas, rodas e esteiras.
for(let v=0;v<2;v++){const x=510-((filmElapsed*15+v*138)%550),y=173+v*30;rect(x,y,69,24,'#354236');rect(x+9,y-9,42,15,'#53634b');rect(x+37,y-15,21,7,'#69775b');rect(x+48,y-13,30,3,'#404c3c');rect(x+2,y+20,65,9,'#252f28');for(let w=0;w<5;w++)rect(x+7+w*12,y+22,7,6,'#58604b');rect(x+13,y-5,10,6,'#8e9c82')}
for(let i=0;i<7;i++){const x=520-((filmElapsed*18+i*44)%500),y=155+(i%3)*26;soldier(x,y);if(Math.sin(filmElapsed*5+i)>.85){rect(x-19,y-12,9,2,'#dcba77');rect(x-23,y-14,4,5,'#f0d79a')}}
// Civis correm para uma passagem, sem corpos ou violência gráfica.
for(let i=0;i<4;i++){const x=60+((filmElapsed*28+i*49)%175);sprite(x,216+i*5,['#8e7965','#7c8892','#a58a63','#8c6f63'][i],'#554839',2,filmElapsed)}
for(const [x,y]of [[165,91],[433,270]]){for(let i=0;i<9;i++){const rise=(filmElapsed*16+i*11)%80;rect(x+i%3*8-rise*.15,y-rise,17+rise*.2,12,'#6b695b99')}for(let i=0;i<6;i++){const z=Math.sin(filmElapsed*7+i)*3;rect(x+i*4,y-9-z,5,14+z,i%2?'#c99150':'#9f6541')}}
// Impactos, poeira e marcas no chão: a vila se transforma durante a invasão.
for(let i=0;i<3;i++){const x=[187,371,77][i],y=[160,224,190][i],phase=(filmElapsed*.45+i*.3)%1;rect(x-9,y,26,6,'#565a48');for(let j=0;j<9;j++){const d=phase*23;rect(x+Math.cos(j)*d,y+Math.sin(j)*d/2,4,3,phase<.2?'#cdb28b':'#a3917566')}}
for(let i=0;i<8;i++)rect(165+i*7,161+(i%3)*3,6,4,'#887a60');
const fx=filmScene>=6?130+Math.min(120,filmTime*14):145;sprite(fx,246,'#a86e57','#584337',2,filmScene>=6?filmTime:0);sprite(fx+21,246,'#bb9e63','#4a4236',2,filmScene>=6?filmTime:0);sprite(fx-12,253,'#8f6d5c','#514536',2,filmScene>=6?filmTime:0,true);
label(filmScene>=6?'A FAMÍLIA PROCURA UMA SAÍDA':'TROPAS ENTRAM EM AURORA',187,67,'#e5c398',9);
}
ctx.restore();rect(0,0,W,28,'#17231f');rect(0,H-15,W,15,'#17231f');
}

function openBag(done){if(cinematic||transitioning)return;if(!(hasDocs||returned)){done?.();return}keys.clear();inspecting=true;inspectionDone=done||null;$('bagDialog').showModal();$('bagContext').textContent=bagScene==='checkpoint'?'CONTROLE DE FRONTEIRA · A pasta sobre a mesa de inspeção':'MEMÓRIAS DE CASA · Abra um dos objetos sobre a pasta';$('closeBag').textContent=bagScene==='checkpoint'?'Entregar documentos ao militar →':'Guardar a pasta →';showItem('overview')}
function closeBag(){$('bagDialog').close();inspecting=false;bagScene='memories';const done=inspectionDone;inspectionDone=null;done?.();canvas.focus()}
function showItem(item){
const overview=item==='overview';$('bagDesk').hidden=!overview;$('backToFolder').hidden=overview;$('itemPanel').hidden=overview;$('bagArt').hidden=item!=='photo';
if(overview){drawPhoto('photoThumb');return}
$('itemTitle').textContent={documents:'Os documentos que identificam a família',letter:'Uma carta de Mara para Lia',photo:'Aniversário de Davi · Aurora, antes da guerra'}[item];
$('itemText').innerHTML=item==='documents'?'<div class="individual-documents">'+[['LIA','Mãe','Nascida em Aurora'],['NOA','Filho mais velho','Estudante · Aurora'],['DAVI','Filho mais novo','Seis anos · Aurora']].map(([name,role,birth])=>'<article class="civil-record"><div class="record-seal">✦</div><small>REPÚBLICA DO VALE · REGISTRO CIVIL</small><h3>'+name+'</h3><p>'+role+'<br>'+birth+'</p><span>Grupo familiar: Lia, Noa e Davi</span><footer>FICTÍCIO · SEM VALIDADE OFICIAL</footer></article>').join('')+'</div><p>As folhas estão amassadas nos cantos, mas os nomes continuam legíveis.</p>':item==='letter'?'<div class="letter"><p>Lia,</p><p>Cheguei ao posto do vale. Há uma equipe orientando quem chega. Ainda não sei onde vou ficar, mas consegui descansar.</p><p>Quando puderem sair com segurança, procurem o acolhimento. Quero muito saber de vocês. Levem a foto do aniversário do Davi, se ainda estiver aí.</p><p>Com carinho,<br>Mara</p></div>':'<p class="photo-caption">No verso, a letra de Lia: “Seis anos do Davi. Noa trouxe o bolo. Um dia para guardar.”</p>';
if(item==='photo')drawPhoto();
}
function drawPhoto(target='bagArt'){
const c=$(target),p=c.getContext('2d');p.imageSmoothingEnabled=false;const r=(x,y,w,h,col)=>{p.fillStyle=col;p.fillRect(Math.round(x),Math.round(y),w,h)};
r(0,0,384,256,'#efe5c7');r(10,10,364,220,'#c3ce9f');r(10,10,364,76,'#bfd4be');r(10,68,364,20,'#99b68c');
// Aurora em um dia de paz: casas, janelas, bandeirinhas, jardim e praça.
for(const [x,y,w]of [[19,53,95],[263,47,99]]){r(x,y,w,70,'#cfb389');for(let i=0;i<5;i++)r(x-5+i*3,y-20+i*4,w+10-i*6,5,i%2?'#a17b56':'#b08c60');r(x+10,y+18,17,22,'#587267');r(x+w-30,y+18,17,22,'#587267');r(x+12,y+20,5,10,'#9fb7a0');r(x+w-28,y+20,5,10,'#9fb7a0');r(x+10,y+31,17,2,'#c3b18a');r(x+40,y+28,19,42,'#7a7052');r(x,y+66,w,4,'#a1926b')}
for(let i=0;i<13;i++){const x=19+i*28,y=41+Math.sin(i*.2)*6;r(x,y,2,2,'#77785b');r(x,y+3,12,8,['#bb7d68','#e1c784','#8da79a'][i%3]);r(x+3,y+10,6,4,['#bb7d68','#e1c784','#8da79a'][i%3])}
r(10,143,364,87,'#b8a077');for(let i=0;i<60;i++)r(12+hash(i,12)*355,144+hash(i,17)*83,4,1,'#d0b991');for(const x of [28,333]){r(x+8,83,6,68,'#80774e');r(x-12,55,50,37,'#799358');r(x-3,43,36,41,'#8da56b');r(x,52,22,9,'#a3b77c');r(x-8,79,23,7,'#6a8752')}
for(let i=0;i<20;i++){let x=20+i*17;r(x,128+hash(i,4)*10,2,9,'#80915c');r(x-2,126+hash(i,4)*10,5,3,i%2?'#d9bb7b':'#bd8c72')}
// Rostos maiores, silhuetas e roupas correspondentes aos retratos de diálogo.
function person(x,y,scale,hair,coat,child=false){p.save();p.translate(x,y);p.scale(scale,scale);r(-13,29,11,20,'#56594c');r(2,29,11,20,'#56594c');r(-15,47,14,4,'#675443');r(2,47,15,4,'#675443');r(-17,0,34,32,coat);r(-21,5,6,24,skin);r(15,5,6,24,skin);r(-7,-5,14,11,skin);r(-13,-35,26,31,'#7d5e47');r(-12,-34,24,29,skin);r(-14,-37,28,10,hair);r(-15,-30,6,19,hair);r(10,-30,5,child?9:30,hair);r(-10,-25,20,3,'#dfb38b');r(-9,-20,6,4,'#eee0bc');r(3,-20,6,4,'#eee0bc');r(-7,-20,2,4,'#384b3a');r(4,-20,2,4,'#384b3a');r(-10,-23,7,1,hair);r(3,-23,7,1,hair);r(-1,-17,3,5,'#b78563');r(-9,-12,4,2,'#cc9679');r(6,-12,4,2,'#cc9679');r(-5,-8,10,2,'#98634e');r(-3,-8,6,1,'#efcfaa');if(coat==='#bb9e63'){r(-16,2,32,5,'#b87754');r(7,6,6,18,'#b87754')}if(!child){r(-15,1,8,3,'#d7b691');r(9,1,7,3,'#d7b691')}p.restore()}
const skin='#d3aa82';person(122,143,1.4,'#584337','#a86e57');person(258,141,1.45,'#4a4236','#bb9e63');person(191,169,1.03,'#514536','#8f6d5c',true);
// Bolo e mesa do aniversário: a fotografia tem uma história reconhecível.
r(149,205,86,6,'#937552');r(154,210,5,20,'#806346');r(224,210,5,20,'#806346');r(170,190,47,15,'#d3ab78');r(170,190,47,4,'#eee0bb');r(175,198,36,2,'#b97b64');for(let i=0;i<6;i++){r(176+i*6,181,2,9,'#8ba29a');r(176+i*6,178,2,3,'#e5bc70')}
r(14,17,3,100,'#ffffff18');r(365,14,2,212,'#8d7e5c22');p.font='10px monospace';p.fillStyle='#776b54';p.fillText('SEIS ANOS DO DAVI · AURORA',46,246);
}

function canMove(x,y){if(x<12||x>628||y<30||y>374)return false;const blocks=area?borderBlocks:villageBlocks;for(const b of blocks)if(x+6>b.x&&x-6<b.x+b.w&&y>b.y&&y-7<b.y+b.h)return false;if(area===1&&!checked&&x>290)return false;if(area===1&&x>180&&x<235&&(y<172||y>237))return false;return true}
function update(dt){
if(paused||$('infoModal').open||inspecting||document.hidden)return;if(transitioning)return;if(cinematic){updateScene(dt);return;}
if(document.hidden)return;if(flashback){filmTime+=dt;filmElapsed+=dt;$('filmHeading').textContent='FLASHBACK · AURORA · '+(filmScene<2?'NA VÉSPERA':'MADRUGADA DA INVASÃO');if(sound&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&filmScene>=2&&Math.floor(filmTime*2)!==lastLetter){lastLetter=Math.floor(filmTime*2);if(lastLetter%5===0)impact()}}
if(dialog){typing+=dt;const n=Math.min(dialog.text.length,Math.floor(typing*34));if(n!==visibleChars){visibleChars=n;$('dialogueText').textContent=dialog.text.slice(0,n);if(n<dialog.text.length&&/[^\s.,!?…]/.test(dialog.text[n-1]||''))tone(170+activeFace.charCodeAt(0)*2,.025,.008)}drawFace(activeFace,n<dialog.text.length&&/[\p{L}\p{N}]/u.test(dialog.text[Math.max(0,n-1)]||'')?1+Math.floor(clock*12)%2:0);return}
if(!started||ended||flashback)return;let dx=0,dy=0;if(keys.has('w')||keys.has('ArrowUp'))dy=-1;if(keys.has('s')||keys.has('ArrowDown'))dy=1;if(keys.has('a')||keys.has('ArrowLeft'))dx=-1;if(keys.has('d')||keys.has('ArrowRight'))dx=1;if(dx&&dy)dy=0;let speed=80*dt;if(dx||dy){player.walk+=dt;if(dx)player.dir=dx<0?1:2;else player.dir=dy<0?3:0;if(canMove(player.x+dx*speed,player.y))player.x+=dx*speed;if(canMove(player.x,player.y+dy*speed))player.y+=dy*speed;}else player.walk=0;
if(dx||dy){trail.push({x:player.x,y:player.y,dir:player.dir});if(trail.length>45)trail.shift();if(area&&returned){for(let i=0;i<2;i++){const pos=trail[Math.max(0,trail.length-1-(i+1)*14)];if(pos&&canMove(pos.x,pos.y))family[i]={...pos}}}}
let n=nearest();$('interaction').hidden=!n;if(n)$('interaction').querySelector('span').textContent=n.id==='water'?'Encher a cantil':n.id==='docs'?'Recolher documentos':n.id==='exit'?'Seguir para a fronteira':'Conversar';if(!area&&stage===0&&Math.hypot(player.x-338,player.y-239)<46){meetFamily();return}if(!area&&stage===1&&hasDocs&&Math.hypot(player.x-338,player.y-239)<46){returnFamily();return}if(!area&&stage===2&&water&&Math.hypot(player.x-504,player.y-130)<40){confirmRoute();return}if(area&&!checked&&player.x>243){checkpointScene();return}if(area&&checked&&Math.hypot(player.x-473,player.y-165)<44){welcomeScene();return}if(!area&&stage===3&&player.x>490&&player.x<551&&player.y<38)changeArea(1);}
function drawStoryActions(){
const c=cinematic,p=c?Math.min(1,c.time/(c.steps[c.index].duration||4)):0;
if(c?.kind==='photo'){rect(0,0,W,H,'#1c2e25cc');ctx.drawImage($('photoThumb'),155,64,330,220);label('UMA LEMBRANÇA QUE VEIO CONOSCO',187,311,'#e5d8af',8)}
if(c?.kind==='water'){rect(278,215,9,13,'#647969');rect(280,212,5,3,'#c8cbb0');rect(280,226-8*p,5,Math.ceil(8*p),'#96b8ab');for(let i=0;i<3;i++)rect(274+i*3,208+(c.time*18+i*6)%12,1,3,'#afccbb')}
if(c?.kind==='checkpoint'){
rect(259,180,38,12,'#7f7153');rect(262,192,3,10,'#6b6248');rect(290,192,3,10,'#6b6248');
const x=c.index===0?250:c.index===1?250+25*p:c.index===2?275:275-25*p;
rect(x,179,12,9,'#bfa574');rect(x+2,177,9,8,'#e4dabc');rect(x+3,179,6,1,'#a9a48b');if(c.index===2){rect(279,173,3,4,'#d2b58b');label('LIA · NOA · DAVI',266,158,'#e5d8ae',6)}
}
if(dailyLife){
// Mesmo abrigo, alguns dias depois: atividades em vez de uma explicação longa.
rect(377,250,41,15,'#8d9f82');rect(379,251,10,10,'#d3d1b3');rect(420,250,40,15,'#84987d');rect(422,251,9,10,'#d3d1b3');crate(465,254);
rect(496,215,42,20,'#5d745c');rect(493,213,48,3,'#a99e72');rect(498,235,3,12,'#8b805a');rect(531,235,3,12,'#8b805a');label('A B C',505,228,'#dfd9b2',7);
for(const [i,x]of [480,500,522].entries())sprite(x,253+(i%2)*7,['#a68a66','#818f86','#ab7761'][i],'#554839',0,Math.sin(clock+i)>.8?clock:0,true);
rect(543,182,24,37,'#a49976');rect(545,184,20,10,'#556e62');rect(548,198,10,3,'#d8cfad');rect(550,205,8,2,'#d8cfad');rect(549,176,2,9,'#5b6650');label('MENSAGENS',527,172,'#e7d8ac',6);
if(c?.kind==='daily'){
 if(c.index===0){rect(435+12*p,219,4,6,'#b8c9b5');rect(436+12*p,218,3,2,'#d9dfc6')}
 if(c.index===1){rect(399+15*p,244,15,7,'#bda578');rect(400+15*p,242,12,3,'#dbcb9c')}
 if(c.index===2){sprite(543,251,'#7f8b72','#6c5340');label('ESCOLA / ACOLHIMENTO',469,281,'#dbd5b2',6)}
 if(c.index===3){rect(534,205,10,6,'#e4d5aa');rect(536,206,6,1,'#9c9f80');label('PARA MARA',516,238,'#e6dbb9',6)}
 if(c.index===4){rect(430,248,11,8,'#e9ddbb');rect(432,249,7,4,'#93a77f')}
 }
}
if(!area&&stage>=2){label('ROTA DO VALE ↑',462,83,'#e5d5a3',7);label('ESCOLA × INTERDITADA',66,182,'#dac38f',6)}
}

function draw(){if(flashback){drawFilm();return}ctx.clearRect(0,0,W,H);area?borderMap():village();if(!area&&stage===2&&!water){rect(291,218,7,10,'#6a7967');rect(293,216,3,3,'#b3b994');label('ÁGUA',260,251,'#e5dcba',6)}if(!area)sprite(353,252,'#8f6d5c','#514536',0,0,true);let characters=area?[borderNPC]:npcs;if(area&&returned)characters=[...characters,{...family[0],color:'#a86e57',hair:'#584337'},{...family[1],color:'#8f6d5c',hair:'#514536',child:true}];const chars=[...characters.map(n=>({...n,walk:n.walk||0,dir:n.dir||0})),{...player,color:'#bb9e63',hair:'#4a4236',isPlayer:true}].sort((a,b)=>a.y-b.y);for(const c of chars)sprite(c.x,c.y,c.color,c.hair,c.dir,c.walk,c.child);if(area){soldier(274,207);soldier(318,151);label('CONTROLE · AGUARDE',242,257);if(!checked){for(let x=291;x<357;x+=8)rect(x,177,6,5,x%16?'#c4ad76':'#5e634b');rect(292,179,3,53,'#626b52')}else label('PASSAGEM AUTORIZADA →',305,190,'#dfd1a4',6);label('ÁGUA / DESCANSO',390,263,'#d5d6b2',6)}else{soldier(536,137);label('ÁREA INTERDITADA',398,126,'#d6bb81',6)}drawStoryActions();const o=objective();if(!ended&&!cinematic&&!transitioning)marker(o.x,o.y);if(!area&&stage===3)label('↑ ROTA DO VALE',476,20,'#ead8a1',7);
// Poeira sutil levada pelo vento.
for(let i=0;i<13;i++){let x=(hash(i,20)*W+clock*5)%W,y=(hash(i,21)*H+Math.sin(clock*.4+i)*6)%H;rect(x,y,1,1,'#e5d7aa55')}
}
function loop(t){const dt=Math.min((t-last)/1000,.04);last=t;clock+=dt;update(dt);draw();requestAnimationFrame(loop)}
function start(){started=true;$('startScreen').hidden=true;$('areaTag').hidden=true;canvas.focus();updateJournal();if(!sound)enableSound();beginFilm()}
function togglePause(){if(!started||ended||transitioning||inspecting)return;paused=!paused;keys.clear();$('paused').hidden=!paused;$('pause').textContent=paused?'▷':'Ⅱ';$('pause').setAttribute('aria-label',paused?'Continuar jogo':'Pausar jogo');if(paused)music.pause();else{if(sound)music.play().catch(()=>{});canvas.focus()}}
function tone(freq,duration,volume=.025){if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}
const music=new FrontierMusic();music.loop=true;music.volume=.22;let musicKind='aurora',musicFade=null;
function audioState(){$('sound').innerHTML='♪ <span>Som '+(sound?'ligado':'desligado')+'</span>';$('sound').setAttribute('aria-label',sound?'Desativar som':'Ativar som')}
async function enableSound(){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();await audio.resume();sound=true;audioState();if(!paused&&!document.hidden)await music.play()}catch{sound=false;audioState();$('audioNotice').hidden=false}}
function setMusic(kind){if(kind===musicKind)return;musicKind=kind;clearInterval(musicFade);music.pause();music.src=kind==='hope'?'vale':'aurora';music.volume=0;if(sound&&!paused)music.play().catch(()=>{$('audioNotice').hidden=false});musicFade=setInterval(()=>{music.volume=Math.min(Number($('musicVolume').value)/100,music.volume+.015);if(music.volume>=Number($('musicVolume').value)/100)clearInterval(musicFade)},90)}
$('sound').onclick=()=>{if(sound){sound=false;music.pause();audioState()}else enableSound()};
$('musicVolume').oninput=e=>{clearInterval(musicFade);music.volume=Number(e.target.value)/100};
document.addEventListener('visibilitychange',()=>{if(document.hidden)music.pause();else if(sound&&!paused)music.play().catch(()=>{})});

$('start').onclick=start;$('nextDialogue').onclick=advance;$('touchInteract').onclick=interact;$('pause').onclick=togglePause;$('resume').onclick=togglePause;$('restart').onclick=()=>{area=0;stage=0;cinematic=null;transitioning=false;transitionDone=null;dailyLife=false;$('presentCard').hidden=true;$('paused').hidden=true;water=false;route=false;bagScene='memories';checked=false;trail=[];family[0]={x:338,y:239};family[1]={x:350,y:250};hasDocs=false;returned=false;ended=false;paused=false;dialog=null;player.x=305;player.y=286;player.dir=0;keys.clear();$('ending').hidden=true;$('location').textContent='Vila de Aurora';$('areaTag').innerHTML='VILA DE AURORA<span>Um lugar que já foi lar.</span>';for(let i=0;i<4;i++)$('q'+i).querySelector('.step').textContent=String(i+1).padStart(2,'0');start()};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('gameColumn').requestFullscreen()}catch{modal('Tela ampliada','<p>Seu navegador não oferece tela cheia aqui. Você pode usar o zoom do navegador ou jogar normalmente nesta janela.</p>')}};
function modal(title,html){keys.clear();if(started&&!paused&&!ended&&!dialog)togglePause();$('modalTitle').textContent=title;$('modalContent').innerHTML=html;$('infoModal').showModal()}
$('about').onclick=()=>modal('Pessoas, lugares e recomeços.','<p>Um pequeno jogo educacional de Geografia sobre <strong>guerra, deslocamento populacional, fronteiras e busca por proteção</strong>.</p><p>Aurora e seus personagens são fictícios. A história trata de experiências vividas por milhões de pessoas, sem representar um conflito específico.</p><p>Feito em HTML, CSS e JavaScript, com arte original desenhada em Canvas. Sem combate, pontuação ou quiz.</p>');
$('help').onclick=()=>{const target=objective();const tips={lia:hasDocs?'Volte à praça com a pasta. A cena começa ao se aproximar da sua mãe.':'Aproxime-se de Lia, na praça, para começar a partida.',docs:'A pasta está no chão, diante da casa com varal, a sudoeste. Use E.',water:'Aproxime-se do poço pela parte de baixo e pressione E.',tomas:'Siga a estrada à direita da praça até o portão, a nordeste.',exit:'Suba pela passagem à direita de Tomás. A saída fica ao norte.',military:'Atravesse a ponte para leste. A abordagem começa ao se aproximar da barreira.',sara:'Continue a leste até Sara, de roupa clara, diante do posto.'};modal('Seu próximo passo','<p>'+tips[target.id]+'</p>')};
for(const b of document.querySelectorAll('.close,.close-action'))b.onclick=()=>$('infoModal').close();
const dirs={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};for(const b of document.querySelectorAll('[data-dir]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(dirs[b.dataset.dir])});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(dirs[b.dataset.dir]))}
window.addEventListener('keydown',e=>{if($('infoModal').open||inspecting)return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','e','w','a','s','d','Escape','Enter'].includes(key))e.preventDefault();if(key==='Escape'){togglePause();return}if(transitioning){if(key==='Enter'||key==='e'||key===' ')continueTransition();return}if(key==='e'||key==='Enter'||key===' '){if(!e.repeat){if(!started)start();else interact()}return}keys.add(key)});window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear();if(started&&!paused&&!ended&&!dialog)togglePause()});document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear()});
$('inspectBag').onclick=()=>{if(!cinematic&&!transitioning)openBag()};$('closeBag').onclick=closeBag;for(const b of document.querySelectorAll('[data-item]'))b.onclick=()=>showItem(b.dataset.item);
$('backToFolder').onclick=()=>showItem('overview');$('skipFilm').onclick=()=>{if(flashback)finishScene()};$('skipScene').onclick=()=>{if(!paused)finishScene()};$('continueTransition').onclick=continueTransition;$('bagDialog').addEventListener('cancel',e=>{e.preventDefault();closeBag()});
$('sources').onclick=()=>modal('Relatos que orientaram a história',`<p>Personagens e cenas são fictícios. A pesquisa orientou os temas; não reproduzimos uma história real específica.</p><ul><li><a href="https://www.unhcr.ca/news/news-stories-2022-3-6229dc0f4-ukrainian-family-confronts-new-reality-life-refugees-html/" target="_blank" rel="noopener">ACNUR · Valentina e Irinia, Ucrânia (2022)</a>: explosões, fuga e acolhimento.</li><li><a href="https://www.acnur.org/br/noticias/comunicados-imprensa/finalmente-somos-livres" target="_blank" rel="noopener">ACNUR · Yusra Bakri e Khaled, Síria (2018)</a>: separação familiar e perda de documentos.</li><li><a href="https://www.doctorswithoutborders.ca/sudan-we-dont-know-where-we-can-go/" target="_blank" rel="noopener">MSF · Chira Casah e Dak Denj Uchol (2024)</a>: perda de contato e postos militares. Dak é identificada como retornada ao Sudão do Sul.</li></ul><p>A abordagem militar é ficcional; os procedimentos variam entre países. Carta e fotografia são criações para o jogo.</p><p>Trilhas: “Aurora” e “Vale”, composições instrumentais originais deste projeto. Pesquisa musical e referências no arquivo CREDITOS.md.</p>`);

$('areaTag').hidden=true;requestAnimationFrame(loop);
})();
