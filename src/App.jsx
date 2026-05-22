import { useState, useRef, useEffect, useCallback } from "react";

const SEGS = [
  { bg:"#FFE500",fg:"#000" },{ bg:"#FF2200",fg:"#fff" },
  { bg:"#00CFFF",fg:"#000" },{ bg:"#FF6B00",fg:"#000" },
  { bg:"#7B2FFF",fg:"#fff" },{ bg:"#C8FF00",fg:"#000" },
  { bg:"#FF0066",fg:"#fff" },{ bg:"#00FF9F",fg:"#000" },
  { bg:"#FF1493",fg:"#fff" },{ bg:"#FFFFFF",fg:"#000" },
  { bg:"#1E90FF",fg:"#fff" },{ bg:"#FFD700",fg:"#000" },
  { bg:"#9400D3",fg:"#fff" },{ bg:"#39FF14",fg:"#000" },
  { bg:"#FF4500",fg:"#fff" },{ bg:"#00FFFF",fg:"#000" },
  { bg:"#FF00CC",fg:"#fff" },{ bg:"#A0522D",fg:"#fff" },
  { bg:"#ADFF2F",fg:"#000" },{ bg:"#4169E1",fg:"#fff" },
];

const GC = ["#FFE500","#FF2200","#00CFFF","#C8FF00","#FF0066","#7B2FFF"];
const GI = ["🟡","🔴","🔵","🟢","🩷","🟣"];

const THEME_LABELS = {
  sports:{ pt:"Desporto", en:"Sports"  },
  school:{ pt:"Escola",   en:"School"  },
  work:  { pt:"Trabalho", en:"Work"    },
  games: { pt:"Jogos",    en:"Games"   },
  party: { pt:"Festa",    en:"Party"   },
};

const THEMES = {
  sports:{
    icon:"⚽", fx:["⚽","🏆","⭐","🏅","🔥","💪","🥇","👟"],
    names:{ pt:["Equipa A","Equipa B","Equipa C","Equipa D","Equipa E","Equipa F"], en:["Team A","Team B","Team C","Team D","Team E","Team F"] },
    inj:{ pt:["Injusto! Mais uma... ⚽","ÚLTIMA CHANCE! ⚠️","Aceita o jogo! 🏆","É a bola que gira, não tu! 🫵","VAI JOGAR A CASA! 😡"], en:["Unfair! One more... ⚽","LAST CHANCE! ⚠️","Accept the game! 🏆","The ball rolls, not you! 🫵","GO PLAY AT HOME! 😡"] },
    sound:"whistle",
  },
  school:{
    icon:"📚", fx:["📚","✏️","🎓","⭐","📝","🏆","💯","🔬"],
    names:{ pt:["Grupo 1","Grupo 2","Grupo 3","Grupo 4","Grupo 5","Grupo 6"], en:["Group 1","Group 2","Group 3","Group 4","Group 5","Group 6"] },
    inj:{ pt:["Está bem, professor... 🙄","Última vez, juro! 😤","A nota não muda! 📚","Tu é que tens negativas! 🫵","VAI TU À FRENTE! 😡"], en:["Ok, teacher... 🙄","Last time, I swear! 😤","The grade won't change! 📚","You're the one failing! 🫵","GO TO THE BOARD! 😡"] },
    sound:"fanfare",
  },
  work:{
    icon:"💼", fx:["💼","📊","🏆","✅","💡","🚀","📈","🎯"],
    names:{ pt:["Alpha","Beta","Gamma","Delta","Epsilon","Zeta"], en:["Alpha","Beta","Gamma","Delta","Epsilon","Zeta"] },
    inj:{ pt:["Marcamos reunião? 🙄","Ok mas há KPIs! 😤","O algoritmo é imparcial! 💼","Tu és o bottleneck! 🫵","FAZ UM EXCEL ENTÃO! 😡"], en:["Schedule a meeting? 🙄","Ok but there are KPIs! 😤","The algorithm is unbiased! 💼","You're the bottleneck! 🫵","MAKE A SPREADSHEET! 😡"] },
    sound:"fanfare",
  },
  games:{
    icon:"🎲", fx:["🎲","🃏","🎮","🏆","🎯","🎪","🕹️","👾"],
    names:{ pt:["Equipa 1","Equipa 2","Equipa 3","Equipa 4","Equipa 5","Equipa 6"], en:["Team 1","Team 2","Team 3","Team 4","Team 5","Team 6"] },
    inj:{ pt:["Mais uma jogada... 🎲","ÚLTIMA rodada! 😤","A sorte é assim! 🎯","Tu és o bug do jogo! 🫵","BARALHA TU ENTÃO! 😡"], en:["One more roll... 🎲","LAST round! 😤","That's how luck works! 🎯","You're the game bug! 🫵","SHUFFLE IT YOURSELF! 😡"] },
    sound:"whistle",
  },
  party:{
    icon:"🎉", fx:["🎉","🎊","🥳","🍾","✨","🎈","🪩","🫧"],
    names:{ pt:["Vermelho","Azul","Verde","Amarelo","Roxo","Laranja"], en:["Red","Blue","Green","Yellow","Purple","Orange"] },
    inj:{ pt:["Vai lá, mais uma... 🎉","Ok mas depois festa! 🥳","A festa decidiu! 🎊","Tu és o chato da festa! 🫵","ESCOLHE TU ENTÃO! 😡"], en:["Go on, one more... 🎉","Ok but then party! 🥳","The party decided! 🎊","You're the party pooper! 🫵","PICK IT YOURSELF! 😡"] },
    sound:"fanfare",
  },
};

