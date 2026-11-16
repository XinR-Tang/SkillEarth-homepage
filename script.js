const logos = {
  openai: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
  bytedance: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/bytedance-color.svg',
  deepseek: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek-color.svg',
  qwen: 'https://cdn.simpleicons.org/qwen/6950EF',
  mistral: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/mistral-color.svg'
};

const generalization = [
  {name:'GPT-5.6-Terra', family:'OpenAI', logo:'openai', base:44.53, skill:54.45},
  {name:'Doubao-Seed-2.0-Mini', family:'ByteDance', logo:'bytedance', base:41.02, skill:46.16},
  {name:'DeepSeek-V4-Flash', family:'DeepSeek', logo:'deepseek', base:47.43, skill:53.53},
  {name:'Mistral-v0.3-Instruct', family:'Mistral AI', logo:'mistral', base:10.46, skill:22.17},
  {name:'DeepSeek-R1', family:'DeepSeek', logo:'deepseek', base:7.23, skill:8.64},
  {name:'Qwen2.5-7B-Instruct', family:'Qwen', logo:'qwen', base:36.21, skill:43.16},
  {name:'Qwen3-4B-Instruct', family:'Qwen', logo:'qwen', base:20.77, skill:33.41}
];

const transfer = [
  {target:'Qwen3-4B-Instruct', targetLogo:'qwen', base:7.59, sources:[
    {name:'Doubao-Seed-2.0-Mini',logo:'bytedance',score:23.45},
    {name:'DeepSeek-V4-Flash',logo:'deepseek',score:18.62},
    {name:'GPT-5.6-Terra',logo:'openai',score:22.76}
  ]},
  {target:'DeepSeek-V4-Flash', targetLogo:'deepseek', base:55.86, sources:[
    {name:'Qwen3-4B-Instruct',logo:'qwen',score:62.07},
    {name:'Qwen2.5-7B-Instruct',logo:'qwen',score:61.38}
  ]}
];

const logo = (key, alt) => `<img class="model-logo" src="${logos[key]}" alt="${alt}" loading="lazy">`;
const fmt = n => n.toFixed(2);

const frameworkSection = document.getElementById('framework');
const skillExampleSection = document.getElementById('skill-example');
skillExampleSection.before(frameworkSection);

function renderGeneralization() {
  const max = 60;
  const rows = generalization.map(d => {
    const delta = d.skill - d.base;
    return `<div class="model-row">
      <div class="model-label">${logo(d.logo,d.family)}<span>${d.name}</span></div>
      <div class="bar-wrap" title="Without skill: ${fmt(d.base)}"><div class="bar baseline" style="--w:${d.base/max*100}%"></div></div>
      <div class="bar-wrap" title="With SkillEarth: ${fmt(d.skill)}"><div class="bar skill" style="--w:${d.skill/max*100}%"></div></div>
      <div class="delta">+${fmt(delta)}</div>
    </div>`;
  }).join('');
  document.getElementById('generalizationChart').innerHTML = `<div class="generalization-chart">
    <div class="chart-head"><h3>OpenEarth-Bench · macro End-to-End score</h3><p>without skill&nbsp;&nbsp;&nbsp;&nbsp;with SkillEarth&nbsp;&nbsp;&nbsp;&nbsp;Δ pp</p></div>${rows}
  </div>`;
}

function renderTransfer() {
  const max = 66;
  document.getElementById('transferChart').innerHTML = transfer.map(group => `<article class="transfer-group">
    <div class="transfer-group-head"><div class="target-label">${logo(group.targetLogo,group.target)}<span>Evaluation model · ${group.target}</span></div><div class="base-score">w/o skill: ${fmt(group.base)}</div></div>
    <div class="transfer-column-head"><span>Skill source</span><span>General accuracy</span><span>Gain</span></div>
    <div class="transfer-rows">${group.sources.map(s => {
      const delta=s.score-group.base;
      return `<div class="transfer-row"><div class="source-label">${logo(s.logo,s.name)}<span>${s.name}</span></div><div class="pair-bars"><div class="pair-bar"><span class="base-fill" style="--w:${group.base/max*100}%"></span></div><div class="pair-bar"><span class="skill-fill" style="--w:${s.score/max*100}%"></span></div></div><div class="transfer-delta">+${fmt(delta)} pp</div></div>`;
    }).join('')}</div>
  </article>`).join('');
}

function renderResults() {
  document.querySelector('#resultsTable tbody').innerHTML = generalization.map(d => `<tr>
    <td><div class="table-model">${logo(d.logo,d.family)}${d.name}</div></td><td class="family">${d.family}</td><td>${fmt(d.base)}</td><td class="score-skill">${fmt(d.skill)}</td><td class="score-delta">+${fmt(d.skill-d.base)} pp</td>
  </tr>`).join('');
}

renderGeneralization(); renderTransfer(); renderResults();

// Decorative wireframe globe behind every section except the title hero.
document.querySelectorAll('main > section:not(.paper-hero)').forEach((sec, i) => {
  const layer = document.createElement('div');
  layer.className = 'earth-layer' + (i % 2 ? ' is-left' : '');
  layer.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  img.src = 'assets/earth-wireframe.svg';
  img.alt = '';
  layer.appendChild(img);
  sec.prepend(layer);
});

const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), {threshold:.05, rootMargin:'0px 0px -70px 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Charts draw themselves in every time they enter the viewport.
const chartObserver = new IntersectionObserver(entries => entries.forEach(e => {
  e.target.classList.toggle('is-drawn', e.isIntersecting);
}), {threshold:.15, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('#generalizationChart, #transferChart').forEach(el => chartObserver.observe(el));
const navLinks=[...document.querySelectorAll('.nav-link')];
const sections=navLinks.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${e.target.id}`));}}),{rootMargin:'-40% 0px -54% 0px'});
sections.forEach(s=>navObserver.observe(s));
const menuButton=document.getElementById('menuButton'), mobileMenu=document.getElementById('mobileMenu');
menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',open);});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));
document.getElementById('copyCitation').addEventListener('click', async e=>{const text=e.currentTarget.previousElementSibling.textContent;await navigator.clipboard.writeText(text);e.currentTarget.textContent='Copied!';setTimeout(()=>e.currentTarget.textContent='Copy BibTeX',1600);});

// The compact left guide is intentionally transient: it reacts immediately to any scroll,
// then steps out of the way quickly once scrolling stops — unless the pointer rests on it.
const floatToc = document.getElementById('floatToc');
const TOC_HIDE_DELAY = 520;     // ms after the last scroll before it fades out
const TOC_LEAVE_DELAY = 220;    // ms after the pointer leaves it
let tocTimer;
let tocHovered = false;

function hideToc() {
  clearTimeout(tocTimer);
  floatToc.classList.remove('show');
}

function scheduleHide(delay) {
  clearTimeout(tocTimer);
  if (tocHovered) return;
  tocTimer = setTimeout(() => { if (!tocHovered) floatToc.classList.remove('show'); }, delay);
}

function revealToc() {
  if (window.scrollY < 180) { hideToc(); return; }
  floatToc.classList.add('show');
  scheduleHide(TOC_HIDE_DELAY);
}

window.addEventListener('wheel', revealToc, {passive:true});
window.addEventListener('touchmove', revealToc, {passive:true});
window.addEventListener('scroll', revealToc, {passive:true});
floatToc.addEventListener('mouseenter', () => { tocHovered = true; clearTimeout(tocTimer); floatToc.classList.add('show'); });
floatToc.addEventListener('mouseleave', () => { tocHovered = false; scheduleHide(TOC_LEAVE_DELAY); });
