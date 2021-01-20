MyGame.screens['game-play'] = (function(game, graphics, input, persistence){
    'use strict';

    //variables
    var snake = [];
    var grid = [];
    var foodCoords;
    var addToSnake;
    var backgroundBox;
    var score;
    var points;
    var lastTimeStamp;
    var cancelNextRequest = false;
    var myKeyboard = input.Keyboard();
    var count1, count2, count3;
    var countingDown = false;
    var endGame = false;

    function initialize(){
        console.log('game initializing...');
        
        backgroundBox = graphics.Rectangle({
            x: 0,
            y: 0,
            width: 500,
            height: 500,
            rotation: 0,
            fillStyle: 'rgba(0, 0, 255, 1)',
            strokeStyle: 'rgba(255, 0, 0, 1)',
            lineWidth: 20
        });

        snake = [];
        snake.push(SnakeBox({ x: 250, y: 250 }, true));

        initializeGrid();
        randomlyPlaceFood();
        addToSnake = 0;

        score = graphics.Score({
            center: {x: 220, y: 505},
            text: "Score: ",
            font: "15px Arial",
            color: "white",
            points: 0,
            fillText: true,
            rotation: 0,
            rotationRate: 0
        });

        points = 1;

        count3 = graphics.Texture({
            image: 'images/count3.png',
            x: 220, y: 220,
            width: 60, height: 60,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });
        count2 = graphics.Texture({
            image: 'images/count2.png',
            x: 220, y: 220,
            width: 60, height: 60,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });
        count1 = graphics.Texture({
            image: 'images/count1.png',
            x: 220, y: 220,
            width: 60, height: 60,
            rotation: 0,
            moveRate: 0,
            rotateRate: 0
        });

        endGame = false;

        //keyboard / mouse inputs
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, snake[0].changeLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, snake[0].changeLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, snake[0].changeRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, snake[0].changeRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, snake[0].changeUp);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, snake[0].changeUp);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_S, snake[0].changeDown);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, snake[0].changeDown);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function(){
            //Ends game
            cancelNextRequest = true;
            game.showScreen('main-menu');
        });
    }

    function initializeGrid(){
        grid = [];
        for(let i = 0; i < 50; i++){
            grid[i] = new Array();
            for(let j = 0; j < 50; j++){
                grid[i][j] = 0;
            }
        }
        for(let i = 0; i < 15; i++){
            randomlyPlaceBlock();
        }
    }

    function randomlyPlaceBlock(){
        var randomX = Math.floor((Math.random() *48) + 1);
        var randomY = Math.floor((Math.random() *48) + 1);
        while(isNaN(grid[randomX][randomY]) || isNewBlockOnTail(randomX * 10, randomY * 10)){
            randomX = Math.floor((Math.random() *48) + 1);
            randomY = Math.floor((Math.random() *48) + 1);
        }
        grid[randomX][randomY] = GameBlock({x: randomX, y: randomY}, false);
    }

    function randomlyPlaceFood(){
        var randomX = Math.floor((Math.random() *48) + 1);
        var randomY = Math.floor((Math.random() *48) + 1);
        while(isNaN(grid[randomX][randomY]) || isNewBlockOnTail(randomX * 10, randomY * 10)){
            randomX = Math.floor((Math.random() *48) + 1);
            randomY = Math.floor((Math.random() *48) + 1);
        }
        grid[randomX][randomY] = GameBlock({x: randomX, y: randomY}, true);
        foodCoords = { x: randomX, y: randomY }
    }

    function isNewBlockOnTail(newX, newY){
        for(let i = 0; i < snake.length; i++){
            let currPos = snake[i].body.getPosition();
            if(currPos.x === newX * 10 && currPos.y === newY * 10)
                return true;
        }
        return false;
    }

    function countdown(){
        if(countingDown > 2000)
            count3.draw();
        else if(countingDown > 1000)
            count2.draw();
        else
            count1.draw();
    }

    function createFinalScore(){
        return graphics.Score({
            center: {x: 150, y: 250},
            text: "Final Score: ",
            font: "35px Arial",
            color: "red",
            points: score.getScore(),
            fillText: true,
            rotation: 0,
            rotationRate: 0
        });
    }

    function checkWallCollisions(currPos){
        if(currPos.left < 10 || currPos.right > 490 || currPos.top < 10 || currPos.bot > 490){ 
            return true;
        }
        return false;
    }
    
    function checkBlockCollisions(currPos){
        for(let i = 0; i < 50; i++){
            for(let j = 0; j < 50; j++){
                if(isNaN(grid[i][j]) && !grid[i][j].isFood){
                    let blockPos = grid[i][j].body.getEdge();
                    
                    if(currPos.top == blockPos.top 
                        && currPos.bot === blockPos.bot
                        && currPos.left === blockPos.left
                        && currPos.right == blockPos.right){
                            return true;
                        }
                }
            }
        }
        return false;
    }

    function checkTailCollisions(currPos){
        if(snake.length < 5)
            return false;
        for(let i = 1; i < snake.length; i++){
            let tailPos = snake[i].body.getEdge();

            if(currPos.top == tailPos.top 
                && currPos.bot === tailPos.bot
                && currPos.left === tailPos.left
                && currPos.right == tailPos.right){
                    return true;
                }
        }
        return false;
    }

    function checkGameEndingCollisions(){
        let currPos = snake[0].body.getEdge();
        return checkWallCollisions(currPos) 
            || checkBlockCollisions(currPos)
            || checkTailCollisions(currPos);
    }

    function checkFoodCollision(){
        let currPos = snake[0].body.getEdge();
        let blockPos = grid[foodCoords.x][foodCoords.y].body.getEdge();
        if(currPos.top == blockPos.top 
            && currPos.bot === blockPos.bot
            && currPos.left === blockPos.left
            && currPos.right == blockPos.right){
                grid[foodCoords.x][foodCoords.y] = 0;
                randomlyPlaceFood();
                return true;
            }
        return false;
    }

    function updateSnake(elapsedTime){
        let tailNextPos = snake[0].body.getPosition();
        //Move snake head
        if(snake[0].move(elapsedTime, true) && addToSnake > 0){
            snake.push(SnakeBox(tailNextPos));
            addToSnake--;
        }

        //Move snake tail
        for(let i = 1; i < snake.length; i++){
            let currPos = snake[i].body.getPosition();
            if(snake[i].move(elapsedTime, false, tailNextPos) && addToSnake > 0){
                snake.push(SnakeBox(currPos, false));
                addToSnake--;
            }
            tailNextPos = currPos;
        }
    }

    function updateScore(){
        score.updateScore(points);
        points += 3;
    }

    function update(elapsedTime){
        //updates
        if(countingDown > 0)
            countingDown -= elapsedTime;
        else if(countingDown > -100){
            countingDown = -1000;
        } else {
            updateSnake(elapsedTime);
            if(checkGameEndingCollisions())
                endGame = true;
            if(checkFoodCollision()){
                updateScore();
                addToSnake += 3;
            }
            myKeyboard.update(elapsedTime);
        }
    }

    function renderSnake(){
        for(let i = snake.length - 1; i >= 0; i--){
            snake[i].body.draw();
        }
    }

    function renderBlocks(){
        for(let i = 0; i < 50; i++){
            for(let j = 0; j < 50; j++){
                if(isNaN(grid[i][j])){
                    grid[i][j].body.draw();
                }
            }
        }
    }

    function renderScore(){
        score.draw();
    }

    function render(elapsedTime){
        graphics.clear();
        backgroundBox.draw();
        renderBlocks();
        renderSnake();
        //End Game and Enter score
        if(endGame){
            cancelNextRequest = true;
            persistence.add(Date.now(), score.getScore());
            var finalScore = createFinalScore();
            finalScore.draw();
            return;
        }
        renderScore();
        if(countingDown > 0)
            countdown();
    }
    function gameloop(time){
        update(time-lastTimeStamp);
        lastTimeStamp = time;
        render();
        if(!cancelNextRequest){
            requestAnimationFrame(gameloop);
        }
    }
    function run(){
        initialize();
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        countingDown = 3000;
        requestAnimationFrame(gameloop);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.persistence));