const T = {
  pt:{
    sub:"Quem paga a próxima?", ph:"Nome do amigo...", add:"JUNTAR",
    spin:"GIRAR A RODA", spinning:"A GIRAR...",
    pays:"PAGA A RODADA!", again:"OUTRA VEZ",
    share:"↗ PARTILHAR", shareResult:"📲 PARTILHAR RESULTADO", copied:"✓ COPIADO!",
    eMin:"Junta pelo menos 2 amigos!", eMax:"Máximo 20 amigos!", eDup:"Esse nome já está na roda!",
    tag:"GIRA · DECIDE · PAGA · REPETE", shame:"PATROCINADORES DA NOITE", toggle:"EN",
    testBtn:"🎯 TESTAR 100×",
    testTitle:"TESTE DE 100 RODADAS",
    testSub:"Probabilidade esperada: cada amigo deveria sair",
    testTimes:"vezes",
    testFair:"✓ Distribuição uniforme — cada amigo tem a mesma probabilidade",
    testClose:"FECHAR",
    tabWheel:"RODADA", tabGroups:"GRUPOS",
    msgs:["Tira a carteira! 💸","É a tua vez! 🍺","Sorte tem preço! 💀","Dá cá o MB Way! 📱","Não fujas! 🏃‍♂️","A vida é assim! 🎲","Aí tens, campeão! 🏆","Desta não escapas! 👋"],
    msgsRepeat:["DE NOVO?! O karma é real! 😂","A sorte não está do teu lado! 💀","Dois seguidos! Estás amaldiçoado! 🤣","A roda adora-te! (a carteira nem por isso) 😭"],
    msgsMulti:["Vai ter de vender um rim! 🫁","O carro já tem comprador! 🚗💨","A casa vai à praça! 🏠🔨","Cancela as férias! ✈️❌","O seguro de vida vai valer! 📋💀","Pede o dinheiro à ex! 💍😬","O banco ligou, estão preocupados! 🏦📞","A mãe vai ter de saber disto! 👩‍👦😅","Duas semanas a comer sopa! 🍲😭","Oficialmente falido! 📉💸","O senhorio vai ter de esperar! 🏠😬","Começas amanhã no Uber Eats! 🛵📱"],
    shareMsg:(n)=>`🍺 O ${n} paga a próxima rodada!\nSorteado em rodada.pt`,
    groupSub:"Divide qualquer grupo — escola, desporto, trabalho, festas",
    playerPh:"Nome do participante...", playerAdd:"JUNTAR",
    eGMin:"Precisa de pelo menos 4 participantes!", eGMax:"Máximo 30 participantes!", eGDup:"Esse participante já está na lista!",
    themeLabel:"CONTEXTO", numLabel:"Nº DE GRUPOS",
    sortBtn:(icon)=>`${icon} SORTEAR GRUPOS`, sorting:"A SORTEAR...",
    leaderLabel:"⭐ Líder", subsLabel:"Ficam de fora",
    injusto:"⚠️ INJUSTO! SORTEAR DE NOVO",
    shareGroups:"📲 PARTILHAR GRUPOS",
    tagGroups:"SORTEIA · DIVIDE · CONQUISTA",
    pCount:(n)=>`${n} participante${n!==1?"s":""}`,
    gInfo:(ng,ps)=>`${ng} grupo${ng!==1?"s":""} · ~${ps} por grupo`,
    footer:"Feito com 🍺 em Portugal",
  },
  en:{
    sub:"Who's buying the round?", ph:"Friend's name...", add:"ADD",
    spin:"SPIN THE WHEEL", spinning:"SPINNING...",
    pays:"BUYS THE ROUND!", again:"AGAIN",
    share:"↗ SHARE", shareResult:"📲 SHARE RESULT", copied:"✓ COPIED!",
    eMin:"Add at least 2 friends!", eMax:"Maximum 20 friends!", eDup:"That name is already on the wheel!",
    tag:"SPIN · DECIDE · PAY · REPEAT", shame:"TONIGHT'S SPONSORS", toggle:"PT",
    testBtn:"🎯 TEST 100×",
    testTitle:"TEST OF 100 SPINS",
    testSub:"Expected probability: each friend should appear",
    testTimes:"times",
    testFair:"✓ Uniform distribution — each friend has equal probability",
    testClose:"CLOSE",
    tabWheel:"ROUND", tabGroups:"GROUPS",
    msgs:["Get your wallet out! 💸","It's your round, mate! 🍺","Luck has a price! 💀","Time to pay up! 📱","No running away! 🏃‍♂️","That's life! 🎲","There you go, champ! 🏆","No escape this time! 👋"],
    msgsRepeat:["AGAIN?! Karma is real! 😂","Luck's not on your side! 💀","Twice in a row! Cursed! 🤣","The wheel loves you! (wallet, not so much) 😭"],
    msgsMulti:["Time to sell a kidney! 🫁","Car's on eBay already! 🚗💨","House goes to auction! 🏠🔨","Cancel the holidays! ✈️❌","Life insurance looking good! 📋💀","Ask your ex for money! 💍😬","Bank called, they're worried! 🏦📞","Your mum needs to know! 👩‍👦😅","Two weeks of noodles! 🍜😭","Officially bankrupt! 📉💸","Landlord can wait! 🏠😬","Starting Deliveroo tomorrow! 🛵📱"],
    shareMsg:(n)=>`🍺 ${n} is buying the next round!\nDrawn at rodada.pt`,
    groupSub:"Split any group — school, sports, work, parties",
    playerPh:"Participant name...", playerAdd:"ADD",
    eGMin:"Need at least 4 participants!", eGMax:"Maximum 30 participants!", eGDup:"That participant is already on the list!",
    themeLabel:"CONTEXT", numLabel:"N° OF GROUPS",
    sortBtn:(icon)=>`${icon} SORT GROUPS`, sorting:"SORTING...",
    leaderLabel:"⭐ Leader", subsLabel:"Leftovers",
    injusto:"⚠️ UNFAIR! SORT AGAIN",
    shareGroups:"📲 SHARE GROUPS",
    tagGroups:"SORT · DIVIDE · CONQUER",
    pCount:(n)=>`${n} participant${n!==1?"s":""}`,
    gInfo:(ng,ps)=>`${ng} group${ng!==1?"s":""} · ~${ps} each`,
    footer:"Made with 🍺 in Portugal",
  },
};

const WHEEL_DEF = ["Miguel","Sara","João","Inês"];
const GROUP_DEF = ["Miguel","Sara","João","Inês","Pedro","Ana"];
const BEER_FX   = ["🍺","🍻","🎉","💸","🥂","🎊","🏅","🔥"];
const SZ=360, R=SZ/2-46;
const NUM_OPTS=[2,3,4,5,6];

// ── True uniform random helpers ──
// crypto.getRandomValues gives 32-bit uniform integers, divided to get [0,1) uniform
const cryptoRandom = () => {
  try {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return arr[0] / 0x100000000;
    }
  } catch(e) {}
  return Math.random();
};

// Fisher-Yates shuffle — provably uniform (unlike sort(()=>Math.random()-0.5))
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// helper: lighten a hex color for gradient highlights
const lighten = (hex, amt=0.25) => {
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r = Math.min(255, Math.round(r + (255-r)*amt));
  g = Math.min(255, Math.round(g + (255-g)*amt));
  b = Math.min(255, Math.round(b + (255-b)*amt));
  return `rgb(${r},${g},${b})`;
};
const darken = (hex, amt=0.3) => {
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  r = Math.round(r*(1-amt));
  g = Math.round(g*(1-amt));
  b = Math.round(b*(1-amt));
  return `rgb(${r},${g},${b})`;
};

