const GAME_WIDTH = 900;
const GAME_HEIGHT = 400;
const TICK_MS = 1000 / 60;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btnPlay = document.getElementById("jugar");

let animationFrameId = null;
let isRunning = false;
let lastTime = 0;
let accumulator = 0;

let frames = 0;
let score = 0;
let numTaco = 0;
let gameState = "idle";

let obstaculos = [];
let tacos = [];
let turnos = [];

const audioBack = new Audio();

const images = {
  bg: "./Imagenes/fondo1.png",
  bg2: "./Imagenes/Ciudad.png",
  trex1: "./Imagenes/trex1.png",
  trex2: "./Imagenes/trex2.png",
  obstaculo_roca: "./Imagenes/roca1.png",
  obstaculo_tronco: "./Imagenes/tronco1.png",
  taco: "./Imagenes/taco.png",
  obstaculo_carro1: "./Imagenes/carro1.png",
  obstaculo_carro2: "./Imagenes/carro2.png"
};

function getWorldSpeed() {
  if (frames > 3000) return 6;
  if (frames > 2000) return 5;
  if (frames > 1000) return 4;
  return 3.5;
}

function Board() {
  this.x = 0;
  this.y = 0;
  this.width = GAME_WIDTH;
  this.height = GAME_HEIGHT;
  this.image = new Image();
  this.image.src = images.bg;

  this.draw = function () {
    this.x -= getWorldSpeed() * 0.35;
    if (this.x < -this.width) this.x = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
  }.bind(this);

  this.drawHud = function () {
    ctx.fillStyle = "#101820";
    ctx.font = "bold 20px 'Trebuchet MS', sans-serif";
    ctx.fillText("Tacos: " + numTaco, 24, 34);
    ctx.fillText("Score: " + score, 24, 62);

    if (gameState === "paused") {
      ctx.fillStyle = "rgba(16, 24, 32, 0.75)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "#fdf8df";
      ctx.font = "bold 48px 'Trebuchet MS', sans-serif";
      ctx.fillText("PAUSA", 360, 170);
      ctx.font = "bold 18px 'Trebuchet MS', sans-serif";
      ctx.fillText("Presiona P para continuar", 330, 210);
    }
  };
}

function Trex() {
  this.x = 100;
  this.y = 215;
  this.width = 65;
  this.height = 100;
  this.which = false;

  this.img1 = new Image();
  this.img1.src = images.trex1;
  this.img2 = new Image();
  this.img2.src = images.trex2;

  this.draw = function () {
    this.boundaries();
    const img = this.which ? this.img1 : this.img2;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    if (frames % 12 === 0) this.which = !this.which;
  };

  this.boundaries = function () {
    if (this.y < 215) this.y = 215;
    if (this.y > 300) this.y = 300;
  };

  this.isTouching = function (item) {
    return (
      this.x + 20 < item.x + item.width &&
      this.x + this.width - 10 > item.x &&
      this.y + this.height * 0.85 < item.y + item.height &&
      this.y + this.height > item.y + 7
    );
  };
}

