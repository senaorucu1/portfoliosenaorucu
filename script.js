const header = document.querySelector('header');
function onScroll(){
  if(window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------- custom cursor ---------- */
if(!isTouch){
  const cursor = document.getElementById('cursor');
  const label = document.getElementById('cursorLabel');
  let mx=innerWidth/2, my=innerHeight/2, cx=mx, cy=my;
  window.addEventListener('mousemove', e=>{mx=e.clientX; my=e.clientY;});
  function tick(){
    cx += (mx-cx)*0.2; cy += (my-cy)*0.2;
    cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    label.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      cursor.classList.add('grow');
      const l = el.dataset.label;
      if(l){ label.textContent = l; label.classList.add('show'); }
    });
    el.addEventListener('mouseleave', ()=>{
      cursor.classList.remove('grow');
      label.classList.remove('show');
      el.style.transform = '';
    });
    if(!reduceMotion){
      el.addEventListener('mousemove', e=>{
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width/2);
        const relY = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${relX*0.18}px, ${relY*0.28}px)`;
      });
    }
  });
}

/* ---------- kinetic headline tilt ---------- */
if(!reduceMotion && !isTouch){
  const heroSection = document.querySelector('.hero');
  const wrap = document.getElementById('headlineWrap');
  if(heroSection && wrap){
    heroSection.addEventListener('mousemove', e=>{
      const r = heroSection.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      wrap.style.transform = `rotateY(${px*6}deg) rotateX(${-py*6}deg)`;
    });
    heroSection.addEventListener('mouseleave', ()=>{ wrap.style.transform = ''; });
  }
}

/* ---------- warping grid canvas (signature element) ---------- */
const canvas = document.getElementById('grid-canvas');
if(canvas && !reduceMotion){
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
  const spacing = 44;

  function build(){
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    dots = [];
    const cols = Math.ceil(w/ (spacing*devicePixelRatio)) + 2;
    const rows = Math.ceil(h/ (spacing*devicePixelRatio)) + 2;
    for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
        const ox = i*spacing*devicePixelRatio;
        const oy = j*spacing*devicePixelRatio;
        dots.push({ox,oy,x:ox,y:oy});
      }
    }
  }
  build();
  window.addEventListener('resize', build);

  let px = -9999, py = -9999;
  canvas.addEventListener('mousemove', e=>{
    const r = canvas.getBoundingClientRect();
    px = (e.clientX - r.left) * devicePixelRatio;
    py = (e.clientY - r.top) * devicePixelRatio;
  });
  canvas.addEventListener('mouseleave', ()=>{ px=-9999; py=-9999; });

  const radius = 170 * devicePixelRatio;

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(245,244,250,0.5)';
    for(const d of dots){
      const dx = d.x - px, dy = d.y - py;
      const dist = Math.hypot(dx,dy);
      if(dist < radius){
        const force = (1 - dist/radius);
        const angle = Math.atan2(dy,dx);
        const push = force * 26 * devicePixelRatio;
        d.x += (Math.cos(angle)*push - (d.x-d.ox)) * 0.18;
        d.y += (Math.sin(angle)*push - (d.y-d.oy)) * 0.18;
      } else {
        d.x += (d.ox - d.x) * 0.08;
        d.y += (d.oy - d.y) * 0.08;
      }
      const r = 1.4 * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ---------- case study side-nav active tracking ---------- */
const sideNavLinks = document.querySelectorAll('.case-side-nav a');
if(sideNavLinks.length){
  const secIO = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      const link = document.querySelector(`.case-side-nav a[href="#${en.target.id}"]`);
      if(link && en.isIntersecting){
        sideNavLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {rootMargin:'-35% 0px -50% 0px'});
  document.querySelectorAll('.case-section[id]').forEach(s=>secIO.observe(s));
}
