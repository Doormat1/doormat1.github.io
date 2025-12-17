
// GCSE/BS-style circuit symbols catalogue
const SYMBOLS = [
  { key: 'cell', name: 'Cell' },
  { key: 'battery', name: 'Battery' },
  { key: 'open-switch', name: 'Open Switch' },
  { key: 'closed-switch', name: 'Closed Switch' },
  { key: 'lamp', name: 'Lamp' },
  { key: 'fuse', name: 'Fuse' },
  { key: 'ammeter', name: 'Ammeter' },
  { key: 'resistor', name: 'Resistor' },
  { key: 'variable-resistor', name: 'Variable Resistor' },
  { key: 'wire', name: 'Wire' },
  { key: 'diode', name: 'Diode' },
  { key: 'voltmeter', name: 'Voltmeter' },
  { key: 'ldr', name: 'LDR' },
  { key: 'thermistor', name: 'Thermistor' },
  { key: 'dc-power-supply', name: 'DC Power Supply' },
  { key: 'ac-power-supply', name: 'AC Power Supply' },
];

// State
let deck = [];       // full shuffled list of 16 for caller
let called = [];     // names shown so far
let bingoCard = [];  // 9 items for 3x3 grid
let current = null;

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function initGame(){
  deck = shuffle(SYMBOLS);
  called = [];
  current = null;
  bingoCard = shuffle(SYMBOLS).slice(0,9);
  renderBingoCard();
  setCallerImage(null);
  setStatus();
  enableButtons();
}

// Bingo card rendering and interactions
function renderBingoCard(){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  bingoCard.forEach(item => {
    const d = document.createElement('div');
    d.className = 'cell';
    d.dataset.key = item.key;
    d.innerHTML = `<img src="images/${item.key}.svg" alt="${item.name}"><div class="label">${item.name}</div>`;
    d.addEventListener('click', ()=>{ d.classList.toggle('marked'); });
    grid.appendChild(d);
  });
}

function markIfOnCard(name){
  const item = SYMBOLS.find(s=>s.name===name);
  if(!item) return;
  document.querySelectorAll('.cell').forEach(cell=>{
    if(cell.dataset.key===item.key){ cell.classList.add('marked'); }
  });
}

// Caller view
function nextSymbol(){
  if(called.length===deck.length){
    toast('All symbols have been counted!');
    disableNext();
    return;
  }
  const next = deck[called.length];
  current = next;
  called.push(next.name);
  setCallerImage(`images/${next.key}.svg`, next.name);
  setStatus();
  markIfOnCard(next.name);
}

function resetRound(){
  initGame();
}

// Status & UI helpers
function setCallerImage(src=null, name=''){
  const img = document.getElementById('caller-img');
  const label = document.getElementById('current-name');
  if(!src){
    img.style.display='none';
    label.textContent='—';
    return;
  }
  img.src=src; img.alt=name; img.style.display='block';
  label.textContent=name;
}

function setStatus(){
  document.getElementById('count').textContent = `${called.length} / ${SYMBOLS.length}`;
  document.getElementById('seen').textContent = called.length? called.join(', ') : 'None yet';
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2500);
}

function enableButtons(){
  document.getElementById('btn-next').disabled=false;
  document.getElementById('btn-reset').disabled=false;
  document.getElementById('btn-new-card').disabled=false;
}
function disableNext(){
  document.getElementById('btn-next').disabled=true;
}

// Tabs
function showTab(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tabpanel').forEach(p=>p.style.display='none');
  document.getElementById(id+'-tab').classList.add('active');
  document.getElementById(id+'-panel').style.display='block';
}

function newCard(){
  bingoCard = shuffle(SYMBOLS).slice(0,9);
  renderBingoCard();
}

window.addEventListener('DOMContentLoaded', ()=>{
  initGame();
  showTab('bingo');
});
