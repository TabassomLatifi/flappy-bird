var cvs = document.getElementById("myCanvas");
var ctx = cvs.getContext("2d");

var frames = 0;
var degree = Math.PI / 180;

var sprite = new Image();
sprite.src = "images/Flappy-Bird-Sprites.png";

var scoreSound = new Audio();
scoreSound.src = "audio/audio_score.wav";

var dieSound = new Audio();
dieSound.src = "audio/audio_die.wav";

var hitSound = new Audio();
hitSound.src = "audio/audio_hit.wav";

var swooshSound = new Audio();
swooshSound.src = "audio/audio_swoosh.wav";

var wingSound = new Audio();
wingSound.src = "audio/audio_wing.wav";

var state = {
  current: 0,
  getReady: 0,
  game: 1,
  gameOver: 2,
};

function clickHandler() {
  switch (state.current) {
    case state.getReady:
      swooshSound.play();
      state.current = state.game;
      break;
    case state.game:
      wingSound.play();
      bird.flap();
      break;
    default:
      score.value = 0;
      bird.speed = 0;
      bird.rotation = 0;
      bird.y = 150;
      pipes.position = [];
      state.current = state.getReady;
      break;
  }
}

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", function (e) {
  if (e.which == 32) {
    clickHandler();
  }
});

var bg = {
  sX: 10,
  sY: 154,
  W: 144,
  H: 103,
  x: 0,
  y: cvs.height - 206,
  dw: 288,
  dh: 206,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.W,
      this.H,
      this.x,
      this.y,
      this.dw,
      this.dh
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.W,
      this.H,
      this.x + this.W,
      this.y,
      this.dw,
      this.dh
    );
  },
};

var fg = {
  sX: 222,
  sY: 10,
  W: 168,
  H: 56,
  x: 0,
  dx: 2,
  y: cvs.height - 112,
  dw: 336,
  dh: 112,
  draw: function () {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.W,
      this.H,
      this.x,
      this.y,
      this.dw,
      this.dh
    );
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.W,
      this.H,
      this.x + this.W,
      this.y,
      this.dw,
      this.dh
    );
  },

  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.dw / 2);
    }
  },
};

