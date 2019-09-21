var scoreMap = new Array(256), n, m, maze;
var cellSize, cellSized2, colorMap = new Array(256), rotationMap = new Array(256);
var pause = false, nextStep = false, finished = true, movementDelay = 1, pauseDelay = 10;
var currentI, currentJ, currentScore, bestScore;
let di = [0, 1, 0, -1], dj = [1, 0, -1, 0];
let dir = ['>', 'v', '<', '^'];

function preload() {
  input = loadStrings("in");
  console.log(input);
}

function setup() {
  createCanvas(900, 600);
  angleMode(DEGREES);
  textSize(22);

  n = split(input[0], " ")[0], m = split(input[0], " ")[1];
  maze = new Array(n);
  for (var i = 0; i < n; i ++) {
    maze[i] = new Array(m);
    for (var j = 0; j < m; j ++)
      maze[i][j] = input[i + 1][j];
  }
  for (var i = 0; i < 256; i ++) scoreMap[i] = 0;
  scoreMap['.'] = 0, scoreMap['b'] = 1, scoreMap['p'] = 5, scoreMap['o'] = 10, scoreMap['d'] = 50;
  colorMap['b'] = color(205, 127, 50), colorMap['p'] = color(192, 192, 192);
  colorMap['o'] = color(255, 215, 0), colorMap['d'] = color(0, 255, 255);
  colorMap['y'] = color(0, 0, 255);
  rotationMap['^'] = 180, rotationMap['v'] = 0, rotationMap['>'] = 270, rotationMap['<'] = 90;

  cellSize = min(width, height) / max(n, m);
  cellSized2 = cellSize / 2.0;
}

function drawArrow(i, j) {
  push();
    translate(j * cellSize + cellSized2, i * cellSize + cellSized2);
    rotate(rotationMap[maze[i][j]]);
    rect(-cellSized2 / 8.0, -cellSized2 / 2.0, cellSized2 / 4.0, cellSized2 / 2.0);
    triangle(-cellSized2 / 4.0, 0, cellSized2 / 4.0, 0, 0, cellSized2 / 2.0);
  pop();
}

function drawCell(i, j) {
  fill(255, 255, 255);
  if (maze[i][j] == '#')
    fill(50, 50, 50);
  rect(j * cellSize, i * cellSize, cellSize, cellSize);

  if (maze[i][j] == '^' || maze[i][j] == 'v' || maze[i][j] == '>' || maze[i][j] == '<') {
    fill(255, 0, 255);
    drawArrow(i, j);
  } else if (maze[i][j] >= 'a' && maze[i][j] <= 'z') {
    fill(colorMap[maze[i][j]])
    ellipse(j * cellSize + cellSized2, i * cellSize + cellSized2, cellSized2);
  }
}

function drawMaze() {
  for (var i = 0; i < n; i ++)
    for (var j = 0; j < m; j ++)
      drawCell(i, j);
}

function draw() {
  background(255 * pause, 255 * !pause, 0);

  drawMaze();

  fill(0, 0, 0);
  text("current: (" + str(currentI) + ", " + str(currentJ) + ") " + str(currentScore), width - 290, 50);
  text("best: " + str(bestScore), width - 290, 100);

  text("s - start", width - 290, 400);
  text("p - pause", width - 290, 450);
  text("n - next step", width - 290, 500);
}

function keyReleased() {
  if (key == 'p' || key == 'P')
    pause = !pause, nextStep = false;
  if (key == 'n' || key == 'N')
    pause = false, nextStep = true;
  if ((key == 's' || key == 'S') && finished) {
    bestScore = 0, finished = false;
    go();
  }
}

function checkNextStep() {
  if (nextStep == true)
    pause = true, nextStep = false;
}

async function sleep(ms) {
  if (ms)
    return new Promise((resolve, reject) => {
      setTimeout(function() { resolve(); }, ms);
    });
}

async function drawDelay() {
  while (pause) await sleep(pauseDelay);
  await sleep(movementDelay);
}

function invalid(ni, nj) {
  return ni < 0 || nj < 0 || ni >= n || nj >= m ||
         maze[ni][nj] == '#' || maze[ni][nj] == 'y' ||
         maze[ni][nj] == '<' || maze[ni][nj] == '>' ||
         maze[ni][nj] == 'v' || maze[ni][nj] == '^';

}

async function go(i = 0, j = 0, score = 0) {
  console.log(str(i) + " " + str(j) + " " + str(score));
  checkNextStep();

  let prv = maze[i][j];
  score += scoreMap[maze[i][j]];
  currentI = i, currentJ = j, currentScore = score, bestScore = max(bestScore, score);
  
  maze[i][j] = 'y';
  await drawDelay();

  for (var k = 0; k < 4; k ++) {
    let ni = i + di[k], nj = j + dj[k];
    if (invalid(ni, nj)) continue;

    maze[i][j] = dir[k]
    await go(ni, nj, score);

    maze[i][j] = 'y';
    await drawDelay();
  }
  
  maze[i][j] = prv;
  currentI = i, currentJ = j, currentScore = score;
  checkNextStep();
  if (i == 0 && j == 0) finished = true;
}