export default function App() {
  const [lang,setLang]       = useState("pt");
  const [tab,setTab]         = useState("rodada");
  const [sparks,setSparks]   = useState([]);
  const [friends,setFriends] = useState([...WHEEL_DEF]);
  const [fInput,setFInput]   = useState("");
  const [spinning,setSpinning]= useState(false);
  const [winner,setWinner]   = useState(null);
  const [fErr,setFErr]       = useState("");
  const [shared,setShared]   = useState(false);
  const [payCount,setPayCount]= useState({});
  const [lastWin,setLastWin] = useState(null);
  const [testResults,setTestResults] = useState(null);
  const [players,setPlayers] = useState([...GROUP_DEF]);
  const [pInput,setPInput]   = useState("");
  const [theme,setTheme]     = useState("sports");
  const [numGrps,setNumGrps] = useState(2);
  const [result,setResult]   = useState(null);
  const [phase,setPhase]     = useState("idle");
  const [pErr,setPErr]       = useState("");
  const [reshuffles,setReshuffles]= useState(0);

  const canvasRef=useRef(null), angleRef=useRef(0), animRef=useRef(null);
  const audioRef=useRef(null), lastSegRef=useRef(-1);
  const friendsRef=useRef(friends), langRef=useRef(lang);
  const payRef=useRef(payCount), lastWRef=useRef(lastWin);

  useEffect(()=>{ friendsRef.current=friends; },[friends]);
  useEffect(()=>{ langRef.current=lang; },[lang]);
  useEffect(()=>{ payRef.current=payCount; },[payCount]);
  useEffect(()=>{ lastWRef.current=lastWin; },[lastWin]);

  useEffect(()=>{
    if(players.length < numGrps*2 && numGrps > 2){
      const max=Math.max(2, Math.floor(players.length/2));
      setNumGrps(max); setResult(null); setPhase("idle");
    }
  },[players.length, numGrps]);

  const t=T[lang], th=THEMES[theme];

  useEffect(()=>{
    const id="__rf";
    if(!document.getElementById(id)){
      const l=document.createElement("link");
      l.id=id;l.rel="stylesheet";
      l.href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;700&display=swap";
      document.head.appendChild(l);
    }
  },[]);

  useEffect(()=>{
    try{
      const p=new URLSearchParams(window.location.search);
      const n=p.get("friends"),lp=p.get("lang");
      if(n){const ps=n.split(",").map(s=>s.trim()).filter(Boolean).slice(0,20);if(ps.length>=2)setFriends(ps);}
      if(lp&&T[lp])setLang(lp);
    }catch(e){}
  },[]);

  /* ── audio ── */
  const getAC=useCallback(()=>{
    if(!audioRef.current)try{audioRef.current=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}
    // Resume if suspended (autoplay policy in Chrome/Safari)
    if(audioRef.current && audioRef.current.state==="suspended"){
      audioRef.current.resume().catch(()=>{});
    }
    return audioRef.current;
  },[]);

  // Cleanup on unmount: cancel any running animation, close audio context
  useEffect(()=>()=>{
    if(animRef.current) cancelAnimationFrame(animRef.current);
    if(audioRef.current && audioRef.current.close) audioRef.current.close().catch(()=>{});
  },[]);
  const playTick=useCallback(()=>{const c=getAC();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=650+Math.random()*350;g.gain.setValueAtTime(0.1,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.04);o.start();o.stop(c.currentTime+0.04);}catch(e){}},[getAC]);
  const playFanfare=useCallback(()=>{const c=getAC();if(!c)return;try{[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type="sine";const t0=c.currentTime+i*0.13;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(0.17,t0+0.06);g.gain.exponentialRampToValueAtTime(0.001,t0+0.45);o.start(t0);o.stop(t0+0.5);});}catch(e){}},[getAC]);
  const playWhistle=useCallback(()=>{const c=getAC();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type="sine";o.frequency.setValueAtTime(2400,c.currentTime);o.frequency.linearRampToValueAtTime(2900,c.currentTime+0.08);o.frequency.linearRampToValueAtTime(2200,c.currentTime+0.45);g.gain.setValueAtTime(0.22,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.5);o.start();o.stop(c.currentTime+0.5);}catch(e){}},[getAC]);
  const playBuzz=useCallback(()=>{const c=getAC();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type="square";o.frequency.value=110;g.gain.setValueAtTime(0.18,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.35);o.start();o.stop(c.currentTime+0.35);}catch(e){}},[getAC]);
  const playShuffle=useCallback(()=>{const c=getAC();if(!c)return;try{for(let i=0;i<12;i++){const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=200+Math.random()*1000;const t0=c.currentTime+i*0.09;g.gain.setValueAtTime(0.05,t0);g.gain.exponentialRampToValueAtTime(0.001,t0+0.06);o.start(t0);o.stop(t0+0.06);}}catch(e){}},[getAC]);
  const playReveal=useCallback((s)=>{if(s==="whistle")playWhistle();else playFanfare();},[playWhistle,playFanfare]);

  /* ── canvas — PREMIUM render with gradients and glow ── */
  const draw=useCallback((angle)=>{
    const canvas=canvasRef.current;if(!canvas)return false;
    const c=canvas.getContext("2d");

    // HiDPI / retina: render at device pixel ratio for crisp display
    const dpr = window.devicePixelRatio || 1;
    if(canvas.width !== SZ*dpr){
      canvas.width = SZ*dpr; canvas.height = SZ*dpr;
      canvas.style.width = SZ+"px"; canvas.style.height = SZ+"px";
      c.scale(dpr, dpr);
    }

    const fs=friendsRef.current,n=fs.length;if(!n)return false;
    const cx=SZ/2,cy=SZ/2,arc=(2*Math.PI)/n;
    c.clearRect(0,0,SZ,SZ);

    // outer atmospheric glow (subtle)
    const gg=c.createRadialGradient(cx,cy,R-10,cx,cy,R+30);
    gg.addColorStop(0,"rgba(255,229,0,0)");
    gg.addColorStop(0.6,"rgba(255,229,0,0.08)");
    gg.addColorStop(1,"rgba(255,229,0,0)");
    c.fillStyle=gg;
    c.fillRect(0,0,SZ,SZ);

    // outer black ring with shadow
    c.save();
    c.shadowColor="rgba(255,229,0,0.6)";
    c.shadowBlur=18;
    c.beginPath();c.arc(cx,cy,R+10,0,2*Math.PI);
    c.strokeStyle="#FFE500";c.lineWidth=4;c.stroke();
    c.restore();

    // inner dark ring
    c.beginPath();c.arc(cx,cy,R+5,0,2*Math.PI);
    c.strokeStyle="#0a0a0a";c.lineWidth=3;c.stroke();

    // segments with radial gradient for depth
    for(let i=0;i<n;i++){
      const sa=angle+i*arc,ea=sa+arc,{bg,fg}=SEGS[i%SEGS.length];
      c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R,sa,ea);c.closePath();

      // radial gradient: lighter near center, original at edge
      const grad=c.createRadialGradient(cx,cy,15,cx,cy,R);
      grad.addColorStop(0,lighten(bg,0.18));
      grad.addColorStop(0.5,bg);
      grad.addColorStop(1,darken(bg,0.15));
      c.fillStyle=grad;c.fill();

      // segment divider
      c.strokeStyle="rgba(0,0,0,0.65)";c.lineWidth=2;c.stroke();

      // name text
      c.save();c.translate(cx,cy);c.rotate(sa+arc/2);
      const fz=Math.max(10,Math.min(24,170/n));
      c.font=`700 ${fz}px Anton,sans-serif`;
      c.fillStyle=fg;c.textAlign="right";

      // text shadow for legibility
      c.shadowColor=fg==="#000"?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.5)";
      c.shadowBlur=2;
      c.fillText((fs[i].length>9?fs[i].slice(0,9)+"…":fs[i]).toUpperCase(),R-12,fz*0.36);
      c.restore();
    }

    // center hub — multi-layered
    c.save();
    c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=10;
    c.beginPath();c.arc(cx,cy,32,0,2*Math.PI);c.fillStyle="#0a0a0a";c.fill();
    c.restore();
    c.beginPath();c.arc(cx,cy,32,0,2*Math.PI);
    c.strokeStyle="#FFE500";c.lineWidth=4;c.stroke();

    // inner hub gradient
    const hubGrad=c.createRadialGradient(cx-4,cy-4,2,cx,cy,16);
    hubGrad.addColorStop(0,"#FFF59D");
    hubGrad.addColorStop(0.5,"#FFE500");
    hubGrad.addColorStop(1,"#E6CE00");
    c.beginPath();c.arc(cx,cy,14,0,2*Math.PI);
    c.fillStyle=hubGrad;c.fill();
    c.strokeStyle="#000";c.lineWidth=2;c.stroke();

    // tiny highlight on hub for 3D feel
    c.beginPath();c.arc(cx-3,cy-3,3,0,2*Math.PI);
    c.fillStyle="rgba(255,255,255,0.55)";c.fill();

    // POINTER with gradient and glow
    const tipY=cy-R, baseY=tipY-34, hw=18;
    c.save();
    c.shadowColor="rgba(255,34,0,0.9)";c.shadowBlur=14;
    c.beginPath();c.moveTo(cx,tipY);c.lineTo(cx-hw,baseY);c.lineTo(cx+hw,baseY);c.closePath();
    const ptrGrad=c.createLinearGradient(0,baseY,0,tipY);
    ptrGrad.addColorStop(0,"#FF4500");
    ptrGrad.addColorStop(0.6,"#FF2200");
    ptrGrad.addColorStop(1,"#CC0000");
    c.fillStyle=ptrGrad;c.fill();
    c.restore();

    c.beginPath();c.moveTo(cx,tipY);c.lineTo(cx-hw,baseY);c.lineTo(cx+hw,baseY);c.closePath();
    c.strokeStyle="#000";c.lineWidth=2.5;c.stroke();

    // inner highlight strip on pointer
    c.beginPath();c.moveTo(cx,tipY+4);c.lineTo(cx-hw+7,baseY+8);c.lineTo(cx+hw-7,baseY+8);c.closePath();
    c.fillStyle="rgba(255,255,255,0.28)";c.fill();

    // tick detection
    const norm=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    const local=((Math.PI*1.5-norm)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    const seg=Math.floor(local/arc)%n;
    if(seg!==lastSegRef.current){lastSegRef.current=seg;return true;}
    return false;
  },[]);

  useEffect(()=>{ if(tab==="rodada") draw(angleRef.current); },[friends,draw,tab]);

  const winnerIdx=(a)=>{
    const n=friendsRef.current.length,arc=(2*Math.PI)/n;
    const norm=((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    const local=((Math.PI*1.5-norm)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    return Math.floor(local/arc)%n;
  };

  const boom=(fx=BEER_FX,mul=1)=>{
    const ps=Array.from({length:Math.round(28*mul)},(_,i)=>({id:Date.now()+i,e:fx[~~(Math.random()*fx.length)],x:Math.random()*100,d:Math.random()*0.6,dur:2.5+Math.random()*2,sz:1.3+Math.random()*1.4}));
    setSparks(ps);setTimeout(()=>setSparks([]),5500);
  };

  const pickMsg=(count,isRepeat,l)=>{
    const tr=T[l];
    if(count>=3){const p=tr.msgsMulti;return p[~~(Math.random()*p.length)];}
    if(isRepeat)return tr.msgsRepeat[~~(Math.random()*tr.msgsRepeat.length)];
    return tr.msgs[~~(Math.random()*tr.msgs.length)];
  };

  const spin=()=>{
    if(spinning)return;
    if(friendsRef.current.length<2){setFErr(T[langRef.current].eMin);return;}
    setFErr("");setWinner(null);lastSegRef.current=-1;
    // Uniform random rotation: extra mod 2π is uniform over [0, 2π)
    const extra=Math.PI*2*(7+cryptoRandom()*6),dur=4200+Math.random()*2200;
    const t0=performance.now(),sa=angleRef.current,ea=sa+extra;
    let lt=0;setSpinning(true);
    const frame=(now)=>{
      const p=Math.min((now-t0)/dur,1);
      const cur=sa+(ea-sa)*(1-Math.pow(1-p,4));
      angleRef.current=cur;
      if(draw(cur)&&now-lt>22){lt=now;playTick();}
      if(p<1){animRef.current=requestAnimationFrame(frame);}
      else{
        const l=langRef.current,idx=winnerIdx(ea),fs=friendsRef.current,name=fs[idx];
        const prev=payRef.current[name]||0,cnt=prev+1,repeat=lastWRef.current===name;
        setPayCount(pc=>({...pc,[name]:cnt}));setLastWin(name);
        setSpinning(false);playFanfare();boom(BEER_FX);
        setWinner({name,msg:pickMsg(cnt,repeat,l),count:cnt,isRepeat:repeat,...SEGS[idx%SEGS.length]});
      }
    };
    animRef.current=requestAnimationFrame(frame);
  };

  // ── 100x test: prove the distribution is uniform ──
  const runTest=(n=100)=>{
    const fs=friendsRef.current;
    if(fs.length<2){setFErr(T[langRef.current].eMin);return;}
    const counts={};
    fs.forEach(f=>{counts[f]=0;});
    let curAngle=angleRef.current;
    for(let i=0;i<n;i++){
      const extra=Math.PI*2*(7+cryptoRandom()*6);
      curAngle+=extra;
      const idx=winnerIdx(curAngle);
      counts[fs[idx]]++;
    }
    setTestResults({counts,total:n,expected:n/fs.length});
  };

  const shareWinner=async()=>{
    if(!winner)return;
    const text=T[lang].shareMsg(winner.name);
    try{if(navigator.share)await navigator.share({text,url:"https://rodada.pt"});
      else window.open(`https://wa.me/?text=${encodeURIComponent(text+"\nhttps://rodada.pt")}`,"_blank");}catch(e){}
  };
  const addFriend=()=>{
    const nm=fInput.trim();if(!nm)return;
    if(friends.length>=20){setFErr(t.eMax);return;}
    if(friends.some(f=>f.toLowerCase()===nm.toLowerCase())){setFErr(t.eDup);return;}
    setFErr("");setFriends(p=>[...p,nm]);setFInput("");
  };
  const rmFriend=(i)=>{if(!spinning)setFriends(p=>p.filter((_,j)=>j!==i));};
  const copyLink=()=>{
    try{const u=new URL(window.location.href);u.searchParams.set("friends",friends.join(","));u.searchParams.set("lang",lang);navigator.clipboard.writeText(u.toString());}catch(e){}
    setShared(true);setTimeout(()=>setShared(false),2500);
  };
  const shameBoard=Object.entries(payCount).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);

  /* ── groups ── */
  const computeGroups=()=>{
    const s=shuffle(players); // Fisher-Yates — provably uniform
    const base=Math.floor(s.length/numGrps),extra=s.length%numGrps;
    const names=THEMES[theme].names[lang];
    const grps=[];let idx=0;
    for(let g=0;g<numGrps;g++){
      const size=base+(g<extra?1:0);
      grps.push({name:names[g]||`${lang==="pt"?"Grupo":"Group"} ${g+1}`,players:s.slice(idx,idx+size),color:GC[g],icon:GI[g]});
      idx+=size;
    }
    return{groups:grps,subs:s.slice(idx)};
  };
  const sortGroups=()=>{
    if(phase==="sorting")return;
    if(players.length<4){setPErr(t.eGMin);return;}
    setPErr("");setResult(null);setPhase("sorting");playShuffle();
    setTimeout(()=>{const r=computeGroups();setResult(r);setPhase("done");playReveal(THEMES[theme].sound);boom(th.fx,1.3);},1500);
  };
  const reshuffle=()=>{
    if(players.length<4)return;
    playBuzz();setReshuffles(r=>r+1);setPhase("sorting");setResult(null);playShuffle();
    setTimeout(()=>{setResult(computeGroups());setPhase("done");playReveal(THEMES[theme].sound);},1100);
  };
  const addPlayer=()=>{
    const nm=pInput.trim();if(!nm)return;
    if(players.length>=30){setPErr(t.eGMax);return;}
    if(players.some(p=>p.toLowerCase()===nm.toLowerCase())){setPErr(t.eGDup);return;}
    setPErr("");setPlayers(p=>[...p,nm]);setPInput("");setResult(null);setPhase("idle");
  };
  const rmPlayer=(i)=>{setPlayers(p=>p.filter((_,j)=>j!==i));setResult(null);setPhase("idle");};
  const shareGroups=async()=>{
    if(!result)return;
    const lines=result.groups.map(g=>`${g.icon} ${g.name}: ${g.players.join(", ")}`).join("\n");
    const hdr=lang==="pt"?"Grupos sorteados":"Groups sorted";
    const text=`${th.icon} ${hdr}!\n\n${lines}${result.subs.length?`\n🪑 ${t.subsLabel}: ${result.subs.join(", ")}`:""}`;
    try{if(navigator.share)await navigator.share({text,url:"https://rodada.pt"});
      else window.open(`https://wa.me/?text=${encodeURIComponent(text+"\n\nhttps://rodada.pt")}`,"_blank");}catch(e){}
  };

  const injMsg=reshuffles>0?th.inj[lang][Math.min(reshuffles-1,th.inj[lang].length-1)]:"";
  const perGrp=Math.floor(players.length/numGrps);

  /* ────────────────────────  STYLES — AESTHETIC OVERHAUL  ──────────────────────── */
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{background:#040407;overflow-x:hidden}

    /* ── ATMOSPHERIC BACKGROUND LAYERS ── */
    .bg-base{position:fixed;inset:0;background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,229,0,0.08), transparent 60%),
      radial-gradient(ellipse 60% 40% at 20% 100%, rgba(255,34,0,0.05), transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 70%, rgba(123,47,255,0.06), transparent 60%),
      #040407;z-index:-3;pointer-events:none}
    .bg-grid{position:fixed;inset:0;background-image:
      linear-gradient(rgba(255,229,0,0.04) 1px,transparent 1px),
      linear-gradient(90deg, rgba(255,229,0,0.04) 1px,transparent 1px);
      background-size:40px 40px;z-index:-2;pointer-events:none;
      mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black,transparent 80%);
      -webkit-mask-image:radial-gradient(ellipse 70% 50% at 50% 30%,black,transparent 80%)}
    .bg-orb{position:fixed;width:500px;height:500px;border-radius:50%;filter:blur(120px);opacity:0.2;z-index:-1;pointer-events:none}
    .bg-orb-1{background:#FFE500;top:-200px;left:-100px;animation:fl1 18s ease-in-out infinite}
    .bg-orb-2{background:#FF2200;bottom:-200px;right:-100px;animation:fl2 22s ease-in-out infinite}
    .bg-orb-3{background:#7B2FFF;top:40%;left:50%;width:380px;height:380px;animation:fl3 26s ease-in-out infinite}
    @keyframes fl1{0%,100%{transform:translate(0,0)}50%{transform:translate(80px,60px)}}
    @keyframes fl2{0%,100%{transform:translate(0,0)}50%{transform:translate(-70px,-50px)}}
    @keyframes fl3{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-30%,-60%) scale(1.15)}}

    .R{min-height:100vh;font-family:'IBM Plex Mono',monospace;color:#fff;position:relative}

    /* ── TOP STRIPE — refined ── */
    .stripe{height:5px;background:repeating-linear-gradient(90deg,#FFE500 0 26px,#FF2200 26px 52px,#040407 52px 78px);
      box-shadow:0 0 22px rgba(255,229,0,0.35), inset 0 -1px 0 rgba(0,0,0,0.3)}

    /* ── HEADER ── */
    .hdr{display:flex;justify-content:space-between;align-items:center;padding:22px 24px;
      background:linear-gradient(180deg,rgba(255,229,0,0.04),transparent);
      border-bottom:2px solid rgba(255,229,0,0.25);
      position:relative}
    .hdr::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;
      background:linear-gradient(90deg,transparent,#FFE500 50%,transparent);opacity:0.6}
    .logo-wrap{display:flex;flex-direction:column;gap:5px}
    .logo{font-family:Anton,sans-serif;font-size:clamp(1.7rem,5vw,2.4rem);
      color:#FFE500;letter-spacing:0.04em;line-height:1;
      text-shadow:0 0 18px rgba(255,229,0,0.55), 0 0 36px rgba(255,229,0,0.25);
      display:flex;align-items:baseline;gap:8px}
    .logo-dot{display:inline-block;width:9px;height:9px;background:#FF2200;border-radius:50%;
      box-shadow:0 0 12px #FF2200;animation:pls 1.6s ease-in-out infinite;transform:translateY(-2px)}
    @keyframes pls{0%,100%{opacity:1;transform:translateY(-2px) scale(1)}50%{opacity:0.55;transform:translateY(-2px) scale(0.85)}}
    .lsub{font-size:0.65rem;color:#9a8b3a;letter-spacing:0.22em;text-transform:uppercase;font-weight:500}
    .btn-lang{font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:0.78rem;
      padding:9px 14px;background:rgba(255,229,0,0.05);border:2px solid #FFE500;color:#FFE500;
      cursor:pointer;letter-spacing:0.1em;
      box-shadow:3px 3px 0 rgba(255,229,0,0.7), inset 0 0 20px rgba(255,229,0,0.08);
      transition:all 0.18s;backdrop-filter:blur(8px)}
    .btn-lang:hover{background:#FFE500;color:#000;box-shadow:5px 5px 0 rgba(255,229,0,0.9), 0 0 24px rgba(255,229,0,0.6)}

    /* ── TABS ── */
    .tabs{display:flex;border-bottom:2px solid rgba(255,229,0,0.15);width:100%;
      background:linear-gradient(180deg,rgba(0,0,0,0.3),transparent)}
    .tab-btn{flex:1;padding:18px 0;font-family:Anton,sans-serif;font-size:1.05rem;
      letter-spacing:0.12em;background:transparent;border:none;cursor:pointer;color:#555;
      border-bottom:3px solid transparent;margin-bottom:-2px;
      transition:all 0.2s;position:relative}
    .tab-btn::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 100% at 50% 100%,rgba(255,229,0,0.12),transparent);opacity:0;transition:opacity 0.25s}
    .tab-btn.active{color:#FFE500;border-bottom-color:#FFE500;text-shadow:0 0 14px rgba(255,229,0,0.5)}
    .tab-btn.active::before{opacity:1}
    .tab-btn:hover:not(.active){color:#aaa}

    /* ── MAIN ── */
    .main{display:flex;flex-direction:column;align-items:center;padding:30px 18px 50px;gap:24px;position:relative}

    /* ── CANVAS wrapper with ambient ring ── */
    .canvas-wrap{position:relative;display:flex;align-items:center;justify-content:center}
    .canvas-wrap::before{content:"";position:absolute;inset:-20px;background:
      radial-gradient(circle, rgba(255,229,0,0.12) 0%, transparent 60%);
      filter:blur(20px);pointer-events:none;z-index:-1;
      animation:bre 4s ease-in-out infinite}
    @keyframes bre{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}

    /* ── PRIMARY BUTTON (spin) ── */
    .btn-spin{width:100%;max-width:${SZ}px;padding:20px 0;font-family:Anton,sans-serif;
      font-size:1.55rem;letter-spacing:0.09em;color:#000;
      background:linear-gradient(180deg,#FFF459,#FFE500 50%,#E6CE00);
      border:3px solid #000;cursor:pointer;
      box-shadow:8px 8px 0 #FF2200, 0 0 30px rgba(255,229,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
      transition:transform 0.08s,box-shadow 0.08s;position:relative;overflow:hidden}
    .btn-spin::before{content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);
      animation:shi 3s ease-in-out infinite}
    @keyframes shi{0%{left:-100%}50%{left:200%}100%{left:200%}}
    .btn-spin:hover:not(:disabled){transform:translate(-2px,-2px);
      box-shadow:10px 10px 0 #FF2200, 0 0 40px rgba(255,229,0,0.5)}
    .btn-spin:active:not(:disabled){transform:translate(4px,4px);
      box-shadow:4px 4px 0 #FF2200, 0 0 20px rgba(255,229,0,0.3)}
    .btn-spin:disabled{background:linear-gradient(180deg,#2a2a2a,#1a1a1a);color:#666;cursor:not-allowed;
      box-shadow:4px 4px 0 #2a2a2a;transform:translate(4px,4px)}
    .btn-spin:disabled::before{display:none}
    .btn-spin .ic{margin-right:8px;display:inline-block;animation:bo 0.6s ease-in-out infinite alternate}
    @keyframes bo{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}

    /* ── INPUT ROW ── */
    .ctrl{width:100%;max-width:${SZ}px}
    .irow{display:flex;gap:9px;margin-bottom:13px}
    .inp{flex:1;height:50px;background:rgba(10,10,10,0.8);border:2px solid rgba(255,229,0,0.7);
      color:#fff;font-family:'IBM Plex Mono',monospace;font-size:0.92rem;padding:0 15px;outline:none;
      backdrop-filter:blur(10px);
      box-shadow:inset 0 0 20px rgba(255,229,0,0.04), 3px 3px 0 rgba(255,229,0,0.25);
      transition:all 0.15s}
    .inp:focus{border-color:#FFE500;box-shadow:inset 0 0 24px rgba(255,229,0,0.1), 3px 3px 0 rgba(255,229,0,0.5), 0 0 18px rgba(255,229,0,0.25)}
    .inp::placeholder{color:#555}
    .btn-add{height:50px;padding:0 18px;font-family:Anton,sans-serif;font-size:0.95rem;letter-spacing:0.06em;
      background:linear-gradient(180deg,#FFF459,#FFE500);color:#000;border:2px solid #000;cursor:pointer;
      box-shadow:3px 3px 0 #FF2200;transition:all 0.08s;white-space:nowrap}
    .btn-add:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #FF2200, 0 0 16px rgba(255,229,0,0.4)}
    .btn-add:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #FF2200}

    /* ── ERROR ── */
    .err{background:linear-gradient(180deg,#FF4500,#FF2200);color:#fff;padding:9px 13px;margin-bottom:12px;
      font-size:0.8rem;font-weight:700;border:2px solid #000;letter-spacing:0.04em;
      box-shadow:3px 3px 0 rgba(255,34,0,0.5);animation:sh 0.4s ease}
    @keyframes sh{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

    /* ── TAGS (friends/players) ── */
    .tags{display:flex;flex-wrap:wrap;gap:9px}
    .tag{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:2px solid #000;
      font-family:Anton,sans-serif;font-size:0.82rem;letter-spacing:0.05em;
      box-shadow:2px 2px 0 rgba(0,0,0,0.6);
      transition:transform 0.12s, box-shadow 0.12s;cursor:default;position:relative}
    .tag:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 rgba(0,0,0,0.5)}
    .tag-c{font-size:0.66rem;opacity:0.7;margin-left:2px;font-family:'IBM Plex Mono',monospace;font-weight:700}
    .rm{background:none;border:none;cursor:pointer;color:inherit;font-size:1.15rem;line-height:1;
      opacity:0.55;padding:0 2px;transition:opacity 0.12s;font-weight:bold}
    .rm:hover{opacity:1}

    /* ── SHAME BOARD ── */
    .shame{width:100%;max-width:${SZ}px;
      background:linear-gradient(180deg,rgba(255,215,0,0.07),rgba(255,215,0,0.02));
      border:2px solid #FFD700;padding:18px 18px 14px;
      box-shadow:5px 5px 0 #FFD700, 0 0 30px rgba(255,215,0,0.18);
      backdrop-filter:blur(6px);position:relative;overflow:hidden}
    .shame::before{content:"";position:absolute;top:-2px;left:-2px;right:-2px;height:4px;
      background:repeating-linear-gradient(90deg,#FFD700 0 8px, transparent 8px 16px)}
    .shame-h{font-family:Anton,sans-serif;font-size:0.85rem;color:#FFD700;letter-spacing:0.2em;
      margin-bottom:12px;text-shadow:0 0 10px rgba(255,215,0,0.55);display:flex;align-items:center;gap:6px}
    .shame-r{display:flex;justify-content:space-between;align-items:center;padding:7px 0;
      border-bottom:1px solid rgba(255,215,0,0.18)}
    .shame-r:last-child{border-bottom:none}
    .shame-n{font-family:Anton,sans-serif;letter-spacing:0.06em;color:#fff;font-size:0.88rem;display:flex;align-items:center;gap:7px}
    .shame-v{color:#FFD700;font-family:Anton,sans-serif;font-size:1rem;
      text-shadow:0 0 8px rgba(255,215,0,0.5)}
    .shame-trf{font-size:1.05rem}

    /* ── SHARE BUTTON ── */
    .btn-ghost{background:rgba(255,255,255,0.02);border:2px solid #444;color:#888;
      font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:0.74rem;
      padding:11px 26px;cursor:pointer;letter-spacing:0.14em;
      transition:all 0.18s;backdrop-filter:blur(6px)}
    .btn-ghost:hover{border-color:#fff;color:#fff;background:rgba(255,255,255,0.05);
      box-shadow:0 0 18px rgba(255,255,255,0.12)}
    .btn-ghost.ok{border-color:#FFE500;color:#FFE500;
      box-shadow:0 0 22px rgba(255,229,0,0.4)}

    .action-row{display:flex;gap:10px;width:100%;max-width:${SZ}px;justify-content:center;flex-wrap:wrap}
    .btn-test{background:rgba(0,207,255,0.05);border:2px solid #00CFFF;color:#00CFFF;
      font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:0.74rem;
      padding:11px 22px;cursor:pointer;letter-spacing:0.12em;
      transition:all 0.18s;backdrop-filter:blur(6px);
      box-shadow:0 0 14px rgba(0,207,255,0.18)}
    .btn-test:hover{background:#00CFFF;color:#000;
      box-shadow:0 0 26px rgba(0,207,255,0.55);transform:translateY(-1px)}

    /* ── TEST RESULTS MODAL ── */
    .test-card{max-width:460px;width:100%;padding:32px 26px 26px;
      background:linear-gradient(180deg,#0a0a0a 0%,#000 100%);
      text-align:left;animation:pi 0.45s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden;
      border:4px solid #00CFFF;
      box-shadow:10px 10px 0 #00CFFF, 0 0 60px rgba(0,207,255,0.4);max-height:90vh;overflow-y:auto}
    .test-title{font-family:Anton,sans-serif;font-size:1.5rem;color:#00CFFF;letter-spacing:0.06em;
      margin-bottom:6px;text-shadow:0 0 16px rgba(0,207,255,0.6);text-align:center}
    .test-sub{font-family:'IBM Plex Mono',monospace;font-size:0.75rem;color:#888;text-align:center;
      margin-bottom:18px;letter-spacing:0.04em;line-height:1.5}
    .test-expected{color:#FFE500;font-weight:700;font-size:0.85rem}
    .test-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
    .test-row{display:grid;grid-template-columns:80px 1fr 64px;align-items:center;gap:10px;
      padding:4px 0}
    .test-name{font-family:Anton,sans-serif;font-size:0.85rem;letter-spacing:0.04em;color:#fff;
      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:5px}
    .test-dot{display:inline-block;width:9px;height:9px;border-radius:50%;flex-shrink:0;
      box-shadow:0 0 6px currentColor}
    .test-bar-bg{height:18px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden}
    .test-bar{height:100%;transition:width 0.5s cubic-bezier(0.34,1.2,0.64,1);position:relative}
    .test-bar::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,0.3),transparent 30%)}
    .test-expected-line{position:absolute;top:-2px;bottom:-2px;width:2px;background:#FFE500;
      box-shadow:0 0 6px #FFE500;z-index:2}
    .test-count{font-family:Anton,sans-serif;font-size:0.95rem;color:#fff;text-align:right;letter-spacing:0.03em}
    .test-pct{font-family:'IBM Plex Mono',monospace;font-size:0.66rem;color:#888;display:block;line-height:1}
    .test-fair{font-family:'IBM Plex Mono',monospace;font-size:0.72rem;color:#00FF9F;
      text-align:center;letter-spacing:0.04em;line-height:1.5;margin-bottom:18px;
      padding:10px;background:rgba(0,255,159,0.05);border:1px solid rgba(0,255,159,0.25)}
    .test-legend{display:flex;align-items:center;justify-content:center;gap:6px;
      font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#666;margin-bottom:14px;letter-spacing:0.04em}
    .test-legend-mark{display:inline-block;width:2px;height:11px;background:#FFE500;box-shadow:0 0 4px #FFE500}

    .tag-line{font-size:0.62rem;color:#5a5a5a;letter-spacing:0.16em;text-align:center;font-weight:500}

    /* ── GROUPS TAB ── */
    .p-tag{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;
      border:2px solid rgba(255,255,255,0.18);font-family:Anton,sans-serif;font-size:0.82rem;
      letter-spacing:0.05em;color:#fff;
      background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));
      backdrop-filter:blur(6px);
      box-shadow:2px 2px 0 rgba(255,255,255,0.06);
      transition:all 0.12s}
    .p-tag:hover{border-color:rgba(255,255,255,0.4);transform:translate(-1px,-1px)}
    .p-num{font-size:0.7rem;color:#666;margin-right:2px;font-family:'IBM Plex Mono',monospace;font-weight:700}
    .sec-label{font-family:Anton,sans-serif;font-size:0.78rem;color:#FFE500;letter-spacing:0.2em;
      margin-bottom:11px;text-shadow:0 0 10px rgba(255,229,0,0.4)}

    .theme-scroll{display:flex;flex-wrap:wrap;gap:9px;width:100%;max-width:${SZ}px}
    .theme-pill{flex-shrink:0;padding:9px 15px;font-family:Anton,sans-serif;font-size:0.86rem;
      letter-spacing:0.06em;background:rgba(255,255,255,0.02);border:2px solid rgba(255,255,255,0.12);
      color:#888;cursor:pointer;white-space:nowrap;transition:all 0.18s;backdrop-filter:blur(6px)}
    .theme-pill.active{background:linear-gradient(180deg,#FFF459,#FFE500);color:#000;border-color:#000;
      box-shadow:3px 3px 0 #FF2200, 0 0 22px rgba(255,229,0,0.45);transform:translateY(-1px)}
    .theme-pill:hover:not(.active){border-color:rgba(255,255,255,0.35);color:#ddd;transform:translateY(-1px)}

    .ngrp-row{display:flex;gap:8px;width:100%;max-width:${SZ}px}
    .btn-ng{flex:1;padding:13px 0;font-family:Anton,sans-serif;font-size:1.1rem;letter-spacing:0.08em;
      background:rgba(255,255,255,0.02);border:2px solid rgba(255,255,255,0.12);color:#666;cursor:pointer;
      transition:all 0.15s;backdrop-filter:blur(6px)}
    .btn-ng.active{background:linear-gradient(180deg,#FFF459,#FFE500);color:#000;border-color:#000;
      box-shadow:3px 3px 0 #FF2200, 0 0 18px rgba(255,229,0,0.4)}
    .btn-ng:hover:not(.active):not(:disabled){border-color:rgba(255,255,255,0.4);color:#ccc}
    .btn-ng:disabled{opacity:0.2;cursor:not-allowed}
    .grp-hint{font-size:0.66rem;color:#666;font-family:'IBM Plex Mono',monospace;
      width:100%;max-width:${SZ}px;margin-top:9px;letter-spacing:0.04em}

    /* ── SORT BUTTON (cyan) ── */
    .btn-sort{width:100%;max-width:${SZ}px;padding:20px 0;font-family:Anton,sans-serif;font-size:1.4rem;
      letter-spacing:0.08em;color:#000;
      background:linear-gradient(180deg,#7FE4FF,#00CFFF 50%,#00A8D6);
      border:3px solid #000;cursor:pointer;
      box-shadow:8px 8px 0 #0080AA, 0 0 30px rgba(0,207,255,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
      transition:all 0.08s;position:relative;overflow:hidden}
    .btn-sort::before{content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);
      animation:shi 3s ease-in-out infinite 1.5s}
    .btn-sort:hover:not(:disabled){transform:translate(-2px,-2px);
      box-shadow:10px 10px 0 #0080AA, 0 0 40px rgba(0,207,255,0.5)}
    .btn-sort:active:not(:disabled){transform:translate(4px,4px);
      box-shadow:4px 4px 0 #0080AA}
    .btn-sort:disabled{background:linear-gradient(180deg,#2a2a2a,#1a1a1a);color:#666;cursor:not-allowed;
      box-shadow:4px 4px 0 #2a2a2a;transform:translate(4px,4px)}

    .sort-pool{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;max-width:${SZ}px;padding:18px 6px}
    .sort-tag{display:inline-block;padding:7px 13px;border:2px solid #00CFFF;color:#00CFFF;
      font-family:Anton,sans-serif;font-size:0.86rem;letter-spacing:0.05em;
      box-shadow:0 0 18px rgba(0,207,255,0.4);
      animation:shk 0.35s ease infinite alternate}
    @keyframes shk{0%{transform:translateX(-10px) rotate(-5deg)}100%{transform:translateX(10px) rotate(5deg)}}

    /* ── RESULT (groups) ── */
    .result-wrap{width:100%;max-width:560px;animation:tIn 0.45s cubic-bezier(0.34,1.2,0.64,1)}
    @keyframes tIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}
    .groups-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:14px}
    .gc{padding:16px;border-width:3px;border-style:solid;
      background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.5));
      backdrop-filter:blur(8px);position:relative;overflow:hidden}
    .gc::before{content:"";position:absolute;top:0;left:0;right:0;height:3px}
    .gc-title{font-family:Anton,sans-serif;font-size:1.08rem;letter-spacing:0.1em;margin-bottom:11px;
      display:flex;align-items:center;gap:6px}
    .pr{display:flex;align-items:center;gap:6px;padding:6px 0;
      border-bottom:1px solid rgba(255,255,255,0.06);font-family:Anton,sans-serif;font-size:0.86rem;
      letter-spacing:0.04em;animation:dI 0.3s ease both}
    .pr:last-child{border-bottom:none}
    .cap-ico{font-size:0.9rem}
    @keyframes dI{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
    .subs-bar{font-family:'IBM Plex Mono',monospace;font-size:0.72rem;color:#666;padding:12px 0 6px;
      text-align:center;border-top:2px dashed rgba(255,255,255,0.1);margin-top:4px}
    .subs-names{color:#888;margin-top:4px;font-family:Anton,sans-serif;font-size:0.82rem;letter-spacing:0.05em}

    /* ── INJUSTO ── */
    .inj-msg{font-family:'IBM Plex Mono',monospace;font-size:0.78rem;color:#FF6B00;text-align:center;
      letter-spacing:0.04em;min-height:1.3em;margin-bottom:8px;
      text-shadow:0 0 8px rgba(255,107,0,0.4)}
    .btn-inj{width:100%;padding:15px 0;font-family:Anton,sans-serif;font-size:1.05rem;letter-spacing:0.06em;
      background:rgba(255,107,0,0.05);border:2px solid #FF6B00;color:#FF6B00;cursor:pointer;
      box-shadow:5px 5px 0 #FF6B00, 0 0 22px rgba(255,107,0,0.2);
      transition:all 0.1s;backdrop-filter:blur(6px)}
    .btn-inj:hover{transform:translate(-2px,-2px);background:#FF6B00;color:#000;
      box-shadow:7px 7px 0 #FF6B00, 0 0 30px rgba(255,107,0,0.6)}
    .btn-inj:active{transform:translate(3px,3px);box-shadow:2px 2px 0 #FF6B00}

    .btn-sh-g{width:100%;padding:14px 0;font-family:'IBM Plex Mono',monospace;font-weight:700;
      font-size:0.84rem;letter-spacing:0.1em;background:rgba(255,255,255,0.02);
      border:2px solid #fff;color:#fff;cursor:pointer;transition:all 0.15s;backdrop-filter:blur(6px)}
    .btn-sh-g:hover{background:#fff;color:#000;box-shadow:0 0 24px rgba(255,255,255,0.4)}
    .r-actions{display:flex;flex-direction:column;gap:11px;margin-top:8px}

    /* ── WINNER MODAL ── */
    .ov{position:fixed;inset:0;background:rgba(0,0,0,0.82);
      backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
      display:flex;align-items:center;justify-content:center;z-index:99;padding:20px;
      animation:fi 0.3s ease;color:#fff}
    @keyframes fi{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(14px)}}
    .wcard{max-width:420px;width:100%;padding:40px 28px 32px;
      background:linear-gradient(180deg,#0a0a0a 0%,#000 100%);
      text-align:center;animation:pi 0.45s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden}
    .wcard::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(255,255,255,0.04),transparent);pointer-events:none}
    @keyframes pi{from{transform:scale(0.6) translateY(28px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
    .wlabel{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;color:#999;letter-spacing:0.3em;
      margin-bottom:14px;text-transform:uppercase;font-weight:700}
    .wname{font-family:Anton,sans-serif;font-size:clamp(2.8rem,11vw,4.4rem);line-height:1;
      margin-bottom:14px;word-break:break-word;
      animation:ns 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
      letter-spacing:0.02em}
    @keyframes ns{from{transform:scale(0.4);opacity:0;filter:blur(8px)}to{transform:scale(1);opacity:1;filter:blur(0)}}
    .wmsg{font-size:1.35rem;margin-bottom:12px;color:#fff;line-height:1.4;font-weight:500}
    .wcnt{font-family:'IBM Plex Mono',monospace;font-size:0.74rem;color:#888;margin-bottom:26px;
      letter-spacing:0.08em;padding:5px 12px;background:rgba(255,255,255,0.04);display:inline-block;
      border:1px solid rgba(255,255,255,0.1)}
    .wbtns{display:flex;flex-direction:column;gap:11px;position:relative;z-index:2}
    .btn-again{font-family:Anton,sans-serif;font-size:1.25rem;letter-spacing:0.07em;padding:15px 0;
      border:3px solid #000;cursor:pointer;
      box-shadow:6px 6px 0 #000, inset 0 1px 0 rgba(255,255,255,0.3);
      transition:all 0.08s;width:100%;font-weight:bold}
    .btn-again:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 #000}
    .btn-again:active{transform:translate(3px,3px);box-shadow:3px 3px 0 #000}
    .btn-ws{width:100%;padding:13px 0;font-family:'IBM Plex Mono',monospace;font-weight:700;
      font-size:0.84rem;letter-spacing:0.1em;background:rgba(255,255,255,0.02);
      border:2px solid #fff;color:#fff;cursor:pointer;transition:all 0.15s;backdrop-filter:blur(6px)}
    .btn-ws:hover{background:#fff;color:#000;box-shadow:0 0 24px rgba(255,255,255,0.4)}

    /* ── CONFETTI ── */
    .sp{position:fixed;top:-55px;animation:dr linear forwards;z-index:200;pointer-events:none;user-select:none;
      filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4))}
    @keyframes dr{0%{transform:translateY(0) rotate(0deg);opacity:1}80%{opacity:1}100%{transform:translateY(115vh) rotate(900deg);opacity:0}}

    /* ── FOOTER ── */
    .ftr{text-align:center;padding:24px 18px 28px;font-size:0.7rem;color:#3a3a3a;
      letter-spacing:0.14em;font-family:'IBM Plex Mono',monospace;font-weight:500;
      border-top:1px solid rgba(255,229,0,0.08)}

    /* ── responsive ── */
    @media (max-width:380px){
      .hdr{padding:18px 16px}
      .main{padding:24px 14px 40px}
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* atmospheric background */}
      <div className="bg-base"/>
      <div className="bg-grid"/>
      <div className="bg-orb bg-orb-1"/>
      <div className="bg-orb bg-orb-2"/>
      <div className="bg-orb bg-orb-3"/>

      {sparks.map(p=>(
        <div key={p.id} className="sp" style={{left:`${p.x}%`,fontSize:`${p.sz}rem`,animationDuration:`${p.dur}s`,animationDelay:`${p.d}s`}}>
          {p.e}
        </div>
      ))}

      <div className="R">
        <div className="stripe"/>

        <header className="hdr">
          <div className="logo-wrap">
            <div className="logo">🍺 RODADA<span className="logo-dot"/></div>
            <div className="lsub">{tab==="rodada"?t.sub:t.groupSub}</div>
          </div>
          <button className="btn-lang" onClick={()=>setLang(l=>l==="pt"?"en":"pt")} aria-label="Language">
            {t.toggle}
          </button>
        </header>

        <div className="tabs">
          <button className={`tab-btn${tab==="rodada"?" active":""}`} onClick={()=>setTab("rodada")}>🍺 {t.tabWheel}</button>
          <button className={`tab-btn${tab==="grupos"?" active":""}`} onClick={()=>setTab("grupos")}>👥 {t.tabGroups}</button>
        </div>

        {/* ═══ RODADA ═══ */}
        {tab==="rodada"&&(
          <main className="main">
            <div className="canvas-wrap">
              <canvas ref={canvasRef} style={{width:SZ,height:SZ,maxWidth:"100%",display:"block"}}/>
            </div>

            <button className="btn-spin" onClick={spin} disabled={spinning} aria-label="Spin the wheel">
              {spinning?t.spinning:(<><span className="ic">🍺</span>{t.spin}</>)}
            </button>

            <div className="ctrl">
              <div className="irow">
                <input className="inp" value={fInput} onChange={e=>setFInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addFriend()} placeholder={t.ph} maxLength={18}
                  aria-label="Friend name"/>
                <button className="btn-add" onClick={addFriend}>{t.add}</button>
              </div>
              {fErr&&<div className="err">⚠ {fErr}</div>}
              <div className="tags">
                {friends.map((f,i)=>{
                  const cnt=payCount[f]||0,crown=cnt>=3?"👑":cnt===2?"🏆":cnt===1?"💸":"";
                  const c=SEGS[i%SEGS.length];
                  return(
                    <div key={i} className="tag" style={{
                      background:`linear-gradient(180deg, ${lighten(c.bg,0.1)}, ${c.bg})`,
                      color:c.fg,
                      boxShadow:`2px 2px 0 rgba(0,0,0,0.6), 0 0 14px ${c.bg}40`,
                    }}>
                      {crown&&<span>{crown}</span>}{f.toUpperCase()}
                      {cnt>0&&<span className="tag-c">×{cnt}</span>}
                      <button className="rm" onClick={()=>rmFriend(i)} aria-label="Remove">×</button>
                    </div>
                  );
                })}
              </div>
            </div>

            {shameBoard.length>0&&(
              <div className="shame">
                <div className="shame-h">🏆 {t.shame}</div>
                {shameBoard.map(([name,count],i)=>(
                  <div key={name} className="shame-r">
                    <span className="shame-n">
                      <span className="shame-trf">{i===0?"👑":i===1?"🥈":"🥉"}</span>
                      {name.toUpperCase()}
                    </span>
                    <span className="shame-v">{count}×</span>
                  </div>
                ))}
              </div>
            )}

            <div className="action-row">
              <button className={`btn-ghost${shared?" ok":""}`} onClick={copyLink}>
                {shared?t.copied:t.share}
              </button>
              <button className="btn-test" onClick={()=>runTest(100)} aria-label="Test 100 spins">
                {t.testBtn}
              </button>
            </div>
            <div className="tag-line">{t.tag}</div>
          </main>
        )}

        {/* ═══ GRUPOS ═══ */}
        {tab==="grupos"&&(
          <main className="main">
            <div className="ctrl">
              <div className="sec-label">{t.themeLabel}</div>
              <div className="theme-scroll">
                {Object.entries(THEMES).map(([key,data])=>(
                  <button key={key} className={`theme-pill${theme===key?" active":""}`}
                    onClick={()=>{setTheme(key);setResult(null);setPhase("idle");setReshuffles(0);}}>
                    {data.icon} {THEME_LABELS[key][lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl">
              <div className="irow">
                <input className="inp" value={pInput} onChange={e=>setPInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addPlayer()} placeholder={t.playerPh} maxLength={20}/>
                <button className="btn-add" onClick={addPlayer}>{t.playerAdd}</button>
              </div>
              {pErr&&<div className="err">⚠ {pErr}</div>}
              <div className="tags">
                {players.map((p,i)=>(
                  <div key={i} className="p-tag">
                    <span className="p-num">{i+1}</span>{p.toUpperCase()}
                    <button className="rm" onClick={()=>rmPlayer(i)} style={{color:"#888"}}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{width:"100%",maxWidth:SZ}}>
              <div className="sec-label">{t.numLabel}</div>
              <div className="ngrp-row">
                {NUM_OPTS.map(n=>{
                  const ok=players.length>=n*2;
                  return(
                    <button key={n} className={`btn-ng${numGrps===n?" active":""}`} disabled={!ok}
                      onClick={()=>{if(ok){setNumGrps(n);setResult(null);setPhase("idle");}}}>
                      {n}
                    </button>
                  );
                })}
              </div>
              <div className="grp-hint">
                {t.pCount(players.length)} · {t.gInfo(numGrps,perGrp)}
                {players.length%numGrps>0?` (+${players.length%numGrps})`:""}
              </div>
            </div>

            <button className="btn-sort" onClick={sortGroups} disabled={phase==="sorting"||players.length<4}>
              {phase==="sorting"?t.sorting:t.sortBtn(th.icon)}
            </button>

            {phase==="sorting"&&(
              <div className="sort-pool">
                {players.map((p,i)=>(
                  <div key={i} className="sort-tag" style={{animationDelay:`${i*0.05}s`,animationDuration:`${0.25+i%3*0.07}s`}}>
                    {p.toUpperCase()}
                  </div>
                ))}
              </div>
            )}

            {phase==="done"&&result&&(
              <div className="result-wrap">
                <div className="groups-grid">
                  {result.groups.map((g,gi)=>(
                    <div key={gi} className="gc" style={{
                      borderColor:g.color,
                      boxShadow:`5px 5px 0 ${g.color}, 0 0 26px ${g.color}30`,
                    }}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:g.color}}/>
                      <div className="gc-title" style={{color:g.color,textShadow:`0 0 12px ${g.color}80`}}>{g.icon} {g.name}</div>
                      {g.players.map((p,pi)=>(
                        <div key={pi} className="pr" style={{color:pi===0?g.color:"#fff",animationDelay:`${(gi*g.players.length+pi)*0.06}s`}}>
                          {pi===0&&<span className="cap-ico">⭐</span>}
                          {p.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {result.subs&&result.subs.length>0&&(
                  <div className="subs-bar">
                    🪑 {t.subsLabel}
                    <div className="subs-names">{result.subs.map(p=>p.toUpperCase()).join(" · ")}</div>
                  </div>
                )}
                <div className="r-actions">
                  {injMsg&&<div className="inj-msg">{injMsg}</div>}
                  <button className="btn-inj" onClick={reshuffle}>{t.injusto}</button>
                  <button className="btn-sh-g" onClick={shareGroups}>{t.shareGroups}</button>
                </div>
              </div>
            )}

            <div className="tag-line">{t.tagGroups}</div>
          </main>
        )}

        <div className="stripe"/>
        <div className="ftr">{t.footer}  ·  RODADA.PT</div>
      </div>

      {winner&&(
        <div className="ov" onClick={()=>setWinner(null)}>
          <div className="wcard" style={{
            border:`6px solid ${winner.bg}`,
            boxShadow:`14px 14px 0 ${winner.bg}, 0 0 80px ${winner.bg}50`,
          }} onClick={e=>e.stopPropagation()}>
            <div className="wlabel">{t.pays}</div>
            <div className="wname" style={{color:winner.bg,textShadow:`0 0 30px ${winner.bg}, 0 0 60px ${winner.bg}80`}}>
              {winner.name.toUpperCase()}
            </div>
            <div className="wmsg">{winner.msg}</div>
            {winner.count>1&&<div className="wcnt">{lang==="pt"?`${winner.count}ª vez hoje`:`${winner.count}x tonight`} {winner.count>=3?"👑":"💸"}</div>}
            <div className="wbtns">
              <button className="btn-again" style={{
                background:`linear-gradient(180deg,${lighten(winner.bg,0.15)},${winner.bg})`,
                color:winner.fg,
              }} onClick={()=>setWinner(null)}>{t.again}</button>
              <button className="btn-ws" onClick={shareWinner}>{t.shareResult}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 100x TEST RESULTS MODAL ── */}
      {testResults&&(
        <div className="ov" onClick={()=>setTestResults(null)}>
          <div className="test-card" onClick={e=>e.stopPropagation()}>
            <div className="test-title">🎯 {t.testTitle}</div>
            <div className="test-sub">
              {t.testSub} <span className="test-expected">{testResults.expected.toFixed(1)}× {t.testTimes}</span>
            </div>
            <div className="test-legend">
              <span className="test-legend-mark"/> {lang==="pt"?"linha = valor esperado":"line = expected value"}
            </div>
            <div className="test-rows">
              {(() => {
                const maxCount = Math.max(...Object.values(testResults.counts), 1);
                const exp = testResults.expected;
                return Object.entries(testResults.counts).map(([name,count],i) => {
                  const c = SEGS[i % SEGS.length];
                  const pct = (count/testResults.total)*100;
                  const barWidthPct = (count/maxCount)*100;
                  const expectedLinePct = (exp/maxCount)*100;
                  return (
                    <div key={name} className="test-row">
                      <div className="test-name">
                        <span className="test-dot" style={{background:c.bg,color:c.bg}}/>
                        {name.length>7?name.slice(0,7)+"…":name}
                      </div>
                      <div className="test-bar-bg">
                        <div className="test-bar" style={{
                          width:`${barWidthPct}%`,
                          background:`linear-gradient(90deg, ${c.bg}, ${lighten(c.bg,0.15)})`
                        }}/>
                        <div className="test-expected-line" style={{left:`${expectedLinePct}%`}}/>
                      </div>
                      <div className="test-count">
                        {count}×
                        <span className="test-pct">{pct.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="test-fair">{t.testFair}</div>
            <div className="wbtns">
              <button className="btn-again" style={{background:"#00CFFF",color:"#000"}} onClick={()=>setTestResults(null)}>
                {t.testClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
