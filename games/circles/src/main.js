"use strict";

var
canvas,
ctx,
width,
height,
sf,
frames,
currentstate,
states =
{
	Splash: 0, Game: 1, End: 2
},
onTouchDevice;

function Finger(pos, id)
{
	this.pos = pos;
	this.id = id;
}

var bombs = [],
fingers = [],
targetBoxes = [],
score = [0, 0];

// debug stuff
var drawDebugStuff = false,
touches = 0,
printMsg = [];

function main()
{
	canvas = document.createElement("canvas");

	width = window.innerWidth;
	height = window.innerHeight;

	if (width >= 500)
	{
		width = 320;
		height = 480;
		//canvas.style.border = "1px solid #000";
	}
	sf = width/320;

	var evtPress = "mousedown";
	var evtDrag = "mousemove";
	var evtRelease = "mouseup";
	onTouchDevice = isTouchDevice();
	if (onTouchDevice)
	{
		evtPress = "touchstart";
		evtDrag = "touchmove";
		evtRelease = "touchend";
	}
	document.addEventListener(evtPress, onpress);
	document.addEventListener(evtDrag, ondrag);
	document.addEventListener(evtRelease, onrelease);

	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	initSprites(sf);
	init();
	loop();
}

function isTouchDevice()
{
	return 'ontouchstart' in window        // works on most browsers 
		|| navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

function init()
{
	currentstate = states.Splash;
	frames = 0;

	var boxSize = 120*sf;
	targetBoxes.push(new TargetBox((width/2)-(boxSize/2), height-boxSize, boxSize, boxSize, colors.cyan));
	targetBoxes.push(new TargetBox((width/2)-(boxSize/2), 0, boxSize, boxSize, colors.magenta));
}

function resetGame()
{
	currentstate = states.Game;
	score = [0, 0];
	bombs = [];
}

function addBomb()
{
	var radius = 28*sf;
	var side = randomRange(0, 2);
	var spawnX = side == 0 ? -radius : width+radius;
	var color = randomRange(0, 2);	//side == 0 ? colors.cyan : colors.magenta;
	bombs.unshift(new Bomb(spawnX, height/2, radius, color));
}

function addScore(ndx)
{
	score[ndx]++;
}

function randomRange(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getMousePos(canvas, evt)
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left, 
		y: evt.clientY - rect.top
	};
}

function getFinger(evt, i)
{
	return new Vec2(
		onTouchDevice ? evt.touches[i].pageX : getMousePos(canvas, evt).x,
		onTouchDevice ? evt.touches[i].pageY : getMousePos(canvas, evt).y
	);
}

function getFingerById(evt, id)
{
	for (var i = 0; i < evt.touches.length; i++)
	{
		if (evt.touches[i].identifier == id)
			return new Vec2(evt.touches[i].pageX, evt.touches[i].pageY);
	}
}

function isIdBeingUsed(id)
{
	for (var i = 0; i < fingers.length; i++)
	{
		if (fingers[i].id == id)
			return true;
	}
	return false;
}

function onpress(evt)
{
	if (currentstate == states.Splash || currentstate == states.End)
	{
		resetGame();
		return;
	}

	//printMsg.push("press");
	if (evt.touches) touches = evt.touches.length;

	var loops = onTouchDevice ? evt.touches.length : 1;
	for (var t = 0; t < loops; t++)
	{
		for (var b = bombs.length-1; b >= 0; b--)
		{
			var fingerPos = getFinger(evt, t);
			var id = onTouchDevice ? evt.touches[t].identifier : 0;
			if (!bombs[b].pressed && !isIdBeingUsed(id) && bombs[b].press(fingerPos, id))
			{
				fingers.push(new Finger(fingerPos, id));
				swapBombToBot(b);
				break;
			}
		}
	}
}

