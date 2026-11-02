const loader=document.querySelector('.loader');const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function split(el){const t=el.dataset.split;el.setAttribute('aria-label',t);el.innerHTML=[...t].map((c,i)=>`<span class="ch" aria-hidden="true"><i style="--i:${i}">${c===' '?'&nbsp;':c}</i></span>`).join('')}
document.querySelectorAll('[data-split]').forEach(split);
let introEnded=false;function endIntro(){if(introEnded)return;introEnded=true;loader.classList.add('done');document.body.classList.add('ready');setTimeout(()=>document.querySelectorAll('.letterbox').forEach(b=>b.classList.add('open')),600);startReel()}
setTimeout(()=>loader.classList.add('split-on'),250);
window.addEventListener('load',()=>setTimeout(endIntro,reduce?200:2300));
loader.querySelector('.loader-skip').addEventListener('click',endIntro);addEventListener('keydown',e=>{if(e.key==='Escape')endIntro()});
const endIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('split-on');endIO.unobserve(e.target)}}),{threshold:.4});document.querySelectorAll('.the-end span,.the-end em').forEach(el=>endIO.observe(el));
/* hero showreel: set data-src (and data-mobile-src) on .hero-video to enable */
const hero=document.querySelector('.hero'),reel=document.querySelector('.hero-video'),reelBtn=document.querySelector('.reel-toggle');
function startReel(){const small=matchMedia('(max-width:650px)').matches,src=(small&&reel.dataset.mobileSrc)||reel.dataset.src;if(!src||reduce)return;reel.src=src;reel.play().then(()=>hero.classList.add('has-video')).catch(()=>{})}
reelBtn.addEventListener('click',()=>{const p=reel.paused;p?reel.play():reel.pause();reelBtn.textContent=p?'Pause reel':'Play reel'});

document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');if(matchMedia('(pointer:fine)').matches){window.addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px'});document.querySelectorAll('a,button,.project-card').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))})}
document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.08}px,${y*.12}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
const modal=document.querySelector('.project-modal');document.querySelectorAll('.project-card').forEach(card=>{card.addEventListener('click',()=>openProject(card));card.addEventListener('keydown',e=>{if(e.key==='Enter')openProject(card)})});const player=document.querySelector('.modal-player');
function openProject(card){const v=card.dataset.video;modal.classList.toggle('has-video',!!v);player.innerHTML='';if(v){player.innerHTML=/\.(mp4|webm)$/i.test(v)?`<video src="${v}" controls autoplay playsinline></video>`:`<iframe src="${v}" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen title="Project video"></iframe>`}modal.classList.add('open')}
function closeModal(){modal.classList.remove('open');player.innerHTML=''}document.querySelector('.modal-close').addEventListener('click',closeModal);document.querySelector('.modal-backdrop').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const revealEls=document.querySelectorAll('.section-kicker,.section-heading,.project-card,.service-row,.about-copy,.contact-main');const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');io.unobserve(entry.target)}}),{threshold:.12});revealEls.forEach(el=>{el.classList.add('reveal');io.observe(el)});

/* spotlight, 3D tilt, film strip, before/after */
const fine=matchMedia('(pointer:fine)').matches;
if(fine&&!reduce){const sp=document.createElement('div');sp.className='spotlight';document.body.appendChild(sp);let tx=0,ty=0,cx=0,cy=0;addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;sp.classList.add('on')});document.addEventListener('mouseleave',()=>sp.classList.remove('on'));(function loop(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;sp.style.setProperty('--sx',cx+'px');sp.style.setProperty('--sy',cy+'px');requestAnimationFrame(loop)})();
document.querySelectorAll('.project-card').forEach(card=>{const img=card.querySelector('.project-image');card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform=`perspective(900px) rotateY(${(x-.5)*7}deg) rotateX(${(.5-y)*7}deg) translateZ(6px)`;const ir=img.getBoundingClientRect();img.style.setProperty('--mx',e.clientX-ir.left+'px');img.style.setProperty('--my',e.clientY-ir.top+'px')});card.addEventListener('mouseleave',()=>card.style.transform='')})}
const track=document.querySelector('.film-track');const cards=[...document.querySelectorAll('.project-card')];
track.innerHTML=[0,1,2,3].flatMap(()=>cards).map(c=>`<button class="film-frame" data-i="${cards.indexOf(c)}" aria-label="Play ${c.querySelector('h3').textContent}"><small>${c.querySelector('.project-index').textContent}</small><b>${c.querySelector('h3').textContent}</b><span>▶</span></button>`).join('');
track.addEventListener('click',e=>{const f=e.target.closest('.film-frame');if(f)openProject(cards[f.dataset.i])});
/* cinematic extras: letterbox, scroll progress, timecode HUD */
if(!reduce){['t','b'].forEach(k=>{const d=document.createElement('div');d.className='letterbox '+k;document.body.appendChild(d)})}
const lb=()=>document.querySelectorAll('.letterbox').forEach(b=>b.classList.add('open'));
const bar=document.createElement('div');bar.className='progress';const hud=document.createElement('div');hud.className='hud';document.body.append(bar,hud);
let tk=false;function tick(){tk=false;const y=scrollY,m=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform=`scaleX(${Math.min(1,y/m)})`;const f=Math.floor(y/6),p=n=>String(n).padStart(2,'0');hud.innerHTML=`<i></i>REC ${p(Math.floor(f/1800)%100)}:${p(Math.floor(f/30)%60)}:${p(f%30)}`}
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(tick)}},{passive:true});tick();

const baBox=document.querySelector('.ba-box'),baRange=baBox.querySelector('.ba-range');baRange.addEventListener('input',()=>baBox.style.setProperty('--p',baRange.value+'%'));
