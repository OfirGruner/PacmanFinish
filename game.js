//goodluck
var context;
$(document).ready(function() {
    var shown_canvas = document.getElementById("canvas");
    context = shown_canvas.getContext("2d");
});
var game_music = new Audio("gamemusic.mp3")
var shape = new Object();
var board;
var score;
var lives;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval2;
var interval3;
var lastMove = 4; // initialize direction of pacman is to the right
var smiley; // bonus character
var timeBonus;
var enemiesNumber;
var enemies;
var rows = 15;
var cols = 15;
var difficultLevel=800;
var numberOfWalls;
var timesBetweenCollisions;
var pacmanSpeed;
var lastCollision;
var time;
var food_remain;

function Ghost(row,col,name,smart){
    this.row = row;
    this.col = col;
    this.name = name;
    this.smart = smart;//todo each ghost will have different movement algorithm

}
function Smiley(row,col){
    this.row = row;
    this.col = col;
}
function TimeBonus(row,col){
    this.row = row;
    this.col = col;
}
function Pacman(row,col){
    this.row=row;
    this.col=col;
}
function applyGhostMove(i, leftToRight, upToDown) {
    var randomNum = Math.random();
    if(enemies[i].smart>randomNum) {
        if (leftToRight != 0) {
            if (board[enemies[i].row][enemies[i].col + leftToRight] != 4)
                enemies[i].col += leftToRight;
            else if (board[enemies[i].row + upToDown][enemies[i].col] != 4)
                enemies[i].row += upToDown;
        } else if (board[enemies[i].row + upToDown][enemies[i].col] != 4) {
            enemies[i].row += upToDown;
        }
    }
    else{
        var sr = enemies[i].row;
        var sc = enemies[i].col;
        var moved = false;
        while(moved == false) {
            var randomNum = Math.random();
            if (randomNum < 0.25) {
                if (board[sr + 1][sc] != 4 && !collide(sr+1,sc)) {
                    enemies[i].row++;
                    moved = true;
                }
            } else if (randomNum < 0.5) {
                if (board[sr - 1][sc] != 4 && !collide(sr-1,sc)) {
                    enemies[i].row--;
                    moved = true;
                }
            } else if (randomNum < 0.75) {
                if (board[sr][sc - 1] != 4 && !collide(sr,sc-1)) {
                    enemies[i].col--;
                    moved = true;
                }
            } else if (randomNum <= 1) {
                if (board[sr][sc + 1] != 4 && !collide(sr,sc+1)){
                    enemies[i].col++;
                    moved = true;
                }
            }
        }
    }
}
function UpdateGhostsPosition() {
    for(i = 0; i < enemies.length; i++ ) {
        var leftToRight;
        var upToDown;
        if (enemies[i].row < shape.i)
            upToDown = 1;
        else if (enemies[i].row == shape.i)
            upToDown = 0;
        else
            upToDown = -1;
        if (enemies[i].col < shape.j)
            leftToRight = 1;
        else if (enemies[i].col == shape.j)
            leftToRight = 0;
        else
            leftToRight = -1;
        applyGhostMove(i, leftToRight, upToDown);
        if(enemies[i].row==shape.i && enemies[i].col==shape.j)
            ghostAndPacmanCollide();
    }
}
function Stop() {
}
function collide(smileyRow, smileyCol) {
    for(var i = 0; i < enemies.length; i++){
        if(smileyRow == enemies[i].row && smileyCol == enemies[i].col){
            return true;
        }
    }
    return false;
}
function UpdateBonusPosition() {
    var sr = smiley.row;
    var sc = smiley.col;
    var moved = false;
    while(moved == false) {
        var randomNum = Math.random();
        if (randomNum < 0.25) {
            if (board[sr + 1][sc] != 4 && !collide(sr+1,sc)) {
                smiley.row++;
                moved = true;
            }
        } else if (randomNum < 0.5) {
            if (board[sr - 1][sc] != 4 && !collide(sr-1,sc)) {
                smiley.row--;
                moved = true;
            }
        } else if (randomNum < 0.75) {
            if (board[sr][sc - 1] != 4 && !collide(sr,sc-1)) {
                smiley.col--;
                moved = true;
            }
        } else if (randomNum <= 1) {
            if (board[sr][sc + 1] != 4 && !collide(sr,sc+1)){
                smiley.col++;
                moved = true;
            }
        }
    }
}
function numberOfEmptyCells() {
    var  count = 0;
    for(var i = 2; i < rows-2; i++){
        for(var j = 2; j < cols-2; j++){
            if(board[i][j]==0)
                count++;
        }
    }
    return count;
}
function setEnemiesLocation(enemiesNumber) {
    let ghost1 = new Ghost(1,1,"img1",0.7);
    let ghost2 = new Ghost(1,cols-2,"img2",0.5);
    let ghost3 = new Ghost(rows-2,1,"img3",0.6);
    if (enemiesNumber == 3) {
        enemies = [ghost1,ghost2,ghost3];
    }
    else if(enemiesNumber==2) {
        enemies = [ghost1,ghost2];
    }
    else if(enemiesNumber==1) {
        enemies = [ghost1];
    }
}
function setPacmanRandomLocation() {
    var emptyCell = findRandomEmptyCell(board);
    var i = emptyCell[0];
    var j = emptyCell[1];
    shape.i=i;
    shape.j=j;
    board[i][j]=2;

}
function Startt(monsters,timee,balls) {
    food_remain = balls; //todo input from user 50 to 90
    time=timee;
    enemiesNumber=monsters;
    game_music.play();
    lives=3;
    pacmanSpeed=250;
    timesBetweenCollisions=Math.max(difficultLevel,pacmanSpeed)+250;
    board = new Array();
    score = 0;
    pac_color = "yellow";
    smiley = new Smiley(rows-2,cols-2);
    var pts5 = 0.6 * food_remain;
    var pts15 = 0.3 * food_remain;
    var pts25 = food_remain - pts5 - pts15;
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < rows; i++) {
        board[i] = new Array();

    }
    for(var i = 1; i < rows-1; i++){
        for(var j = 1; j < cols-1; j++){
            board[i][j]=0;
        }
    }
    for(i=0; i < rows; i++){
        board[i][0]=4;
        board[i][cols-1]=4;

    }
    for(j=0;j<cols;j++){
        board[0][j]=4;
        board[rows-1][j]=4;

    }
    board[1][1] = 1;
    board[1][cols-2]=25;
    board[rows-2][1]=1;
    pts5-=2;
    pts25--;
    food_remain-=3;
    while(food_remain>0)
    {
        var emptyCell = findRandomEmptyCell(board);
        var i = emptyCell[0];
        var j = emptyCell[1];
        var randomNum = Math.random();
        if (randomNum <= pts25 / 100) {
            food_remain--;
            board[i][j] = 25;
            pts25--;
        } else if (randomNum <= pts15 / 100) {
            food_remain--;
            board[i][j] = 15;
            pts15--;
        } else if (randomNum <= food_remain / 100) {
            food_remain--;
            board[i][j] = 1;
            pts5--;
        } else if (randomNum < 1.0 * (pacman_remain + food_remain) / 100 && pacman_remain!=0) {//todo will always generate pacman?
            pacman_remain--;
            setPacmanRandomLocation();
        }
    }
    numberOfWalls = numberOfEmptyCells() /4;
    while (numberOfWalls > 0) {
        var emptyCelll = findRandomEmptyCell(board);
        var row = emptyCelll[0];
        var col = emptyCelll[1];
        if ( null != emptyCelll ) {
            if(row != 1 && col != 1) {
                board[row][col] = 4;//wall
                numberOfWalls--;
            }
        }
        else {
            break;
        }
    }
    var timeBonusPlace = findRandomEmptyCell(board);
    timeBonus = new TimeBonus(timeBonusPlace[0],timeBonusPlace[1]);
    setEnemiesLocation(enemiesNumber);
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(UpdatePosition, pacmanSpeed);
    interval2 = setInterval(UpdateGhostsPosition, difficultLevel);
    interval3 = setInterval(UpdateBonusPosition, difficultLevel);
}
function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * rows-1) + 1);
    var j = Math.floor((Math.random() * cols-1) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * rows-1) + 1);
        j = Math.floor((Math.random() * cols-1) + 1);
    }
    return [i,j];
}
function GetKeyPressed() {
    if (keysDown['ArrowUp']||keysDown["KeyW"]) {
        return 1;
    }
    if (keysDown['ArrowDown']||keysDown["KeyS"]) {
        return 2;
    }
    if (keysDown['ArrowLeft']||keysDown["KeyA"]) {
        return 3;
    }
    if (keysDown['ArrowRight']||keysDown["KeyD"]) {
        return 4;
    }
}
function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLives.value = lives;
    lblTotalTime.value = time;
    var squareWidth = 50;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {

            var center = new Object();
            center.x = j * squareWidth + squareWidth/2;
            center.y = i * squareWidth + squareWidth/2;

            if (board[i][j] === 2) { // pacman

                if (lastMove==1) {//up
                    var1 = 1.63
                    var2 = 1.37
                    var3 = center.x-10
                    var4 = center.y-5
                }
                else if (lastMove==2) {//down
                    var1 = 0.65
                    var2 = 0.37
                    var3 = center.x-8
                    var4 = center.y-2
                }
                else if(lastMove==3) {//left
                    var1 = 1.15
                    var2 = 0.85
                    var3 = center.x-5
                    var4 = center.y-12
                }
                else if(lastMove==4) {//right
                    var1 = 0.15
                    var2 = 1.85
                    var3 = center.x+5
                    var4 = center.y-15
                }

                context.beginPath();
                context.arc(center.x, center.y, squareWidth*3/7, var1 * Math.PI, var2 * Math.PI); // half circle - pacman face
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(var3+1, var4+5, 2.5, 0, 2 * Math.PI); // x,y,rad,??
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 1) {//food
                context.beginPath();
                context.arc(center.x, center.y, squareWidth/4, 0, 2 * Math.PI); // circle - food
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 15) {//food
                context.beginPath();
                context.arc(center.x, center.y, squareWidth/4, 0, 2 * Math.PI); // circle - food
                context.fillStyle = "red"; //color
                context.fill();
            } else if (board[i][j] === 25) {//food
                context.beginPath();
                context.arc(center.x, center.y, squareWidth/4, 0, 2 * Math.PI); // circle - food
                context.fillStyle = "blue"; //color
                context.fill();
            } else if (board[i][j] === 4) {//obstacle
                context.beginPath();
                context.rect(center.x - squareWidth/2, center.y - squareWidth/2, squareWidth, squareWidth);
                context.fillStyle = "grey"; //color
                context.fill();
            }

        }
    }
    for(i = 0 ; i < enemies.length;i++){
        var center = new Object();
        center.x = enemies[i].col * squareWidth + squareWidth/2;
        center.y = enemies[i].row * squareWidth + squareWidth/2;
        let img = new Image();
        img.src = "img"+(i+1)+".png";
        context.drawImage(img,center.x-squareWidth/2,center.y-squareWidth/2,squareWidth,squareWidth);

    }
    var centerr = new Object();
    centerr.x = smiley.col * squareWidth + squareWidth/2;
    centerr.y = smiley.row * squareWidth + squareWidth/2;
    let img = new Image();
    img.src = "smiley.png";
    context.drawImage(img,centerr.x-squareWidth/2,centerr.y-squareWidth/2,squareWidth,squareWidth);
    var centerrr = new Object();
    centerrr.x = timeBonus.col * squareWidth + squareWidth/2;
    centerrr.y = timeBonus.row * squareWidth + squareWidth/2;
    let timeBonusImage = new Image();
    timeBonusImage.src = "timeBonus.jpg";
    context.drawImage(timeBonusImage,centerrr.x-squareWidth/2,centerrr.y-squareWidth/2,squareWidth,squareWidth);
}
function timeUp() {//todo
    return (time<=time_elapsed)
}
function ghostAndPacmanCollide() {
    if (lives == 3) {
        lives--;
        lastCollision = new Date();
        score -= 10;
    } else {
        now = new Date();
        if (now - lastCollision >= timesBetweenCollisions) {
            lives--;
            lastCollision = now;
            score -= 10;
        }
    }
    board[shape.i][shape.j] = 0;
    setPacmanRandomLocation();
    if(enemiesNumber==3) {
        enemies[0].row = 1;
        enemies[0].col = 1;
        enemies[1].row = 1;
        enemies[1].col = cols - 2
        enemies[2].row = rows - 2;
        enemies[2].col = 1;
    }
    else if(enemiesNumber==2){
        enemies[0].row = 1;
        enemies[0].col = 1;
        enemies[1].row = 1;
        enemies[1].col = cols - 2
    }
    else{
        enemies[0].row = 1;
        enemies[0].col = 1;
    }
}
function UpdatePosition() {
    if (timeUp()==true){//todo
        window.clearInterval(interval);
        window.clearInterval(interval2);
        window.clearInterval(interval3);
        if(score >= 150){
        window.alert("We have a Winner!!!");
        }
        else{
            window.alert("You can do better");
        }
    }
    var x = GetKeyPressed();
    board[shape.i][shape.j] = 0;
    if (x === 1) {
        if (shape.i > 0 && board[shape.i-1][shape.j] !== 4) {
            shape.i--;
        }
    }
    else if (x === 2) {
        if (shape.i < rows-1 && board[shape.i+1][shape.j] !== 4) {
            shape.i++;
        }
    }
    else if (x === 3) {
        if (shape.j > 0 && board[shape.i][shape.j-1] !== 4) {
            shape.j--;
        }
    }
    else if (x === 4) {
        if (shape.j < cols-1 && board[shape.i][shape.j+1] !== 4) {
            shape.j++;
        }
    }
    if(x==1 || x==2 || x==3 || x==4)
        lastMove=x;
    if (board[shape.i][shape.j] === 1) {
        score+=5;
    }
    else if (board[shape.i][shape.j] === 15) {
        score+=15;
    }
    else if (board[shape.i][shape.j] === 25) {
        score+=25;
    }
    for(i=0; i < enemies.length; i++){
        if(shape.i == enemies[i].row && shape.j == enemies[i].col) {
            ghostAndPacmanCollide();

            if (lives != 0)
                break;
        }
    }
    if (lives==0){
        Draw();
        game_music.pause();
        window.clearInterval(interval);
        window.clearInterval(interval2);
        window.clearInterval(interval3);
        window.alert("Game Over");//todo
    }
    if(smiley.row==shape.i && smiley.col == shape.j) {
        score += 50;
        smiley.row=-5;
        smiley.col=-5;
    }
    if(timeBonus.row==shape.i && timeBonus.col == shape.j){
        //todo fix
        timeBonus.row=-10;
        timeBonus.col=-10;

        time = +time;
        time+=20;
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 20 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (score === 500) { // todo score == sum of all foods ..? and also when time up and score is ...
        window.clearInterval(interval);
        window.clearInterval(interval2);
        window.alert("Game completed");//todo
    } else {
        Draw();
    }
}
