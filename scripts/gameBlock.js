let GameBlock = function(startPosition, food){
    'use strict';
    let that = {};
    let position = startPosition;
    let color = '';
    if(food)
        color = 'rgba(255, 165, 0, 1)';
    else 
        color = 'rgba(0, 255, 0, 1)';

    that.body = MyGame.graphics.Rectangle({
        x: position.x * 10,
        y: position.y * 10,
        width: 10,
        height: 10,
        rotation: 0,
        fillStyle: color,
        strokeStyle: 'rgba(0, 0, 0, 1)',
        lineWidth: 0
    });

    that.isFood = food;


    return that;
}