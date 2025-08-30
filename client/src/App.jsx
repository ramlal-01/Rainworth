<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RainWorth</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
body{font-family:sans-serif;background-color:#f0f9ff;cursor:none;}
#cursor-droplet{position:fixed;width:20px;height:20px;background:rgba(14,165,233,0.5);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:0.2s;backdrop-filter:blur(1px);border:1px solid rgba(14,165,233,0.7);}
#cursor-droplet.clicked{animation:ripple 0.5s ease-out forwards;}
@keyframes ripple{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
.cloud-container{position:fixed;top:0;left:0;width:100%;height:100vh;overflow:hidden;z-index:-1;pointer-events:none;}
.cloud{position:absolute;width:200px;height:120px;background:#d1d5db;border-radius:50%;animation:drift linear infinite;}
@keyframes drift{from{left:-250px}to{left:100vw}}
.fade-in-section{opacity:0;transform:translateY(40px);transition:0.8s;}
.fade-in-section.is-visible{opacity:1;transform:translateY(0);}
.loader{border:4px solid rgba(14,165,233,0.2);border-left-color:#0ea5e9;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
#gemini-result h3{font-size:1.5rem;font-weight:bold;color:#0284c7;margin-top:1.5rem;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:2px solid #e0f2fe;}
#gemini-result ul{list-style:none;padding-left:0;}
#gemini-result li{position:relative;padding-left:1.75rem;margin-bottom:0.75rem;line-height:1.6;}
#gemini-result li::before{content:'💧';position:absolute;left:0;top:0;color:#38bdf8;font-size:1.2rem;}
</style>
</head>
<body>
<div id="cursor-droplet"></div>
<div class="cloud-container"><div class="cloud" style="top:20%;"></div><div class="cloud" style="top:50%;"></div></div>

<header id="header" class="fixed top-0 left-0 w-full p-4 bg-white/50 backdrop-blur-sm z-20">
<h1 class="text-xl font-bold">RainWorth</h1>
</header>

<main class="mt-24 p-6 fade-in-section">
<form id="assessment-form" class="flex flex-col gap-3 max-w-md">
<input type="number" id="roof-area" placeholder="Roof Area (sq.ft)" required class="p-2 border rounded">
<input type="number" id="rainfall" placeholder="Average Annual Rainfall (mm)" required class="p-2 border rounded">
<input type="number" id="household" placeholder="People in Household" required class="p-2 border rounded">
<input type="text" id="water-use" placeholder="Primary Water Use" required class="p-2 border rounded">
<button type="submit" id="submit-btn" class="bg-blue-500 text-white p-2 rounded">Generate My AI Plan</button>
</form>
<div id="loader-container" class="hidden justify-center mt-4"><div class="loader"></div></div>
<div id="gemini-result" class="mt-4"></div>
</main>

<script>
const cursorDroplet=document.getElementById('cursor-droplet');
document.addEventListener('mousemove',e=>{cursorDroplet.style.top=e.clientY+'px';cursorDroplet.style.left=e.clientX+'px';});
document.addEventListener('mousedown',()=>cursorDroplet.classList.add('clicked'));
cursorDroplet.addEventListener('animationend',()=>cursorDroplet.classList.remove('clicked'));

const header=document.getElementById('header');
window.onscroll=function(){
if(window.scrollY>50)header.classList.add('shadow-md'); else header.classList.remove('shadow-md');
};

const sections=document.querySelectorAll('.fade-in-section');
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}})},{threshold:0.1});
sections.forEach(s=>observer.observe(s));

const assessmentForm=document.getElementById('assessment-form');
const resultContainer=document.getElementById('gemini-result');
const loaderContainer=document.getElementById('loader-container');
const submitBtn=document.getElementById('submit-btn');

assessmentForm.addEventListener('submit',async e=>{
e.preventDefault();
submitBtn.disabled=true; submitBtn.textContent='Generating...';
loaderContainer.classList.remove('hidden'); resultContainer.innerHTML=''; resultContainer.style.display='none';

const roofArea=document.getElementById('roof-area').value;
const rainfall=document.getElementById('rainfall').value;
const household=document.getElementById('household').value;
const waterUse=document.getElementById('water-use').value;

try{
// For testing without API:
const generatedPlan=`*Your Potential Annual Water Collection*\n- ${roofArea*rainfall*0.6} liters approx.\n*Recommended Harvesting System*\n- Roof-top tank 1000L\n*Estimated Costs & Components*\n- Tank, Pipes, Filters\n*Your Key Benefits*\n- Water savings and sustainability`;
resultContainer.innerHTML=generatedPlan.replace(/\*(.*?)\*/g,'<strong>$1</strong>').replace(/-/g,'<li>').replace(/\n/g,'<br>');
} catch(err){console.error(err); resultContainer.innerHTML='Error generating plan';} finally{submitBtn.disabled=false;submitBtn.textContent='Generate My AI Plan'; loaderContainer.classList.add('hidden'); resultContainer.style.display='block'; resultContainer.scrollIntoView({behavior:'smooth'});}
});
</script>
</body>
</html>