var pipes = {
  top: {
    sX: 152,
    sY: 3,
  },
  bottom: {
    sX: 180,
    sY: 3,
  },
  W: 28,
  H: 162,
  dw: 56,
  dh: 324,
  dx: 2,
  gap: 90,
  position: [],
  maxYPos: -124,
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.dh + this.gap;
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.W,
        this.H,
        p.x,
        topYPos,
        this.dw,
        this.dh
      );
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.W,
        this.H,
        p.x,
        bottomYPos,
        this.dw,
        this.dh
      );
    }
  },
  update: function () {
    if (state.current != state.game) return;
    if (frames % 150 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      p.x -= this.dx;

      let bottomPipesPos = p.y + this.dh + this.gap;

      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.dw &&
        bird.y + bird.radius > p.y &&
        bird.y - bird.radius < p.y + this.dh
      ) {
        hitSound.play();
        state.current = state.gameOver;
      }
      if (
        bird.x + bird.radius > p.x &&
        bird.x - bird.radius < p.x + this.dw &&
        bird.y + bird.radius > bottomPipesPos &&
        bird.y - bird.radius < bottomPipesPos + this.dh
      ) {
        hitSound.play();
        state.current = state.gameOver;
      }
      if (p.x + this.dw <= 0) {
        this.position.shift();
        score.value++;
        scoreSound.play();
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
};

var getReady = {
  box: {
    sX: 367,
    sY: 74,
    W: 58,
    H: 35,
    x: cvs.width / 2 - 58,
    y: cvs.height / 2 - 35,
    dw: 118,
    dh: 70,
  },
  bird: {
    sX: 385,
    sY: 43,
    W: 21,
    H: 28,
    x: cvs.width / 2 - 21,
    y: cvs.height / 2 - 98,
    dw: 42,
    dh: 56,
  },
  title: {
    sX: 254,
    sY: 71,
    W: 94,
    H: 25,
    x: cvs.width / 2 - 90,
    y: cvs.height / 2 - 158,
    dw: 188,
    dh: 50,
  },
  draw: function () {
    if (state.current == state.getReady) {
      ctx.drawImage(
        sprite,
        this.box.sX,
        this.box.sY,
        this.box.W,
        this.box.H,
        this.box.x,
        this.box.y,
        this.box.dw,
        this.box.dh
      );
      ctx.drawImage(
        sprite,
        this.bird.sX,
        this.bird.sY,
        this.bird.W,
        this.bird.H,
        this.bird.x,
        this.bird.y,
        this.bird.dw,
        this.bird.dh
      );
      ctx.drawImage(
        sprite,
        this.title.sX,
        this.title.sY,
        this.title.W,
        this.title.H,
        this.title.x,
        this.title.y,
        this.title.dw,
        this.title.dh
      );
    }
  },
};

var gameOver = {
  box: {
    sX: 260,
    sY: 195,
    W: 116,
    H: 59,
    x: cvs.width / 2 - 116,
    y: cvs.height / 2 - 59,
    dw: 230,
    dh: 118,
  },
  title: {
    sX: 152,
    sY: 173,
    W: 98,
    H: 23,
    x: cvs.width / 2 - 100,
    y: cvs.height / 2 - 123,
    dw: 196,
    dh: 46,
  },
  button: {
    sX: 267,
    sY: 139,
    W: 54,
    H: 31,
    x: cvs.width / 2 - 54,
    y: cvs.height / 2 + 80,
    dw: 108,
    dh: 62,
  },
  draw: function () {
    if (state.current == state.gameOver) {
      ctx.drawImage(
        sprite,
        this.box.sX,
        this.box.sY,
        this.box.W,
        this.box.H,
        this.box.x,
        this.box.y,
        this.box.dw,
        this.box.dh
      );
      ctx.drawImage(
        sprite,
        this.title.sX,
        this.title.sY,
        this.title.W,
        this.title.H,
        this.title.x,
        this.title.y,
        this.title.dw,
        this.title.dh
      );
      ctx.drawImage(
        sprite,
        this.button.sX,
        this.button.sY,
        this.button.W,
        this.button.H,
        this.button.x,
        this.button.y,
        this.button.dw,
        this.button.dh
      );
    }
  },
};

var bird = {
  animation: [
    { sX: 380, sY: 186 },
    { sX: 380, sY: 213 },
    { sX: 380, sY: 239 },
    { sX: 380, sY: 213 },
  ],
  W: 18,
  H: 14,
  x: 50,
  y: 150,
  dw: 36,
  dh: 28,
  speed: 0,
  gravity: 0.05,
  rotation: 0,
  animationIndex: 0,
  jump: 2,
  radius: 14,
  draw: function () {
    let bird = this.animation[this.animationIndex];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.W,
      this.H,
      -this.dw / 2,
      -this.dh / 2,
      this.dw,
      this.dh
    );
    ctx.restore();
  },
  update: function () {
    let period = state.current == state.getReady ? 10 : 5;
    this.animationIndex += frames % period == 0 ? 1 : 0;
    this.animationIndex = this.animationIndex % this.animation.length;
    this.speed += this.gravity;
    this.y += this.speed;
    if (this.speed < this.jump) {
      this.rotation = -25 * degree;
    } else {
      this.rotation = 90 * degree;
    }

    if (state.current == state.getReady) {
      this.y = 150;
      this.rotation = -25 * degree;
    } else {
      if (this.y + this.dh / 2 >= cvs.height - fg.dh) {
        this.y = cvs.height - fg.dh - this.dh / 2;
        this.animationIndex = 1;
        if (state.current == state.game) {
          dieSound.play();
          state.current = state.gameOver;
        }
      }
    }
  },
  flap: function () {
    this.speed = -this.jump;
  },
};

var score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px IMPACT";

      ctx.fillText(this.value, cvs.width / 2 - 10, 50);
      ctx.strokeText(this.value, cvs.width / 2 - 10, 50);
    } else if (state.current == state.gameOver) {
      ctx.lineWidth = 2;
      ctx.font = "25px IMPACT";

      ctx.fillText(this.value, 220, 235);
      ctx.strokeText(this.value, 220, 235);

      ctx.fillText(this.best, 220, 278);
      ctx.strokeText(this.best, 220, 278);
    }
  },
};

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function draw() {
  ctx.fillStyle = "#54c0c9";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  pipes.draw();
  fg.draw();
  getReady.draw();
  gameOver.draw();
  bird.draw();
  score.draw();
}

function animate() {
  update();
  draw();
  frames++;
  requestAnimationFrame(animate);
}

animate();
