var Snake = (function () {
    const INITIAL_TAIL = 4;
    var fixedTail = true;
    var intervalID;
    var tileCount = 20;
    var gridSize;
    const INITIAL_PLAYER = { x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) };
    var velocity = { x: 0, y: 0 };
    var player = { x: INITIAL_PLAYER.x, y: INITIAL_PLAYER.y };
    var fruit = { x: 1, y: 1 };
    var trail = [];
    var tail = INITIAL_TAIL;
    var Puntos = 0;
    var PuntosMax = 0;
    var lastAction = 'none';

    function setup() {
        canv = document.getElementById('gc');
        ctx = canv.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        game.reset();
    }

    function resizeCanvas() {
        canv.width = window.innerWidth;
        canv.height = window.innerHeight;
        gridSize = Math.floor(Math.min(canv.width, canv.height) / tileCount);
    }

    var game = {
        reset: function () {
            tail = INITIAL_TAIL;
            Puntos = 0;
            velocity.x = 0;
            velocity.y = 0;
            player.x = INITIAL_PLAYER.x;
            player.y = INITIAL_PLAYER.y;
            trail = [];
            game.RandomFruit();
        },

        action: {
            up: function () {
                if (lastAction != 'down') {
                    velocity.x = 0;
                    velocity.y = -1;
                    lastAction = 'up';
                }
            },
            down: function () {
                if (lastAction != 'up') {
                    velocity.x = 0;
                    velocity.y = 1;
                    lastAction = 'down';
                }
            },
            left: function () {
                if (lastAction != 'right') {
                    velocity.x = -1;
                    velocity.y = 0;
                    lastAction = 'left';
                }
            },
            right: function () {
                if (lastAction != 'left') {
                    velocity.x = 1;
                    velocity.y = 0;
                    lastAction = 'right';
                }
            }
        },

        RandomFruit: function () {
            fruit.x = Math.floor(Math.random() * tileCount);
            fruit.y = Math.floor(Math.random() * tileCount);
        },

        loop: function () {
            player.x += velocity.x;
            player.y += velocity.y;

            if (player.x < 0) player.x = tileCount - 1;
            if (player.x >= tileCount) player.x = 0;
            if (player.y < 0) player.y = tileCount - 1;
            if (player.y >= tileCount) player.y = 0;

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canv.width, canv.height);

            trail.push({ x: player.x, y: player.y });
            while (trail.length > tail) trail.shift();

            ctx.fillStyle = 'lime';
            trail.forEach(function (segment, index) {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                if (segment.x === player.x && segment.y === player.y && index < trail.length - 1) {
                    game.reset();
                }
            });

            if (player.x === fruit.x && player.y === fruit.y) {
                tail++;
                Puntos++;
                if (Puntos > PuntosMax) PuntosMax = Puntos;
                game.RandomFruit();
            }

            ctx.fillStyle = 'red';
            ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize - 2, gridSize - 2);

            ctx.fillStyle = 'white';
            ctx.font = "bold 18px Arial";
            ctx.fillText("Puntos: " + Puntos, 20, 30);
            ctx.fillText("Top: " + PuntosMax, 20, 50);
        }
    };

    function keyPush(evt) {
        switch (evt.keyCode) {
            case 37:
                game.action.left();
                break;
            case 38:
                game.action.up();
                break;
            case 39:
                game.action.right();
                break;
            case 40:
                game.action.down();
                break;
            case 32:
                if (intervalID) {
                    clearInterval(intervalID);
                    intervalID = null;
                } else {
                    intervalID = setInterval(game.loop, 1000 / 15);
                    document.getElementById('overlay').style.display = 'none';
                }
                break;
        }
    }

    return {
        start: function () {
            window.onload = setup;
            document.addEventListener('keydown', keyPush);
        }
    };
})();

Snake.start();