function Obstaculo(y, src, width, height) {
  this.x = GAME_WIDTH;
  this.y = y;
  this.width = width || 30;
  this.height = height || 30;
  this.image = new Image();
  this.image.src = src || images.obstaculo_roca;

  this.update = function () {
    this.x -= getWorldSpeed();
  };

  this.draw = function () {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}

function Taco(y) {
  this.x = GAME_WIDTH;
  this.y = y;
  this.width = 35;
  this.height = 30;
  this.image = new Image();
  this.image.src = images.taco;

  this.update = function () {
    this.x -= getWorldSpeed();
  };

  this.draw = function () {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}

let bg = new Board();
let tRex = new Trex();

function startAudio() {
  audioBack.pause();
  audioBack.currentTime = 0;
  audioBack.src = "./Audio/quiero_tacos.mp3";
  audioBack.play();
  audioBack.onended = function () {
    audioBack.src = "./Audio/gorillaz-on-melancholy-hill-instrumental.mp3";
    audioBack.load();
    audioBack.play();
  };
}

function stopAudio() {
  audioBack.pause();
  audioBack.currentTime = 0;
}

function resetGame() {
  obstaculos = [];
  tacos = [];
  numTaco = 0;
  frames = 0;
  score = 0;
  bg = new Board();
  tRex = new Trex();
}

function start() {
  if (gameState === "playing") return;

  resetGame();
  gameState = "playing";
  startAudio();
  startLoop();
  btnPlay.classList.add("ocultar");
}

function startLoop() {
  if (isRunning) return;
  isRunning = true;
  lastTime = 0;
  accumulator = 0;
  animationFrameId = requestAnimationFrame(loop);
}

function stopLoop() {
  isRunning = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function loop(timestamp) {
  if (!isRunning) return;

  if (!lastTime) lastTime = timestamp;
  accumulator += timestamp - lastTime;
  lastTime = timestamp;

  while (accumulator >= TICK_MS) {
    update();
    accumulator -= TICK_MS;
  }

  render();
  animationFrameId = requestAnimationFrame(loop);
}

function update() {
  if (gameState !== "playing") return;

  frames += 1;

  if (frames % 50 === 0) {
    score += 1;
  }

  if (score >= 50) {
    bg.image.src = images.bg2;
  }

  generarObstaculos();
  generarTacos();

  for (let i = 0; i < obstaculos.length; i += 1) {
    obstaculos[i].update();
  }

  for (let i = 0; i < tacos.length; i += 1) {
    tacos[i].update();
  }

  obstaculos = obstaculos.filter((item) => item.x + item.width > -20);
  tacos = tacos.filter((item) => item.x + item.width > -20);

  checkTrexCollision();
}

function render() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  bg.draw();

  for (let i = 0; i < obstaculos.length; i += 1) {
    obstaculos[i].draw();
  }

  for (let i = 0; i < tacos.length; i += 1) {
    tacos[i].draw();
  }

  tRex.draw();
  bg.drawHud();
}

function gameOver() {
  gameState = "gameover";
  stopLoop();
  stopAudio();

  const audio = new Audio("./Audio/mis_tacos.mp3");
  audio.play();

  turnos.push(numTaco);

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 84px Monaco";
  ctx.fillText("GAME OVER", 190, 130);

  ctx.font = "bold 36px Monaco";
  ctx.fillText("Tacos: " + numTaco, 340, 190);

  if (turnos.length === 2) {
    ctx.fillText("Jugador 1 -- Tacos " + turnos[0], 230, 250);
    ctx.fillText("Jugador 2 -- Tacos " + turnos[1], 230, 300);
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 18px Monaco";
    ctx.fillText("Enter para reiniciar ronda", 315, 350);
    turnos = [];
  } else {
    ctx.fillText("Jugador 1 -- Tacos " + turnos[0], 230, 260);
    ctx.fillStyle = "#ffd166";
    ctx.font = "bold 18px Monaco";
    ctx.fillText("Enter para turno de jugador 2", 295, 340);
  }
}

function generarObstaculos() {
  if (frames % 101 === 0) {
    if (score <= 50) {
      const y = Math.floor(Math.random() * 60 + 300);
      obstaculos.push(new Obstaculo(y));
    } else {
      const y = Math.floor(Math.random() * 55 + 300);
      obstaculos.push(new Obstaculo(y, images.obstaculo_carro1, 50, 50));
    }
  }

  if (frames % 211 === 0) {
    if (score <= 50) {
      const y = Math.floor(Math.random() * 60 + 300);
      obstaculos.push(new Obstaculo(y, images.obstaculo_tronco));
    } else {
      const y = Math.floor(Math.random() * 55 + 300);
      obstaculos.push(new Obstaculo(y, images.obstaculo_carro2, 50, 50));
    }
  }
}

function generarTacos() {
  if (frames % 307 === 0) {
    const y = Math.floor(Math.random() * 60 + 300);
    tacos.push(new Taco(y));
  }
}

function checkTrexCollision() {
  for (let i = 0; i < obstaculos.length; i += 1) {
    if (tRex.isTouching(obstaculos[i])) {
      gameOver();
      return;
    }
  }

  for (let i = tacos.length - 1; i >= 0; i -= 1) {
    if (tRex.isTouching(tacos[i])) {
      tacos.splice(i, 1);
      numTaco += 1;
    }
  }
}

function drawCover() {
  const img = new Image();
  img.src = images.bg;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, GAME_WIDTH, GAME_HEIGHT);
  };
}

function handleKeyDown(event) {
  const code = event.code || "";
  const keyCode = event.keyCode;

  if (code === "Enter" || keyCode === 13) {
    start();
    return;
  }

  if ((code === "KeyP" || keyCode === 80) && gameState !== "gameover" && isRunning) {
    gameState = gameState === "paused" ? "playing" : "paused";
    return;
  }

  if (gameState !== "playing") return;

  if (code === "ArrowUp" || code === "ArrowLeft" || keyCode === 38 || keyCode === 37) {
    event.preventDefault();
    tRex.y -= 25;
  }

  if (code === "ArrowDown" || code === "ArrowRight" || keyCode === 40 || keyCode === 39) {
    event.preventDefault();
    tRex.y += 25;
  }
}

window.addEventListener("keydown", handleKeyDown);

btnPlay.onclick = function () {
  start();
};

drawCover();
