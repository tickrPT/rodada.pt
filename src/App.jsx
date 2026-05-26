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
    share:"↗ PARTILHAR", shareResult:"📲 PARTILHAR RESULTADO", shareImage:"📸 GUARDAR IMAGEM", copied:"✓ COPIADO!",
    eMin:"Junta pelo menos 2 amigos!", eMax:"Máximo 20 amigos!", eDup:"Esse nome já está na roda!",
    tag:"GIRA · DECIDE · PAGA · REPETE", shame:"PATROCINADORES DA NOITE", toggle:"EN",
    testBtn:"🎯 TESTAR 100×",
    testTitle:"TESTE DE FAIRNESS",
    testSub:"Em sorteios aleatórios, é normal haver variação. O importante é estar dentro da zona verde — prova matemática de que é justo.",
    testTimes:"vezes",
    testExpected:"Valor esperado",
    testRange:"Range aceitável (95% confiança família-wise)",
    testFair:"✓ DISTRIBUIÇÃO JUSTA",
    testFairSub:(n)=>`Todos os amigos dentro do range esperado em ${n} sorteios`,
    testUnfair:"⚠ Anomalia detectada",
    testUnfairSub:"Volta a testar — pode ser variação rara (1 em 20).",
    testRepeat:"🔄 REPETIR TESTE",
    testBigger:"📊 TESTAR 1000×",
    testClose:"FECHAR",
    testRunning:"A SORTEAR...",
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
    // ── Card mode ──
    modeWheel:"🍺 Roleta",
    modeCards:"💳 Cartões",
    cardsTitle:"QUEM PAGA O JANTAR?",
    cardsCta:"💳 ELIMINAR CARTÕES",
    cardsEliminating:"A ELIMINAR...",
    cardsEliminated:"ELIMINADO",
    cardsReady:"Pronto para o sorteio dramático",
    cardsPays:"PAGA O JANTAR!",
    cardsCardholder:"CARTÃO RODADA",
    cardsExpires:"VALID THRU",
    cardsExpYear:"∞/∞",
    cardsRestart:"NOVO SORTEIO",
    cardsShareResult:(n)=>`💳 ${n} paga o jantar!\n\nSorteado em rodada.pt`,
  },
  en:{
    sub:"Who's buying the round?", ph:"Friend's name...", add:"ADD",
    spin:"SPIN THE WHEEL", spinning:"SPINNING...",
    pays:"BUYS THE ROUND!", again:"AGAIN",
    share:"↗ SHARE", shareResult:"📲 SHARE RESULT", shareImage:"📸 SAVE IMAGE", copied:"✓ COPIED!",
    eMin:"Add at least 2 friends!", eMax:"Maximum 20 friends!", eDup:"That name is already on the wheel!",
    tag:"SPIN · DECIDE · PAY · REPEAT", shame:"TONIGHT'S SPONSORS", toggle:"PT",
    testBtn:"🎯 TEST 100×",
    testTitle:"FAIRNESS TEST",
    testSub:"In random draws, variation is normal. What matters is staying inside the green zone — mathematical proof it's fair.",
    testTimes:"times",
    testExpected:"Expected value",
    testRange:"Acceptable range (95% family-wise confidence)",
    testFair:"✓ FAIR DISTRIBUTION",
    testFairSub:(n)=>`All friends within expected range over ${n} draws`,
    testUnfair:"⚠ Anomaly detected",
    testUnfairSub:"Try again — could be rare variation (1 in 20).",
    testRepeat:"🔄 REPEAT TEST",
    testBigger:"📊 TEST 1000×",
    testClose:"CLOSE",
    testRunning:"DRAWING...",
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
    // ── Card mode ──
    modeWheel:"🍺 Wheel",
    modeCards:"💳 Cards",
    cardsTitle:"WHO PAYS THE DINNER?",
    cardsCta:"💳 ELIMINATE CARDS",
    cardsEliminating:"ELIMINATING...",
    cardsEliminated:"ELIMINATED",
    cardsReady:"Ready for the dramatic draw",
    cardsPays:"PAYS THE DINNER!",
    cardsCardholder:"RODADA CARD",
    cardsExpires:"VALID THRU",
    cardsExpYear:"∞/∞",
    cardsRestart:"NEW DRAW",
    cardsShareResult:(n)=>`💳 ${n} is paying for dinner!\n\nDrawn at rodada.pt`,
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
  // ── Card mode state ──
  const [mode,setMode]                = useState("wheel"); // "wheel" | "cards"
  const [cardPhase,setCardPhase]      = useState("idle");  // "idle"|"eliminating"|"done"
  const [eliminated,setEliminated]    = useState([]);      // friend names eliminated, in order
  const [cardWinner,setCardWinner]    = useState(null);    // {name, color} or null
  // ── Card mode (Quem paga o jantar) ──
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

  // Reset card mode whenever friend list changes
  useEffect(()=>{
    setEliminated([]); setCardWinner(null); setCardPhase("idle");
  },[friends.length]);

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

  // ── CARD MODE AUDIO ──
  // Swoosh: frequency rises with each elimination (builds tension)
  const playSwoosh=useCallback((progress=0)=>{
    const c=getAC();if(!c)return;
    try{
      const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
      o.connect(f);f.connect(g);g.connect(c.destination);
      f.type="bandpass"; f.Q.value=2;
      const baseFreq=400+progress*600; // 400Hz early, 1000Hz late
      o.type="sawtooth"; o.frequency.setValueAtTime(baseFreq*2,c.currentTime);
      o.frequency.exponentialRampToValueAtTime(baseFreq,c.currentTime+0.18);
      f.frequency.setValueAtTime(baseFreq*3,c.currentTime);
      f.frequency.exponentialRampToValueAtTime(baseFreq,c.currentTime+0.18);
      g.gain.setValueAtTime(0,c.currentTime);
      g.gain.linearRampToValueAtTime(0.12,c.currentTime+0.03);
      g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.22);
      o.start();o.stop(c.currentTime+0.25);
    }catch(e){}
  },[getAC]);
  // Deep thunk when card is eliminated (drops into discard pile)
  const playThunk=useCallback(()=>{
    const c=getAC();if(!c)return;
    try{
      const o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.type="sine"; o.frequency.setValueAtTime(180,c.currentTime);
      o.frequency.exponentialRampToValueAtTime(60,c.currentTime+0.15);
      g.gain.setValueAtTime(0.18,c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.22);
      o.start();o.stop(c.currentTime+0.25);
    }catch(e){}
  },[getAC]);
  // Dramatic riser before winner reveal
  const playRiser=useCallback(()=>{
    const c=getAC();if(!c)return;
    try{
      const o=c.createOscillator(),g=c.createGain();
      o.connect(g);g.connect(c.destination);
      o.type="sawtooth"; o.frequency.setValueAtTime(120,c.currentTime);
      o.frequency.exponentialRampToValueAtTime(880,c.currentTime+1.2);
      g.gain.setValueAtTime(0,c.currentTime);
      g.gain.linearRampToValueAtTime(0.1,c.currentTime+0.3);
      g.gain.linearRampToValueAtTime(0.18,c.currentTime+1.0);
      g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+1.35);
      o.start();o.stop(c.currentTime+1.4);
    }catch(e){}
  },[getAC]);
  // Dramatic reveal — deep brass chord
  const playRevealChord=useCallback(()=>{
    const c=getAC();if(!c)return;
    try{
      [261.63, 329.63, 392.00, 523.25].forEach((f,i)=>{
        const o=c.createOscillator(),g=c.createGain();
        o.connect(g);g.connect(c.destination);
        o.type=i===0?"sawtooth":"sine";
        o.frequency.value=f;
        const t0=c.currentTime+i*0.04;
        g.gain.setValueAtTime(0,t0);
        g.gain.linearRampToValueAtTime(i===0?0.12:0.09,t0+0.08);
        g.gain.exponentialRampToValueAtTime(0.001,t0+1.2);
        o.start(t0);o.stop(t0+1.3);
      });
    }catch(e){}
  },[getAC]);


  // ── WHEEL CANVAS DRAWING ──
  // Renders the wheel with gradients, glow, segments, hub, pointer
  const draw=useCallback((angle)=>{
    const canvas=canvasRef.current;if(!canvas)return false;
    const c=canvas.getContext("2d");
    // HiDPI: render at device pixel ratio for crisp display on retina
    const dpr = window.devicePixelRatio || 1;
    if(canvas.width !== SZ*dpr){
      canvas.width = SZ*dpr; canvas.height = SZ*dpr;
      canvas.style.width = SZ+"px"; canvas.style.height = SZ+"px";
      c.scale(dpr, dpr);
    }
    const fs=friendsRef.current,n=fs.length;if(!n)return false;
    const cx=SZ/2,cy=SZ/2,arc=(2*Math.PI)/n;
    c.clearRect(0,0,SZ,SZ);

    // outer atmospheric glow
    const gg=c.createRadialGradient(cx,cy,R-10,cx,cy,R+30);
    gg.addColorStop(0,"rgba(255,229,0,0)");
    gg.addColorStop(0.6,"rgba(255,229,0,0.08)");
    gg.addColorStop(1,"rgba(255,229,0,0)");
    c.fillStyle=gg; c.fillRect(0,0,SZ,SZ);

    // outer yellow ring with shadow
    c.save();
    c.shadowColor="rgba(255,229,0,0.6)"; c.shadowBlur=18;
    c.beginPath(); c.arc(cx,cy,R+10,0,2*Math.PI);
    c.strokeStyle="#FFE500"; c.lineWidth=4; c.stroke();
    c.restore();
    c.beginPath(); c.arc(cx,cy,R+5,0,2*Math.PI);
    c.strokeStyle="#0a0a0a"; c.lineWidth=3; c.stroke();

    // segments with radial gradient for depth
    for(let i=0;i<n;i++){
      const sa=angle+i*arc, ea=sa+arc, {bg,fg}=SEGS[i%SEGS.length];
      c.beginPath(); c.moveTo(cx,cy); c.arc(cx,cy,R,sa,ea); c.closePath();
      const grad=c.createRadialGradient(cx,cy,15,cx,cy,R);
      grad.addColorStop(0,lighten(bg,0.18));
      grad.addColorStop(0.5,bg);
      grad.addColorStop(1,darken(bg,0.15));
      c.fillStyle=grad; c.fill();
      c.strokeStyle="rgba(0,0,0,0.65)"; c.lineWidth=2; c.stroke();
      // name text
      c.save();
      c.translate(cx,cy); c.rotate(sa+arc/2);
      const fz=Math.max(10,Math.min(24,170/n));
      c.font=`700 ${fz}px Anton,sans-serif`;
      c.fillStyle=fg; c.textAlign="right";
      c.shadowColor=fg==="#000"?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.5)"; c.shadowBlur=2;
      c.fillText((fs[i].length>9?fs[i].slice(0,9)+"…":fs[i]).toUpperCase(),R-12,fz*0.36);
      c.restore();
    }

    // center hub (multi-layer)
    c.save();
    c.shadowColor="rgba(0,0,0,0.6)"; c.shadowBlur=10;
    c.beginPath(); c.arc(cx,cy,32,0,2*Math.PI);
    c.fillStyle="#0a0a0a"; c.fill();
    c.restore();
    c.beginPath(); c.arc(cx,cy,32,0,2*Math.PI);
    c.strokeStyle="#FFE500"; c.lineWidth=4; c.stroke();
    const hubGrad=c.createRadialGradient(cx-4,cy-4,2,cx,cy,16);
    hubGrad.addColorStop(0,"#FFF59D");
    hubGrad.addColorStop(0.5,"#FFE500");
    hubGrad.addColorStop(1,"#E6CE00");
    c.beginPath(); c.arc(cx,cy,14,0,2*Math.PI);
    c.fillStyle=hubGrad; c.fill();
    c.strokeStyle="#000"; c.lineWidth=2; c.stroke();
    c.beginPath(); c.arc(cx-3,cy-3,3,0,2*Math.PI);
    c.fillStyle="rgba(255,255,255,0.55)"; c.fill();

    // POINTER at 12 o'clock
    const tipY=cy-R, baseY=tipY-34, hw=18;
    c.save();
    c.shadowColor="rgba(255,34,0,0.9)"; c.shadowBlur=14;
    c.beginPath(); c.moveTo(cx,tipY); c.lineTo(cx-hw,baseY); c.lineTo(cx+hw,baseY); c.closePath();
    const ptrGrad=c.createLinearGradient(0,baseY,0,tipY);
    ptrGrad.addColorStop(0,"#FF4500");
    ptrGrad.addColorStop(0.6,"#FF2200");
    ptrGrad.addColorStop(1,"#CC0000");
    c.fillStyle=ptrGrad; c.fill();
    c.restore();
    c.beginPath(); c.moveTo(cx,tipY); c.lineTo(cx-hw,baseY); c.lineTo(cx+hw,baseY); c.closePath();
    c.strokeStyle="#000"; c.lineWidth=2.5; c.stroke();
    c.beginPath(); c.moveTo(cx,tipY+4); c.lineTo(cx-hw+7,baseY+8); c.lineTo(cx+hw-7,baseY+8); c.closePath();
    c.fillStyle="rgba(255,255,255,0.28)"; c.fill();

    // Tick detection — return true when segment under pointer changes
    const norm=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    const local=((Math.PI*1.5-norm)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    const seg=Math.floor(local/arc)%n;
    if(seg!==lastSegRef.current){lastSegRef.current=seg; return true;}
    return false;
  },[]);

  // Redraw whenever friends list changes (and on tab change to "rodada")
  useEffect(()=>{ if(tab==="rodada") draw(angleRef.current); },[friends,draw,tab]);

  // ── WHEEL LOGIC ──
  // Calculates which segment is at the 12 o'clock pointer for a given angle
  const winnerIdx=(a)=>{
    const n=friendsRef.current.length,arc=(2*Math.PI)/n;
    const norm=((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
    const local=((Math.PI*1.5-norm)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
    return Math.floor(local/arc)%n;
  };

  // Confetti explosion
  const boom=(fx=BEER_FX,mul=1)=>{
    const ps=Array.from({length:Math.round(26*mul)},(_,i)=>({
      id:Date.now()+i, e:fx[~~(Math.random()*fx.length)],
      x:Math.random()*100, d:Math.random()*0.6,
      dur:2.5+Math.random()*2, sz:1.3+Math.random()*1.4,
    }));
    setSparks(ps); setTimeout(()=>setSparks([]),5500);
  };

  // Pick contextual message based on payment count + repeat flag
  const pickMsg=(count,isRepeat,l)=>{
    const tr=T[l];
    if(count>=3){const p=tr.msgsMulti; return p[~~(Math.random()*p.length)];}
    if(isRepeat) return tr.msgsRepeat[~~(Math.random()*tr.msgsRepeat.length)];
    return tr.msgs[~~(Math.random()*tr.msgs.length)];
  };

  // Spin the wheel — animated with easing
  const spin=()=>{
    if(spinning)return;
    if(friendsRef.current.length<2){setFErr(T[langRef.current].eMin);return;}
    setFErr("");setWinner(null);lastSegRef.current=-1;
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
        const l=langRef.current, idx=winnerIdx(ea), fs=friendsRef.current, name=fs[idx];
        const prev=payRef.current[name]||0, cnt=prev+1, repeat=lastWRef.current===name;
        setPayCount(pc=>({...pc,[name]:cnt})); setLastWin(name);
        setSpinning(false); playFanfare(); boom(BEER_FX);
        setWinner({name,msg:pickMsg(cnt,repeat,l),count:cnt,isRepeat:repeat,...SEGS[idx%SEGS.length]});
      }
    };
    animRef.current=requestAnimationFrame(frame);
  };

  // ── FAIRNESS TEST: Chi-square goodness-of-fit ──
  const CHI2_CRIT_95 = [
    3.841, 5.991, 7.815, 9.488, 11.070, 12.592, 14.067, 15.507, 16.919,
    18.307, 19.675, 21.026, 22.362, 23.685, 24.996, 26.296, 27.587, 28.869,
    30.144, 31.410, 32.671, 33.924, 35.172, 36.415, 37.652
  ];
  const runTest=(n=100)=>{
    const fs=friendsRef.current;
    if(fs.length<2){setFErr(T[langRef.current].eMin);return;}
    setTestResults({running:true,total:n});
    setTimeout(()=>{
      const counts={};
      fs.forEach(f=>{counts[f]=0;});
      let curAngle=angleRef.current;
      for(let i=0;i<n;i++){
        const extra=Math.PI*2*(7+cryptoRandom()*6);
        curAngle+=extra;
        const idx=winnerIdx(curAngle);
        counts[fs[idx]]++;
      }
      const k=fs.length;
      const expected=n/k;
      // Chi-square goodness-of-fit — single test, no multiple-comparisons inflation
      const chi2=Object.values(counts).reduce(
        (sum,obs)=>sum+Math.pow(obs-expected,2)/expected, 0
      );
      const df=k-1;
      const critical=CHI2_CRIT_95[df-1] || 50;
      const isFair=chi2<=critical;
      // Bonferroni-corrected per-friend range for the bars
      let z;
      if (k<=2) z=2.24;
      else if (k<=4) z=2.50;
      else if (k<=6) z=2.64;
      else if (k<=10) z=2.81;
      else if (k<=20) z=3.02;
      else z=3.20;
      const stddev=Math.sqrt(n*(1/k)*(1-1/k));
      const margin=z*stddev;
      const minOk=Math.max(0,expected-margin);
      const maxOk=expected+margin;
      setTestResults({
        counts, total:n, expected, stddev, minOk, maxOk,
        chi2, critical, isFair, allInRange:isFair, running:false
      });
    },50);
  };

  // ── SHAREABLE IMAGE GENERATION ──
  // Generates a 1080x1080 PNG with branded winner card for social sharing.
  // Returns a Blob, ready to use with navigator.share() or download fallback.
  const generateShareImage = (winnerName, winnerColor, mode = "wheel") => {
    return new Promise((resolve) => {
      const size = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const c = canvas.getContext("2d");

      // ── Background: dark with atmospheric gradient ──
      const bgGrad = c.createRadialGradient(size/2, size/2, 100, size/2, size/2, size);
      bgGrad.addColorStop(0, "#0a0a0a");
      bgGrad.addColorStop(0.6, "#040407");
      bgGrad.addColorStop(1, "#000");
      c.fillStyle = bgGrad;
      c.fillRect(0, 0, size, size);

      // Atmospheric glow in winner's color
      const glow = c.createRadialGradient(size/2, size/2, 50, size/2, size/2, 600);
      glow.addColorStop(0, winnerColor + "55");
      glow.addColorStop(0.4, winnerColor + "22");
      glow.addColorStop(1, "transparent");
      c.fillStyle = glow;
      c.fillRect(0, 0, size, size);

      // Subtle grid lines
      c.strokeStyle = "rgba(255,255,255,0.04)";
      c.lineWidth = 1;
      for (let i = 0; i < size; i += 60) {
        c.beginPath(); c.moveTo(i, 0); c.lineTo(i, size); c.stroke();
        c.beginPath(); c.moveTo(0, i); c.lineTo(size, i); c.stroke();
      }

      // ── Top brand bar ──
      c.fillStyle = "#FFE500";
      c.font = "bold 56px Anton, Impact, sans-serif";
      c.textAlign = "center";
      c.shadowColor = "rgba(255,229,0,0.5)";
      c.shadowBlur = 20;
      c.fillText("🍺 RODADA.PT", size/2, 130);
      c.shadowBlur = 0;

      // Tagline
      c.fillStyle = "#888";
      c.font = "500 28px 'IBM Plex Mono', monospace";
      c.fillText(lang === "pt" ? "QUEM PAGA A RODADA?" : "WHO BUYS THE ROUND?", size/2, 180);

      // ── Central card: brutalist style with offset shadow ──
      const cardX = 90, cardY = 280, cardW = 900, cardH = 560;
      // Offset shadow
      c.fillStyle = winnerColor;
      c.fillRect(cardX + 16, cardY + 16, cardW, cardH);
      // Card body
      const cardGrad = c.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
      cardGrad.addColorStop(0, "#1a1a1a");
      cardGrad.addColorStop(1, "#000");
      c.fillStyle = cardGrad;
      c.fillRect(cardX, cardY, cardW, cardH);
      // Card border
      c.strokeStyle = winnerColor;
      c.lineWidth = 6;
      c.strokeRect(cardX, cardY, cardW, cardH);

      // Color accent strip top of card
      c.fillStyle = winnerColor;
      c.fillRect(cardX, cardY, cardW, 18);

      // ── "PAGA A RODADA" label ──
      c.font = "bold 38px Anton, Impact, sans-serif";
      c.fillStyle = "#aaa";
      c.letterSpacing = "8px";
      c.fillText(mode === "cards"
        ? (lang === "pt" ? "PAGA O JANTAR" : "PAYS THE DINNER")
        : (lang === "pt" ? "PAGA A RODADA" : "BUYS THE ROUND"),
        size/2, cardY + 100);

      // ── Winner name (BIG) ──
      const displayName = winnerName.length > 12 ? winnerName.slice(0, 12) + "…" : winnerName;
      // Auto-size based on name length
      let nameSize = 200;
      if (displayName.length > 6) nameSize = 170;
      if (displayName.length > 9) nameSize = 140;
      c.font = `bold ${nameSize}px Anton, Impact, sans-serif`;
      c.fillStyle = winnerColor;
      c.shadowColor = winnerColor;
      c.shadowBlur = 35;
      c.fillText(displayName.toUpperCase(), size/2, cardY + 320);
      c.shadowBlur = 0;

      // Underline accent
      const nameW = c.measureText(displayName.toUpperCase()).width;
      c.fillStyle = winnerColor;
      c.fillRect(size/2 - nameW/2 - 30, cardY + 360, nameW + 60, 6);

      // Beer emoji line (decorative)
      c.font = "60px serif";
      c.fillText("🍺 🍺 🍺", size/2, cardY + 470);

      // ── Bottom: CTA ──
      c.fillStyle = "#fff";
      c.font = "bold 36px Anton, Impact, sans-serif";
      c.fillText(lang === "pt"
        ? "EXPERIMENTA TU →"
        : "TRY IT YOURSELF →",
        size/2, 920);

      // Domain emphasized
      c.fillStyle = "#FFE500";
      c.font = "bold 64px Anton, Impact, sans-serif";
      c.shadowColor = "rgba(255,229,0,0.6)";
      c.shadowBlur = 20;
      c.fillText("RODADA.PT", size/2, 1000);
      c.shadowBlur = 0;

      // Convert to blob
      canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
    });
  };

  // Share or download the generated image
  const shareImage = async (winnerName, winnerColor, mode = "wheel") => {
    try {
      const blob = await generateShareImage(winnerName, winnerColor, mode);
      if (!blob) return;
      const file = new File([blob], `rodada-${winnerName.toLowerCase()}.png`, { type: "image/png" });
      // Try native share with file (mobile)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: T[lang].shareMsg(winnerName) + "\nhttps://rodada.pt",
        });
      } else {
        // Desktop fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rodada-${winnerName.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      // User cancelled or error — silently ignore
    }
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

  /* ── CARD MODE: dramatic elimination ── */
  const runCardElimination=()=>{
    if(cardPhase==="eliminating")return;
    const fs=friendsRef.current;
    if(fs.length<2){setFErr(T[langRef.current].eMin);return;}
    setFErr("");
    setCardPhase("eliminating");
    setEliminated([]);
    setCardWinner(null);
    // Use Fisher-Yates with cryptoRandom to determine elimination order
    const order=shuffle(fs);
    const toEliminate=order.slice(0,-1); // all except last
    const finalWinner=order[order.length-1];
    const total=toEliminate.length;

    // Build-up cadence: starts fast, slows toward the end
    // Time before each elimination, in ms
    const delays=toEliminate.map((_,i)=>{
      const t=i/Math.max(total-1,1); // 0 to 1
      // Quadratic ease-in: starts ~600ms, ends ~2500ms; final card gets longer pause
      const base=600+t*t*1900;
      const isPenultimate=i===total-1;
      return isPenultimate?Math.max(base,2400):base;
    });

    let acc=0;
    toEliminate.forEach((name,i)=>{
      acc+=delays[i];
      setTimeout(()=>{
        const progress=i/Math.max(total-1,1);
        playSwoosh(progress);
        // Delay thunk slightly after swoosh
        setTimeout(()=>playThunk(),150);
        setEliminated(prev=>[...prev,name]);
      },acc);
    });

    // Riser kicks in 800ms before reveal
    setTimeout(()=>playRiser(),acc+200);
    // Final reveal
    setTimeout(()=>{
      playRevealChord();
      boom(BEER_FX,1.5); // confetti
      // Find winner's color from original SEGS palette
      const idx=fs.indexOf(finalWinner);
      const color=SEGS[idx%SEGS.length];
      setCardWinner({name:finalWinner,...color});
      setCardPhase("done");
    },acc+1500);
  };

  const resetCards=()=>{
    setCardPhase("idle");
    setEliminated([]);
    setCardWinner(null);
  };

  const shareCardWinner=async()=>{
    if(!cardWinner)return;
    const text=T[lang].cardsShareResult(cardWinner.name);
    try{
      if(navigator.share)await navigator.share({text,url:"https://rodada.pt"});
      else window.open(`https://wa.me/?text=${encodeURIComponent(text+"\nhttps://rodada.pt")}`,"_blank");
    }catch(e){}
  };

  // Reset card state when friends list changes
  useEffect(()=>{
    if(cardPhase!=="idle"){
      setCardPhase("idle");setEliminated([]);setCardWinner(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[friends.length]);

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

    /* ── FAIRNESS TEST MODAL ── */
    .test-card{max-width:480px;width:100%;padding:32px 26px 26px;
      background:linear-gradient(180deg,#0a0a0a 0%,#000 100%);
      text-align:left;animation:pi 0.45s cubic-bezier(0.34,1.56,0.64,1);position:relative;overflow:hidden;
      border:4px solid #00CFFF;
      box-shadow:10px 10px 0 #00CFFF, 0 0 60px rgba(0,207,255,0.4);max-height:90vh;overflow-y:auto}
    .test-title{font-family:Anton,sans-serif;font-size:1.5rem;color:#00CFFF;letter-spacing:0.06em;
      margin-bottom:10px;text-shadow:0 0 16px rgba(0,207,255,0.6);text-align:center}
    .test-sub{font-family:'IBM Plex Mono',monospace;font-size:0.74rem;color:#999;text-align:center;
      margin-bottom:18px;letter-spacing:0.02em;line-height:1.55}
    .test-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
    .test-stat{padding:9px 11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08)}
    .test-stat-label{font-family:'IBM Plex Mono',monospace;font-size:0.6rem;color:#666;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px}
    .test-stat-val{font-family:Anton,sans-serif;font-size:0.95rem;color:#FFE500;letter-spacing:0.04em}
    .test-rows{display:flex;flex-direction:column;gap:9px;margin-bottom:18px}
    .test-row{display:grid;grid-template-columns:80px 1fr 64px;align-items:center;gap:10px;padding:4px 0}
    .test-name{font-family:Anton,sans-serif;font-size:0.85rem;letter-spacing:0.04em;color:#fff;
      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:5px}
    .test-dot{display:inline-block;width:9px;height:9px;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px currentColor}
    .test-bar-bg{height:22px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);position:relative;overflow:hidden}
    .test-zone{position:absolute;top:0;bottom:0;background:rgba(0,255,159,0.14);
      border-left:1px dashed rgba(0,255,159,0.4);border-right:1px dashed rgba(0,255,159,0.4);z-index:0}
    .test-bar{height:100%;transition:width 0.6s cubic-bezier(0.34,1.2,0.64,1);position:relative;z-index:1}
    .test-bar::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,0.3),transparent 30%)}
    .test-expected-line{position:absolute;top:-2px;bottom:-2px;width:2px;background:#FFE500;box-shadow:0 0 6px #FFE500;z-index:3}
    .test-count{font-family:Anton,sans-serif;font-size:0.95rem;color:#fff;text-align:right;letter-spacing:0.03em}
    .test-pct{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#888;display:block;line-height:1;margin-top:2px}
    .test-verdict{padding:14px;margin-bottom:16px;text-align:center}
    .test-verdict-ok{background:linear-gradient(180deg,rgba(0,255,159,0.1),rgba(0,255,159,0.03));
      border:2px solid #00FF9F;box-shadow:0 0 22px rgba(0,255,159,0.25)}
    .test-verdict-bad{background:linear-gradient(180deg,rgba(255,107,0,0.1),rgba(255,107,0,0.03));
      border:2px solid #FF6B00;box-shadow:0 0 22px rgba(255,107,0,0.25)}
    .test-verdict-h{font-family:Anton,sans-serif;font-size:1.15rem;letter-spacing:0.1em;margin-bottom:4px}
    .test-verdict-ok .test-verdict-h{color:#00FF9F;text-shadow:0 0 12px rgba(0,255,159,0.55)}
    .test-verdict-bad .test-verdict-h{color:#FF6B00;text-shadow:0 0 12px rgba(255,107,0,0.55)}
    .test-verdict-sub{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;color:#aaa;letter-spacing:0.04em;line-height:1.5}
    .test-legend{display:flex;align-items:center;justify-content:center;gap:18px;
      font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#777;margin-bottom:16px;letter-spacing:0.04em}
    .test-leg-item{display:flex;align-items:center;gap:5px}
    .test-legend-mark{display:inline-block;width:2px;height:11px;background:#FFE500;box-shadow:0 0 4px #FFE500}
    .test-leg-zone{display:inline-block;width:14px;height:11px;background:rgba(0,255,159,0.25);border:1px dashed rgba(0,255,159,0.5)}
    .test-btn-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
    .btn-test-action{padding:13px 0;font-family:Anton,sans-serif;font-size:0.92rem;letter-spacing:0.07em;
      background:rgba(0,207,255,0.06);border:2px solid #00CFFF;color:#00CFFF;cursor:pointer;
      transition:all 0.15s;box-shadow:0 0 14px rgba(0,207,255,0.15)}
    .btn-test-action:hover{background:#00CFFF;color:#000;box-shadow:0 0 26px rgba(0,207,255,0.55);transform:translateY(-1px)}
    .btn-test-big{background:rgba(255,229,0,0.06);border-color:#FFE500;color:#FFE500;box-shadow:0 0 14px rgba(255,229,0,0.15)}
    .btn-test-big:hover{background:#FFE500;color:#000;box-shadow:0 0 26px rgba(255,229,0,0.55)}
    .btn-test-close{width:100%;padding:11px 0;font-family:'IBM Plex Mono',monospace;font-weight:700;
      font-size:0.74rem;letter-spacing:0.14em;background:transparent;border:1px solid #444;color:#888;
      cursor:pointer;transition:all 0.15s}
    .btn-test-close:hover{border-color:#fff;color:#fff}
    /* running state */
    .test-running{padding:50px 20px;text-align:center;color:#00CFFF}
    .test-running > div:nth-child(2){font-family:Anton,sans-serif;font-size:1.2rem;letter-spacing:0.1em;margin-bottom:8px}
    .test-running-n{font-family:'IBM Plex Mono',monospace;font-size:0.85rem;color:#888;letter-spacing:0.05em}
    .test-spinner{width:46px;height:46px;border:4px solid rgba(0,207,255,0.2);border-top-color:#00CFFF;
      border-radius:50%;margin:0 auto 18px;animation:spin 0.8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}

    .tag-line{font-size:0.62rem;color:#5a5a5a;letter-spacing:0.16em;text-align:center;font-weight:500}

    /* ═══════════════════════════════════════════════════════════ */
    /* ══════════════ CARD MODE — Quem paga o jantar ═══════════════ */
    /* ═══════════════════════════════════════════════════════════ */

    /* ── Mode toggle (iOS-style) ── */
    .mode-toggle{display:inline-flex;align-items:center;gap:0;
      background:rgba(0,0,0,0.5);border:2px solid rgba(255,229,0,0.3);
      padding:4px;backdrop-filter:blur(10px);
      box-shadow:inset 0 0 18px rgba(255,229,0,0.05), 0 4px 16px rgba(0,0,0,0.4);
      position:relative;overflow:hidden}
    .mode-opt{padding:9px 18px;font-family:Anton,sans-serif;font-size:0.88rem;
      letter-spacing:0.06em;background:transparent;border:none;color:#666;
      cursor:pointer;transition:color 0.25s;position:relative;z-index:2;white-space:nowrap}
    .mode-opt.active{color:#000}
    .mode-opt:hover:not(.active){color:#aaa}
    .mode-slider{position:absolute;top:4px;bottom:4px;width:calc(50% - 4px);
      background:linear-gradient(180deg,#FFF459,#FFE500);
      transition:transform 0.32s cubic-bezier(0.34,1.4,0.64,1);
      box-shadow:0 0 18px rgba(255,229,0,0.5), inset 0 1px 0 rgba(255,255,255,0.5);
      z-index:1;left:4px}
    .mode-slider.right{transform:translateX(100%)}

    /* ── Card stage (3D perspective container) ── */
    .card-stage{perspective:1400px;width:100%;max-width:420px;
      min-height:320px;position:relative;
      display:flex;align-items:center;justify-content:center;
      transform-style:preserve-3d}

    /* ── Individual credit card ── */
    .credit-card{
      width:240px;height:148px;border-radius:14px;
      position:absolute;
      background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 40%,#0a0a0a 100%);
      box-shadow:
        0 18px 50px rgba(0,0,0,0.7),
        0 8px 20px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.08),
        inset 0 -1px 0 rgba(0,0,0,0.4);
      padding:16px;
      transform-style:preserve-3d;
      transition:transform 0.6s cubic-bezier(0.34,1.2,0.64,1), opacity 0.4s, filter 0.5s;
      will-change:transform;
      animation:cardFloat 6s ease-in-out infinite;
      overflow:hidden;
      cursor:default;
    }
    @keyframes cardFloat{
      0%,100%{transform:var(--rest) translateY(0px) rotateZ(var(--tilt))}
      50%{transform:var(--rest) translateY(-6px) rotateZ(calc(var(--tilt) + 1deg))}
    }
    /* Holographic shine */
    .credit-card::before{
      content:"";position:absolute;inset:0;border-radius:14px;
      background:linear-gradient(115deg,
        transparent 30%,
        rgba(255,215,0,0.08) 45%,
        rgba(255,255,255,0.15) 50%,
        rgba(0,207,255,0.08) 55%,
        transparent 70%);
      pointer-events:none;
      animation:shine 4s ease-in-out infinite;
    }
    @keyframes shine{0%,100%{transform:translateX(-20%)}50%{transform:translateX(20%)}}
    /* Top edge highlight */
    .credit-card::after{
      content:"";position:absolute;top:0;left:0;right:0;height:50%;
      background:linear-gradient(180deg,rgba(255,255,255,0.06),transparent);
      border-radius:14px 14px 0 0;pointer-events:none;
    }

    .cc-brand{position:absolute;top:14px;right:16px;font-family:Anton,sans-serif;
      font-size:0.62rem;letter-spacing:0.18em;color:#FFD700;
      text-shadow:0 0 8px rgba(255,215,0,0.5);z-index:2}
    .cc-chip{position:absolute;top:42px;left:18px;width:36px;height:26px;
      background:linear-gradient(135deg,#FFD700 0%,#E6CE00 40%,#B8A500 100%);
      border-radius:5px;
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.4);
      overflow:hidden;z-index:2}
    .cc-chip::before{content:"";position:absolute;inset:4px;
      background:
        linear-gradient(90deg,transparent 32%,#0a0a0a 33%,#0a0a0a 35%,transparent 36%),
        linear-gradient(90deg,transparent 64%,#0a0a0a 65%,#0a0a0a 67%,transparent 68%),
        linear-gradient(0deg,transparent 48%,#0a0a0a 49%,#0a0a0a 51%,transparent 52%);
      opacity:0.7;border-radius:3px}
    .cc-number{position:absolute;bottom:42px;left:18px;right:18px;
      font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:0.78rem;
      color:#e0e0e0;letter-spacing:0.18em;z-index:2;
      text-shadow:0 1px 2px rgba(0,0,0,0.7)}
    .cc-name{position:absolute;bottom:14px;left:18px;
      font-family:Anton,sans-serif;font-size:0.9rem;letter-spacing:0.08em;
      color:#fff;z-index:2;
      text-shadow:0 1px 2px rgba(0,0,0,0.7);
      max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .cc-expiry{position:absolute;bottom:14px;right:18px;
      font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:0.65rem;
      color:#999;letter-spacing:0.1em;z-index:2}

    /* ── Card states ── */
    .credit-card.eliminated{
      animation:cardOut 0.7s cubic-bezier(0.55,0,0.78,0) forwards;
      pointer-events:none;
    }
    @keyframes cardOut{
      0%{transform:var(--rest) translateY(0) scale(1);opacity:1;filter:none}
      40%{transform:var(--rest) translateY(-40px) rotateZ(var(--out-rot)) scale(1.05);opacity:1}
      100%{transform:var(--rest) translateY(-160px) translateX(var(--out-x)) rotateZ(calc(var(--out-rot) * 3)) scale(0.4);opacity:0;filter:blur(6px)}
    }

    /* Winner card centered + dramatic */
    .credit-card.winner{
      animation:cardWinner 1.3s cubic-bezier(0.34,1.4,0.64,1) forwards;
      z-index:50;
    }
    @keyframes cardWinner{
      0%{transform:var(--rest) scale(1) rotateY(0deg);opacity:1}
      50%{transform:translate(-50%,-50%) scale(1.15) rotateY(180deg);opacity:1;left:50%;top:50%}
      100%{transform:translate(-50%,-50%) scale(1.4) rotateY(360deg);opacity:1;left:50%;top:50%}
    }
    .credit-card.winner-final{
      transform:translate(-50%,-50%) scale(1.4) !important;
      left:50% !important;top:50% !important;
      animation:winnerPulse 2s ease-in-out infinite;
      box-shadow:
        0 25px 70px rgba(255,34,0,0.5),
        0 0 80px rgba(255,34,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.15);
      border:2px solid #FF2200;
    }
    @keyframes winnerPulse{
      0%,100%{box-shadow:0 25px 70px rgba(255,34,0,0.5),0 0 80px rgba(255,34,0,0.3),inset 0 1px 0 rgba(255,255,255,0.15)}
      50%{box-shadow:0 25px 70px rgba(255,34,0,0.7),0 0 120px rgba(255,34,0,0.5),inset 0 1px 0 rgba(255,255,255,0.15)}
    }
    .credit-card.winner-final .cc-name{color:#FF6B00;text-shadow:0 0 14px rgba(255,107,0,0.7);font-size:1rem}
    .credit-card.winner-final .cc-brand{color:#FF2200;text-shadow:0 0 10px rgba(255,34,0,0.6)}

    /* ── Card counter ── */
    .card-counter{font-family:'IBM Plex Mono',monospace;font-size:0.75rem;
      color:#888;letter-spacing:0.18em;text-align:center;margin-top:8px;
      min-height:1.2em}
    .card-phase-label{font-family:Anton,sans-serif;font-size:0.95rem;color:#FFE500;
      letter-spacing:0.1em;text-align:center;text-shadow:0 0 10px rgba(255,229,0,0.4);
      margin-bottom:4px;animation:pulseLabel 1.2s ease-in-out infinite}
    @keyframes pulseLabel{0%,100%{opacity:0.8}50%{opacity:1}}

    /* ── Card action buttons ── */
    .btn-card-primary{width:100%;max-width:420px;padding:18px 0;
      font-family:Anton,sans-serif;font-size:1.3rem;letter-spacing:0.08em;color:#000;
      background:linear-gradient(180deg,#FFF459,#FFE500 50%,#E6CE00);
      border:3px solid #000;cursor:pointer;
      box-shadow:8px 8px 0 #FF2200, 0 0 30px rgba(255,229,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
      transition:transform 0.08s,box-shadow 0.08s;position:relative;overflow:hidden}
    .btn-card-primary::before{content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);
      animation:shi 3s ease-in-out infinite}
    .btn-card-primary:hover:not(:disabled){transform:translate(-2px,-2px);box-shadow:10px 10px 0 #FF2200, 0 0 40px rgba(255,229,0,0.5)}
    .btn-card-primary:active:not(:disabled){transform:translate(4px,4px);box-shadow:4px 4px 0 #FF2200}
    .btn-card-primary:disabled{background:linear-gradient(180deg,#2a2a2a,#1a1a1a);color:#666;cursor:not-allowed;box-shadow:4px 4px 0 #2a2a2a;transform:translate(4px,4px)}
    .btn-card-primary:disabled::before{display:none}

    .btn-card-secondary{width:100%;max-width:420px;padding:14px 0;
      font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:0.82rem;
      letter-spacing:0.12em;background:rgba(255,255,255,0.02);
      border:2px solid #666;color:#888;cursor:pointer;
      transition:all 0.15s;backdrop-filter:blur(6px)}
    .btn-card-secondary:hover:not(:disabled){border-color:#fff;color:#fff;background:rgba(255,255,255,0.05);box-shadow:0 0 18px rgba(255,255,255,0.15)}
    .btn-card-secondary:disabled{opacity:0.3;cursor:not-allowed}

    .card-btn-row{display:flex;gap:10px;width:100%;max-width:420px}
    .card-btn-row .btn-card-primary, .card-btn-row .btn-card-secondary{flex:1}

    /* ── Card winner modal ── */
    .card-winner-card{max-width:440px;width:100%;padding:42px 28px 32px;
      background:linear-gradient(180deg,#0a0a0a 0%,#000 100%);
      text-align:center;animation:pi 0.45s cubic-bezier(0.34,1.56,0.64,1);
      position:relative;overflow:hidden;
      border:4px solid #FF2200;
      box-shadow:14px 14px 0 #FF2200, 0 0 80px rgba(255,34,0,0.45)}
    .card-winner-card::before{content:"";position:absolute;inset:0;
      background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(255,34,0,0.12),transparent);pointer-events:none}
    .cw-label{font-family:'IBM Plex Mono',monospace;font-size:0.7rem;
      color:#FF2200;letter-spacing:0.3em;margin-bottom:14px;font-weight:700;
      text-shadow:0 0 10px rgba(255,34,0,0.5)}
    .cw-name{font-family:Anton,sans-serif;font-size:clamp(2.8rem,11vw,4.4rem);
      line-height:1;margin-bottom:16px;word-break:break-word;letter-spacing:0.02em}
    .cw-msg{font-size:1.32rem;margin-bottom:24px;color:#fff;line-height:1.4;font-weight:500}
    .cw-btns{display:flex;flex-direction:column;gap:11px;position:relative;z-index:2}
    .btn-cw-again{font-family:Anton,sans-serif;font-size:1.2rem;letter-spacing:0.06em;
      padding:14px 0;border:3px solid #000;cursor:pointer;width:100%;
      box-shadow:6px 6px 0 #000;transition:all 0.08s;font-weight:bold;
      background:linear-gradient(180deg,#FFF459,#FFE500);color:#000}
    .btn-cw-again:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 #000}
    .btn-cw-share{width:100%;padding:13px 0;font-family:'IBM Plex Mono',monospace;
      font-weight:700;font-size:0.84rem;letter-spacing:0.1em;
      background:transparent;border:2px solid #fff;color:#fff;cursor:pointer;transition:all 0.15s}
    .btn-cw-share:hover{background:#fff;color:#000;box-shadow:0 0 22px rgba(255,255,255,0.4)}

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
    .btn-share-img{width:100%;padding:14px 0;margin-top:10px;font-family:Anton,sans-serif;font-weight:400;
      font-size:0.98rem;letter-spacing:0.09em;background:linear-gradient(180deg,#FFF459,#FFE500);
      color:#000;border:3px solid #000;cursor:pointer;transition:all 0.12s;
      box-shadow:6px 6px 0 #000, 0 0 24px rgba(255,229,0,0.35);position:relative;overflow:hidden}
    .btn-share-img::before{content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent);
      animation:shi 3s ease-in-out infinite}
    .btn-share-img:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 #000, 0 0 32px rgba(255,229,0,0.5)}
    .btn-share-img:active{transform:translate(3px,3px);box-shadow:3px 3px 0 #000}

    /* ── CONFETTI ── */
    .sp{position:fixed;top:-55px;animation:dr linear forwards;z-index:200;pointer-events:none;user-select:none;
      filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4))}
    @keyframes dr{0%{transform:translateY(0) rotate(0deg);opacity:1}80%{opacity:1}100%{transform:translateY(115vh) rotate(900deg);opacity:0}}

    /* ── FOOTER ── */
    .ftr{text-align:center;padding:24px 18px 28px;font-size:0.7rem;color:#3a3a3a;
      letter-spacing:0.14em;font-family:'IBM Plex Mono',monospace;font-weight:500;
      border-top:1px solid rgba(255,229,0,0.08)}

    /* ════════════════════════════════════════════ */
    /* ═══════ CARD MODE — premium 3D cards ═══════ */
    /* ════════════════════════════════════════════ */

    /* iPhone-style mode toggle */
    .mode-toggle{position:relative;display:inline-flex;background:rgba(0,0,0,0.5);
      border:2px solid rgba(255,255,255,0.1);padding:4px;backdrop-filter:blur(10px);
      box-shadow:0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
      margin-bottom:4px}
    .mode-pill{position:relative;z-index:2;padding:9px 18px;background:transparent;border:none;
      cursor:pointer;font-family:Anton,sans-serif;font-size:0.9rem;letter-spacing:0.07em;
      color:#888;transition:color 0.25s;white-space:nowrap}
    .mode-pill.active{color:#000}
    .mode-pill:hover:not(.active){color:#ccc}
    .mode-slider{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);
      background:linear-gradient(180deg,#FFF459,#FFE500);z-index:1;
      transition:transform 0.32s cubic-bezier(0.34,1.4,0.5,1);
      box-shadow:0 2px 8px rgba(255,229,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)}
    .mode-slider.right{transform:translateX(100%)}

    /* Cards title */
    .cards-title{font-family:Anton,sans-serif;font-size:clamp(1.3rem,4vw,1.7rem);
      color:#FFE500;letter-spacing:0.1em;text-align:center;
      text-shadow:0 0 18px rgba(255,229,0,0.5);margin-top:6px}

    /* 3D stage — perspective container */
    .cards-stage{position:relative;width:100%;max-width:${SZ}px;height:340px;
      perspective:1200px;perspective-origin:50% 50%;
      display:flex;align-items:center;justify-content:center}
    .cards-deck{position:absolute;inset:0;transform-style:preserve-3d}

    /* Individual card */
    .card-3d{position:absolute;top:50%;left:50%;width:200px;height:128px;
      transform-style:preserve-3d;transition:transform 0.7s cubic-bezier(0.34,1.4,0.5,1),
                                              opacity 0.7s ease, filter 0.7s ease;
      will-change:transform}
    .card-3d.winner{transition:transform 1.2s cubic-bezier(0.34,1.6,0.5,1),
                                  filter 1.2s ease, opacity 0.5s ease;
                    animation:card-pulse 2s ease-in-out infinite}
    @keyframes card-pulse{
      0%,100%{filter:drop-shadow(0 0 30px currentColor)}
      50%{filter:drop-shadow(0 0 55px currentColor)}
    }

    .card-face{position:absolute;inset:0;border-radius:12px;overflow:hidden;
      background:linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 45%, #000 100%);
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:
        0 8px 24px rgba(0,0,0,0.7),
        inset 0 1px 0 rgba(255,255,255,0.08),
        inset 0 -1px 0 rgba(0,0,0,0.5);
      padding:11px 13px;
      color:#fff;font-family:'IBM Plex Mono',monospace}

    /* Holographic shine that moves */
    .card-shine{position:absolute;top:-50%;left:-50%;width:200%;height:200%;
      background:linear-gradient(115deg,
        transparent 30%,
        rgba(255,255,255,0.04) 45%,
        rgba(255,255,255,0.10) 50%,
        rgba(255,255,255,0.04) 55%,
        transparent 70%);
      animation:card-shine 5s ease-in-out infinite;
      pointer-events:none}
    @keyframes card-shine{
      0%,100%{transform:translateX(-30%)}
      50%{transform:translateX(30%)}
    }

    /* Chip — top left */
    .card-chip{position:absolute;top:32px;left:14px;width:32px;height:25px;
      filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))}

    /* Brand top right */
    .card-brand{position:absolute;top:11px;right:13px;font-family:Anton,sans-serif;
      font-size:0.65rem;letter-spacing:0.16em;color:#FFE500;
      text-shadow:0 0 8px rgba(255,229,0,0.4)}

    /* Card number — middle */
    .card-number{position:absolute;top:62px;left:14px;right:14px;
      font-family:'IBM Plex Mono',monospace;font-size:0.78rem;
      letter-spacing:0.12em;color:#bbb;font-weight:500}

    /* Bottom row: cardholder + expiry */
    .card-bottom{position:absolute;bottom:11px;left:14px;right:14px;
      display:flex;justify-content:space-between;align-items:flex-end;gap:8px}
    .card-label{font-size:0.5rem;color:#555;letter-spacing:0.16em;
      text-transform:uppercase;margin-bottom:2px;font-weight:600}
    .card-name{font-family:Anton,sans-serif;font-size:0.78rem;letter-spacing:0.05em;
      color:#fff;text-transform:uppercase;
      overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px}
    .card-exp{font-family:'IBM Plex Mono',monospace;font-size:0.65rem;color:#aaa;
      letter-spacing:0.08em;text-align:right}

    /* Color accent strip — bottom */
    .card-accent{position:absolute;bottom:0;left:0;right:0;height:3px}

    /* Eliminated stamp */
    .card-stamp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-12deg);
      color:#FF2200;font-family:Anton,sans-serif;font-size:1.4rem;letter-spacing:0.12em;
      border:3px solid #FF2200;padding:4px 14px;text-align:center;
      box-shadow:0 0 18px rgba(255,34,0,0.6);
      background:rgba(0,0,0,0.3);backdrop-filter:blur(2px);
      animation:stamp-in 0.35s cubic-bezier(0.34,1.8,0.5,1)}
    @keyframes stamp-in{
      from{transform:translate(-50%,-50%) rotate(-12deg) scale(2.5);opacity:0}
      to{transform:translate(-50%,-50%) rotate(-12deg) scale(1);opacity:1}
    }

    /* Cards ready hint */
    .cards-ready{font-family:'IBM Plex Mono',monospace;font-size:0.72rem;
      color:#666;letter-spacing:0.1em;text-align:center}

    /* Winner label inline */
    .cards-winner-label{font-family:Anton,sans-serif;font-size:clamp(1.4rem,5vw,2rem);
      letter-spacing:0.05em;text-align:center;padding:14px 8px;
      animation:winner-bounce 0.6s cubic-bezier(0.34,1.7,0.5,1)}
    @keyframes winner-bounce{
      from{transform:scale(0.4) translateY(20px);opacity:0;filter:blur(8px)}
      to{transform:scale(1);opacity:1;filter:blur(0)}
    }

    /* btn-ws used in cards mode share */
    .cards-stage + .btn-spin{margin-top:4px}

    /* ── responsive ── */
    @media (max-width:380px){
      .hdr{padding:18px 16px}
      .main{padding:24px 14px 40px}
      .cards-stage{height:300px}
      .card-3d{width:170px;height:108px}
      .card-number{font-size:0.68rem;top:54px}
      .card-name{font-size:0.7rem;max-width:90px}
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
            {/* Mode toggle: Wheel vs Cards */}
            <div className="mode-toggle" role="tablist">
              <button role="tab" aria-selected={mode==="wheel"}
                className={`mode-pill${mode==="wheel"?" active":""}`}
                onClick={()=>{setMode("wheel");resetCards();}}>
                {t.modeWheel}
              </button>
              <button role="tab" aria-selected={mode==="cards"}
                className={`mode-pill${mode==="cards"?" active":""}`}
                onClick={()=>setMode("cards")}>
                {t.modeCards}
              </button>
              <div className={`mode-slider${mode==="cards"?" right":""}`} aria-hidden/>
            </div>

            {mode==="wheel"?(
              <>
                <div className="canvas-wrap">
                  <canvas ref={canvasRef} style={{width:SZ,height:SZ,maxWidth:"100%",display:"block"}}/>
                </div>

                <button className="btn-spin" onClick={spin} disabled={spinning} aria-label="Spin the wheel">
                  {spinning?t.spinning:(<><span className="ic">🍺</span>{t.spin}</>)}
                </button>
              </>
            ):(
              <>
                <div className="cards-title">{t.cardsTitle}</div>

                {/* 3D card stage */}
                <div className="cards-stage" aria-live="polite">
                  <div className="cards-deck">
                    {friends.map((f,i)=>{
                      const c=SEGS[i%SEGS.length];
                      const elimIdx=eliminated.indexOf(f);
                      const isEliminated=elimIdx>=0;
                      const isWinner=cardWinner&&cardWinner.name===f;
                      // Fan layout: spread cards in arc
                      const total=friends.length;
                      const center=(total-1)/2;
                      const offset=i-center;
                      const baseAngle=offset*(Math.min(8,40/total));
                      const baseX=offset*(Math.min(28,140/total));
                      const baseY=Math.abs(offset)*3;
                      // Eliminated: fly off
                      const elimAngle=(i%2===0?-1:1)*(45+elimIdx*7);
                      const elimX=(i%2===0?-1:1)*(180+elimIdx*15);
                      const elimY=160+elimIdx*8;
                      // Winner: center, scale up
                      const style=isWinner?{
                        transform:`translate(-50%,-55%) rotate(0deg) scale(1.15)`,
                        zIndex:100,
                        filter:"drop-shadow(0 0 40px "+c.bg+")",
                      }:isEliminated?{
                        transform:`translate(calc(-50% + ${elimX}px), calc(-50% + ${elimY}px)) rotate(${elimAngle}deg) scale(0.7)`,
                        opacity:0.25,filter:"grayscale(0.8) blur(1px)",zIndex:i,
                      }:{
                        transform:`translate(calc(-50% + ${baseX}px), calc(-50% + ${baseY}px)) rotate(${baseAngle}deg)`,
                        zIndex:50-Math.abs(offset),
                      };
                      return(
                        <div key={f} className={`card-3d${isEliminated?" eliminated":""}${isWinner?" winner":""}`} style={style}>
                          {/* Card face */}
                          <div className="card-face">
                            {/* Holographic shine */}
                            <div className="card-shine"/>
                            {/* Chip SVG */}
                            <svg className="card-chip" viewBox="0 0 40 32" aria-hidden>
                              <defs>
                                <linearGradient id={`cg${i}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0" stopColor="#FFD970"/>
                                  <stop offset="0.5" stopColor="#C09020"/>
                                  <stop offset="1" stopColor="#8B6914"/>
                                </linearGradient>
                              </defs>
                              <rect x="1" y="1" width="38" height="30" rx="4" fill={`url(#cg${i})`} stroke="#5a4408" strokeWidth="0.5"/>
                              <line x1="14" y1="1" x2="14" y2="31" stroke="#5a4408" strokeWidth="0.4"/>
                              <line x1="26" y1="1" x2="26" y2="31" stroke="#5a4408" strokeWidth="0.4"/>
                              <line x1="1" y1="10" x2="39" y2="10" stroke="#5a4408" strokeWidth="0.4"/>
                              <line x1="1" y1="22" x2="39" y2="22" stroke="#5a4408" strokeWidth="0.4"/>
                            </svg>
                            {/* Brand text top right */}
                            <div className="card-brand">RODADA<span style={{color:c.bg}}>•</span></div>
                            {/* Card number */}
                            <div className="card-number">•••• •••• •••• {String(1000+i).slice(-4)}</div>
                            {/* Bottom row */}
                            <div className="card-bottom">
                              <div className="card-left">
                                <div className="card-label">{t.cardsCardholder}</div>
                                <div className="card-name">{f.toUpperCase()}</div>
                              </div>
                              <div className="card-right">
                                <div className="card-label">{t.cardsExpires}</div>
                                <div className="card-exp">{t.cardsExpYear}</div>
                              </div>
                            </div>
                            {/* Color accent strip */}
                            <div className="card-accent" style={{background:c.bg,boxShadow:`0 0 14px ${c.bg}`}}/>
                            {/* Eliminated stamp */}
                            {isEliminated&&!isWinner&&(
                              <div className="card-stamp">{t.cardsEliminated}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {cardPhase==="done"&&cardWinner?(
                  <>
                    <div className="cards-winner-label" style={{color:cardWinner.bg,textShadow:`0 0 20px ${cardWinner.bg}`}}>
                      ⭐ {cardWinner.name.toUpperCase()} {t.cardsPays}
                    </div>
                    <button className="btn-spin" onClick={resetCards}>
                      🔄 {t.cardsRestart}
                    </button>
                    <button className="btn-ws" onClick={shareCardWinner} style={{maxWidth:SZ,width:"100%"}}>
                      {t.shareResult}
                    </button>
                    <button className="btn-share-img" onClick={()=>shareImage(cardWinner.name, cardWinner.bg, "cards")} style={{maxWidth:SZ,width:"100%"}}>
                      {t.shareImage}
                    </button>
                  </>
                ):(
                  <button className="btn-spin" onClick={runCardElimination}
                    disabled={cardPhase==="eliminating"||friends.length<2}>
                    {cardPhase==="eliminating"?t.cardsEliminating:t.cardsCta}
                  </button>
                )}

                {/* Status text below button */}
                {cardPhase==="idle"&&friends.length>=2&&(
                  <div className="cards-ready">{t.cardsReady}</div>
                )}
              </>
            )}

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

            {/* Shame board only in wheel mode */}
            {mode==="wheel"&&shameBoard.length>0&&(
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
              {mode==="wheel"&&(
                <button className="btn-test" onClick={()=>runTest(100)} aria-label="Test 100 spins">
                  {t.testBtn}
                </button>
              )}
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
            <button className="btn-share-img" onClick={()=>shareImage(winner.name, winner.bg, "wheel")}>
              {t.shareImage}
            </button>
          </div>
        </div>
      )}

      {/* ── FAIRNESS TEST MODAL ── */}
      {testResults&&(
        <div className="ov" onClick={()=>!testResults.running&&setTestResults(null)}>
          <div className="test-card" onClick={e=>e.stopPropagation()}>
            <div className="test-title">🎯 {t.testTitle}</div>

            {testResults.running ? (
              <div className="test-running">
                <div className="test-spinner"/>
                <div>{t.testRunning}</div>
                <div className="test-running-n">{testResults.total}×</div>
              </div>
            ) : (
              <>
                <div className="test-sub">{t.testSub}</div>

                <div className="test-stats">
                  <div className="test-stat">
                    <div className="test-stat-label">{t.testExpected}</div>
                    <div className="test-stat-val">{testResults.expected.toFixed(1)}× {t.testTimes}</div>
                  </div>
                  <div className="test-stat">
                    <div className="test-stat-label">{t.testRange}</div>
                    <div className="test-stat-val">{Math.floor(testResults.minOk)} – {Math.ceil(testResults.maxOk)}</div>
                  </div>
                </div>

                <div className="test-rows">
                  {(() => {
                    const exp = testResults.expected;
                    const minOk = testResults.minOk;
                    const maxOk = testResults.maxOk;
                    // Scale: bars displayed up to 1.5x maxOk so the range zone occupies most of bar width
                    const scaleMax = Math.max(maxOk*1.3, Math.max(...Object.values(testResults.counts))*1.1);
                    const zoneStart = (minOk/scaleMax)*100;
                    const zoneEnd = (maxOk/scaleMax)*100;
                    const expPct = (exp/scaleMax)*100;

                    return Object.entries(testResults.counts).map(([name,count],i) => {
                      const c = SEGS[i % SEGS.length];
                      const pct = (count/testResults.total)*100;
                      const barW = (count/scaleMax)*100;
                      const inRange = count>=minOk && count<=maxOk;
                      return (
                        <div key={name} className="test-row">
                          <div className="test-name">
                            <span className="test-dot" style={{background:c.bg,color:c.bg}}/>
                            {name.length>7?name.slice(0,7)+"…":name}
                          </div>
                          <div className="test-bar-bg">
                            {/* green safe zone */}
                            <div className="test-zone" style={{
                              left:`${zoneStart}%`,
                              width:`${zoneEnd-zoneStart}%`
                            }}/>
                            {/* bar with color based on in-range or not */}
                            <div className="test-bar" style={{
                              width:`${barW}%`,
                              background:inRange
                                ? `linear-gradient(90deg, ${c.bg}, ${lighten(c.bg,0.15)})`
                                : `linear-gradient(90deg, #FF2200, #FF6B00)`,
                              boxShadow:inRange?"none":"0 0 12px rgba(255,34,0,0.6)"
                            }}/>
                            {/* expected line */}
                            <div className="test-expected-line" style={{left:`${expPct}%`}}/>
                          </div>
                          <div className="test-count" style={{color:inRange?"#fff":"#FF6B00"}}>
                            {count}×
                            <span className="test-pct">{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Verdict box */}
                {testResults.allInRange ? (
                  <div className="test-verdict test-verdict-ok">
                    <div className="test-verdict-h">{t.testFair}</div>
                    <div className="test-verdict-sub">{t.testFairSub(testResults.total)}</div>
                  </div>
                ) : (
                  <div className="test-verdict test-verdict-bad">
                    <div className="test-verdict-h">{t.testUnfair}</div>
                    <div className="test-verdict-sub">{t.testUnfairSub}</div>
                  </div>
                )}

                <div className="test-legend">
                  <span className="test-leg-item"><span className="test-leg-zone"/>{lang==="pt"?"zona ok":"ok zone"}</span>
                  <span className="test-leg-item"><span className="test-legend-mark"/>{lang==="pt"?"esperado":"expected"}</span>
                </div>

                <div className="test-btn-row">
                  <button className="btn-test-action" onClick={()=>runTest(100)}>
                    {t.testRepeat}
                  </button>
                  <button className="btn-test-action btn-test-big" onClick={()=>runTest(1000)}>
                    {t.testBigger}
                  </button>
                </div>
                <button className="btn-test-close" onClick={()=>setTestResults(null)}>
                  {t.testClose}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
