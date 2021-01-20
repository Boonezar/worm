let SnakeBox = function(startPosition, isHead, ){
    'use strict';
    let that = {};
    let direction = { x: 0, y: 0 };
    let recentlyChangedDirections = false;
    let moveRate = 0;
    let position = startPosition;
    let time = 0;
    that.body = null;

    if(isHead){
        that.body = MyGame.graphics.Texture({
            image: 'images/sam.png',
            x: position.x,
            y: position.y,
            width: 10,
            height: 10
        });
    } else {
        that.body = MyGame.graphics.Rectangle({
            x: position.x,
            y: position.y,
            width: 10,
            height: 10,
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(0, 0, 0, 1)',
            lineWidth: 1
        });
    }

    that.move = function(elapsedTime, isHead, nextPosition){
        time += elapsedTime;
        if(time > 150){
            time -= 150;
            recentlyChangedDirections = false;
            if(isHead){
                let currentPosition = that.body.getPosition();
                that.body.setPosition({
                    x: currentPosition.x + (moveRate * direction.x),
                    y: currentPosition.y + (moveRate * direction.y)
                });
            } else {
                that.body.setPosition({
                    x: nextPosition.x,
                    y: nextPosition.y
                });
            }
            return true;
        }
        return false;
    }

    let changeDirection = function(newDirection){
        if(moveRate === 0)
            moveRate = 10;

        if(!isDirectionChangePosible(newDirection) || recentlyChangedDirections)
            return;

        if(newDirection === 'up'){
            direction.x = 0;
            direction.y = -1;
        } else if(newDirection === 'down'){
            direction.x = 0;
            direction.y = 1;
        } else if(newDirection === 'left'){
            direction.x = -1;
            direction.y = 0;
        } else if(newDirection === 'right'){
            direction.x = 1;
            direction.y = 0;
        }
        recentlyChangedDirections = true;
    }

    let isDirectionChangePosible = function(newDirection){
        if(newDirection === 'up' && direction.y === 1)
            return false;
        if(newDirection === 'down' && direction.y === -1)
            return false;
        if(newDirection === 'left' && direction.x === 1)
            return false;
        if(newDirection === 'right' && direction.x === -1)
            return false;
        return true;
    }

    that.changeLeft = function(){ changeDirection('left'); }
    that.changeRight = function(){ changeDirection('right'); }
    that.changeUp = function(){ changeDirection('up'); }
    that.changeDown = function(){ changeDirection('down'); }
    

    return that;
}