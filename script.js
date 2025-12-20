// Son quand on attrape une bière
const clickSound = new Audio('success-videogame-sfx-423626.mp3');
clickSound.volume = 0.7;

let musicStarted = true;
const music = document.getElementById('xmasMusic');

function tryPlayMusic() {
    if (music) {
      const p = music.play();
      if (p && p.catch) p.catch(()=>{});
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    // Lancer les paillettes si c'est la révélation
    if (screenId === 'reveal') {
    setTimeout(() => {
        launchConfetti();
    }, 500);
}

}

function startExperience() {
    tryPlayMusic();
    showScreen('intro');

    setTimeout(() => {
        showScreen('game');
        startGame();
    }, 4000); // durée de la vidéo
}


document.body.addEventListener('click', tryPlayMusic, {once:true});

// Jeu attrape bières
let score = 0;
let gameInterval;
const basket = document.getElementById('basket');
const gameArea = document.getElementById('gameArea');

gameArea.addEventListener('mousemove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    let x = e.clientX - rect.left - 50;
    x = Math.max(0, Math.min(x, gameArea.offsetWidth - 100));
    basket.style.left = x + 'px';
});

function createBeer() {
    const beer = document.createElement('div');
    beer.classList.add('beer');
    beer.innerHTML = '🍺';
    beer.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    gameArea.appendChild(beer);

    let fallPosition = 0;
    const fallSpeed = 1 + Math.random() * 2;
    
    const fall = setInterval(() => {
        fallPosition += fallSpeed;
        beer.style.top = fallPosition + 'px';

        const beerRect = beer.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (beerRect.bottom >= basketRect.top &&
            beerRect.top <= basketRect.bottom &&
            beerRect.right >= basketRect.left &&
            beerRect.left <= basketRect.right) {
            
            clickSound.currentTime = 0;
            clickSound.play();
            
            score++;
            document.getElementById('scoreValue').textContent = score;
            beer.remove();
            clearInterval(fall);

            if (score >= 10) {
                endGame();
            }
        }

        if (fallPosition > 500) {
            beer.remove();
            clearInterval(fall);
        }
    }, 20);
}

function startGame() {
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    gameInterval = setInterval(createBeer, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    document.querySelectorAll('.beer').forEach(b => b.remove());
    setTimeout(() => showScreen('riddle'), 1000);
}

function checkAnswer() {
    const answer = document.getElementById('riddleInput').value.toLowerCase().trim();
    const hint = document.getElementById('riddleHint');
    
    if (answer === 'stéphie' || answer === 'stephie' || answer === 'steph') {
        showScreen('reveal');
    } else {
        hint.textContent = '❌ Non, Essaie encore !';
    }
}

// ===== Neige =====
const snowCanvas = document.getElementById('snow');
const ctx = snowCanvas.getContext('2d');
let flakes = [];

function resizeSnow(){
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
}

function initSnow(){
    resizeSnow();
    flakes = Array.from({length:130}, ()=>({
        x: Math.random()*snowCanvas.width,
        y: Math.random()*snowCanvas.height,
        r: Math.random()*3+0.8,
        d: Math.random()*1.2+0.2,
        swing: Math.random()*2+1
    }));
    requestAnimationFrame(animateSnow);
}

function animateSnow(){
    ctx.clearRect(0,0,snowCanvas.width,snowCanvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i=0;i<flakes.length;i++){
        const f = flakes[i];
        ctx.beginPath();
        ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fill();
        f.y += f.d;
        f.x += Math.sin((Date.now()/1000)*f.swing)*0.3;
        if (f.y>snowCanvas.height+5){
            f.y = -10;
            f.x = Math.random()*snowCanvas.width;
        }
    }
    requestAnimationFrame(animateSnow);
}

window.addEventListener('resize', ()=>{ resizeSnow(); });
initSnow();

// ===== PAILLETTES (CONFETTI) =====
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
    resizeConfetti();
    confettiParticles = [];
    
    // Créer 200 paillettes
    for (let i = 0; i < 200; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            size: Math.random() * 8 + 4,
            color: ['#FFD700', '#FFECB3', '#FFF1A8'][Math.floor(Math.random() * 3)],
            opacity: 1
        });
    }
    
    animateConfetti();
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach(p => {
        if (p.opacity > 0) {
            activeParticles++;
            
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rotation * Math.PI / 180);
            confettiCtx.globalAlpha = p.opacity;
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            confettiCtx.restore();
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.rotation += p.rotationSpeed;
            
            if (p.y > confettiCanvas.height - 100) {
                p.opacity -= 0.02;
            }
        }
    });
    
    if (activeParticles > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

window.addEventListener('resize', resizeConfetti);

function goHome() {
    showScreen('welcome');
}

function replayGame() {
    score = 0;
    document.getElementById('scoreValue').textContent = score;
    showScreen('game');
    startGame();
}