function ondrag(evt)
{
	//printMsg.push("drag");
	if (evt.touches) touches = evt.touches.length;

	for (var f = 0; f < fingers.length; f++)
	{
		for (var b = 0; b < bombs.length; b++)
		{
			if (fingers[f].id == bombs[b].fingerId)
			{
				var newFingerPos = onTouchDevice ? getFingerById(evt, fingers[f].id) : getFinger(evt, f);
				fingers[f].pos = newFingerPos;
				bombs[b].drag(fingers[f].pos);
			}
		}
	}
}

function onrelease(evt)
{
	//printMsg.push("release");
	if (evt.touches) touches = evt.touches.length;

	for (var f = 0; f < fingers.length; f++)
	{
		if (!onTouchDevice || fingers[f].id == evt.changedTouches[0].identifier)
		{
			for (var b = 0; b < bombs.length; b++)
			{
				if (bombs[b].fingerId == fingers[f].id)
				{
					fingers.splice(f, 1);
					bombs[b].release();
					return;
				}
			}
		}
	}
}

function swapBombToBot(ndx)
{
	var temp = bombs[ndx];	// the element we want at the bottom

	for (var i = ndx; i < bombs.length-1; i++)	// start for loop at the index, don't do last element (none in front)
	{
		bombs[i] = bombs[i+1];	// replace this element with the one in front of it
	}
	bombs[bombs.length-1] = temp;	// put the desired element at the bottom
}

function endGame(deadBomb)
{
	currentstate = states.End;
	bombs = [];
	bombs.push(deadBomb);
}

function loop()
{
	frames++;
	update();
	draw();

	window.requestAnimationFrame(loop, canvas);
}

function update()
{
	while (printMsg.length > 6)
		printMsg.shift();

	if (currentstate == states.Game)
	{
		if (frames % 50 == 0)
			addBomb();

		for (var i = 0; i < bombs.length; i++)
		{
			if (bombs[i].getDestroyed)
			{
				bombs.splice(i, 1);
				continue;
			}

			bombs[i].update();
		}
	}
}

function draw()
{
	// redraw background over contents of prior frame
	ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, width, height);

	for (var i = 0; i < targetBoxes.length; i++)
		targetBoxes[i].draw(ctx);

	if (currentstate == states.Game)
	{
		ctx.font = "52px Arial";
		ctx.textAlign = "center";

		for (var i = 0; i < targetBoxes.length; i++)
		{
			ctx.fillStyle = targetBoxes[i].color == 0 ? "cyan" : "magenta";
			ctx.fillText(score[i], width/2, targetBoxes[i].pos.y + (targetBoxes[i].size.y/2)+16);
		}
	}

	for (var i = 0; i < bombs.length; i++)
		bombs[i].draw(ctx);

	if (currentstate == states.Splash)
	{
		ctx.fillStyle = "cyan";
		ctx.font = "48px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Circles", width/2, height/2);
	}
	if (currentstate == states.End)
	{
		ctx.fillStyle = "magenta";
		ctx.font = "48px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Final score:", width/2, (height/2)-20);
		ctx.fillStyle = "cyan";
		ctx.fillText(score[0]+score[1], width/2, (height/2)+40);
	}

	if (drawDebugStuff)
		drawDebug();
}

function drawDebug()
{
	ctx.fillStyle = '#fff';
	ctx.font = "30px Arial";
	ctx.textAlign = "left";

	var string = "";
	for (var i = 0; i < fingers.length; i++)
	{
		string += i;
		string += ", id: " + fingers[i].id;

		ctx.fillText(string, 10, (50*i)+50);
		string = "";
	}

	ctx.fillText("touches: " + touches, 10, height-10);

	ctx.font = "20px Arial";
	for (var i = 0; i < bombs.length; i++)
	{
		string += i;
		string += ", id: " + bombs[i].fingerId;

		ctx.fillText(string, width-100, (35*i)+35);
		string = "";
	}

	for (var i = printMsg.length-1; i >= 0; i--)
	{
		string += printMsg[i];

		ctx.fillText(string, width-100, (35*(printMsg.length-i))+250);
		string = "";
	}
}

main();
