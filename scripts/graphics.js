MyGame.graphics = (function(){
    'use strict';
    
    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');
    CanvasRenderingContext2D.prototype.clear = function(){
        this.save();
        this.setTransform(1,0,0,1,0,0);
        this.clearRect(0,0, canvas.width, canvas.height);
        this.restore();
    };
    function clear(){
        context.clear();
    }

    function Texture(spec){
        var that = {};
        var image = new Image();
        
        image.onload = function(){
            that.draw = function(){
                context.save();
                context.drawImage(
                    image,
                    spec.x - 5,
                    spec.y - 5,
                    spec.width + 10,
                    spec.height + 10);
                context.restore();
            }
        };
        image.src = spec.image;
        
        that.getPosition = function(){return {x: spec.x, y: spec.y};}
        that.setPosition = function(position){
            spec.x = position.x;
            spec.y = position.y;
        }
        that.getEdge = function(){
            return { 
                top: spec.y,
                bot: spec.y + spec.height,
                left: spec.x,
                right: spec.x + spec.width
            
            };
        }

        that.draw = function() {/* Empty until ready */};

        return that;
    }

    function Rectangle(spec){
        var that = {};

        that.draw = function(){
            context.save();
            context.fillStyle = spec.fillStyle;
            context.fillRect(spec.x, spec.y, spec.width, spec.height);

            context.strokeStyle = spec.strokeStyle;
            context.lineWidth = spec.lineWidth;
            context.strokeRect(spec.x, spec.y, spec.width, spec.height);

            context.restore();
        };

        that.getPosition = function(){return {x: spec.x, y: spec.y};}
        that.setPosition = function(position){
            spec.x = position.x;
            spec.y = position.y;
        }
        that.getEdge = function(){
            return { 
                top: spec.y,
                bot: spec.y + spec.height,
                left: spec.x,
                right: spec.x + spec.width
            
            };
        }
        return that;
    }

    function Score(spec){
        var that = {};

        that.draw = function(){
            context.save();
            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);
            context.font = spec.font;
            context.fillStyle = spec.color;
            if(spec.fillText)
                context.fillText(spec.text + spec.points.toString(), spec.center.x, spec.center.y);
            else
                context.strokeText(spec.text + spec.points.toString(), spec.center.x, spec.center.y);
            context.restore();
        }

        that.updateScore = function(newPoints){ spec.points += newPoints; }

        that.getScore = function(){ return spec.points; }

        return that;
    }

    return {
        clear : clear,
        Texture : Texture,
        Rectangle : Rectangle,
        Score : Score
    };
}());