"use strict";

var
canvas,
ctx,
width,
height,
frames,
currentstate,
states =
{
	Splash: 0, Game: 1, End: 2
},
onTouchDevice;

function Finger(pos, id, isPincher)
{
	this.pos = pos;
	this.id = id;
	this.isPincher = isPincher;
}

var pieces = [],
fingers = [],
targetBoxes = [],
fadeTexts = [],
piecesLeft,
pressedFrames;

// debug stuff
var drawDebugStuff = false,
touches = 0,
printMsg = [];

function main()
{
	canvas = document.createElement("canvas");

	width = window.innerWidth;
	height = window.innerHeight;

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

	initSprites();
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
	currentstate = states.Game;
	frames = 0;
	pressedFrames = 0;

	var boxSize = 30;
	var guyLoc = new Vec2(width/2-s_guy.width/2, height/2-s_guy.height/2);
	targetBoxes.push(new TargetBox(guyLoc.x+100, guyLoc.y+69, boxSize, boxSize, 0));
	targetBoxes.push(new TargetBox(guyLoc.x+202, guyLoc.y+56, boxSize, boxSize, 1));
	targetBoxes.push(new TargetBox(guyLoc.x+155, guyLoc.y+117, boxSize, boxSize, 2));
	targetBoxes.push(new TargetBox(guyLoc.x+241, guyLoc.y+93, boxSize, boxSize, 3));
	targetBoxes.push(new TargetBox(guyLoc.x+203, guyLoc.y+175, boxSize, boxSize, 4));
	
	var doRot = onTouchDevice;
	pieces.unshift(new Piece(0.65*width, 0.698*height, doRot ? 35:0, 0));
	pieces.unshift(new Piece(0.2*width, 0.198*height, doRot ? 25:0, 1));
	pieces.unshift(new Piece(0.85*width, 0.510*height, doRot ? -30:0, 2));
	pieces.unshift(new Piece(0.15*width, 0.594*height, 0.0, 3));
	pieces.unshift(new Piece(0.7*width, 0.161*height, 0.0, 4));
	piecesLeft = pieces.length;

	for (var i = 0; i < pieces.length; i++)
		pieces[i].pos.y += 80;

	fadeTexts.push(new FadeText(0.07*width, 0.100*height, 0, s_peace));
	fadeTexts.push(new FadeText(0.433*width, 0.096*height, 0, s_of));
	fadeTexts.push(new FadeText(0.597*width, 0.102*height, 0, s_mind));

	fadeTexts.push(new FadeText(120/600*width, 860/960*height, 0, s_hold));
	fadeTexts.push(new FadeText(55/600*width, 860/960*height, 0, s_twoFingers));
}

function resetGame()
{
	currentstate = states.Game;
	pieces = [];
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

	if (pincherInList()) return;	// if we've already got a pincher, don't add any more fingers

	//printMsg.push("press");
	if (evt.touches) touches = evt.touches.length;

	var loops = onTouchDevice ? evt.touches.length : 1;
	for (var t = 0; t < loops; t++)
	{
		var fingerPos = getFinger(evt, t);
		var id = onTouchDevice ? evt.touches[t].identifier : 0;

		// check list of pieces to add a normal finger
		for (var p = pieces.length-1; p >= 0; p--)
		{
			if (!pieces[p].isPressed() && !isIdBeingUsed(id) && pieces[p].press(fingerPos, id))
			{
				fingers.push(new Finger(fingerPos, id, false));
				swapPieceToBot(p);
				break;
			}
		}

		// add a pincher finger, if possible
		if (fingers.length >= 2) return;
		for (var p = pieces.length-1; p >= 0; p--)
		{
			if (pieces[p].isPressed() && !isIdBeingUsed(id))
			{
				pieces[p].pinch(fingerPos, id);
				fingers.push(new Finger(fingerPos, id, true));
				break;
			}
		}
	}
}

function ondrag(evt)
{
	evt.preventDefault();
	//printMsg.push("drag");
	pressedFrames++;

	if (evt.touches) touches = evt.touches.length;

	for (var f = 0; f < fingers.length; f++)
	{
		for (var p = 0; p < pieces.length; p++)
		{
			if (fingers[f].id == pieces[p].fingerId ||
				fingers[f].id == pieces[p].pinchId)
			{
				var newFingerPos = onTouchDevice ? getFingerById(evt, fingers[f].id) : getFinger(evt, f);
				fingers[f].pos = newFingerPos;
				fingers[f].isPincher ? pieces[p].pinchDrag(fingers[f].pos) : pieces[p].drag(fingers[f].pos);

				if ((pressedFrames > 120) && !pincherInList() &&
					(pieces[p].pinchAngle != 0.0) && (pieces[p].pinchAngle == pieces[p].startAngle))
					fadeTexts[4].fadeIn();
			}
		}
	}
}

function onrelease(evt)
{
	//printMsg.push("release");
	if (pressedFrames < 5)
		fadeTexts[3].fadeIn();

	pressedFrames = 0;

	if (evt.touches) touches = evt.touches.length;

	for (var f = fingers.length-1; f >= 0; f--)
	{
		if (!onTouchDevice || fingers[f].id == evt.changedTouches[0].identifier)
		{
			for (var p = 0; p < pieces.length; p++)
			{
				if (pieces[p].fingerId == fingers[f].id ||
					(pieces[p].pinchId == fingers[f].id && fingers[f].isPincher))
				{
					pieces[p].release(fingers[f].isPincher);
					fingers.splice(f, 1);
					removeAllPinchers();

					return;
				}
			}
		}
	}
}

function swapPieceToBot(ndx)
{
	var temp = pieces[ndx];	// the element we want at the bottom

	for (var i = ndx; i < pieces.length-1; i++)	// start for loop at the index, don't do last element (none in front)
	{
		pieces[i] = pieces[i+1];	// replace this element with the one in front of it
	}
	pieces[pieces.length-1] = temp;	// put the desired element at the bottom
}

function removeAllPinchers()
{
	for (var f = fingers.length-1; f >= 0; f--)
	{
		if (fingers[f].isPincher) fingers.splice(f, 1);
	}
}

function pincherInList()
{
	for (var i = 0; i < fingers.length; i++)
	{
		if (fingers[i].isPincher) return true;
	}

	return false;
}

function endGame(deadPiece)
{
	currentstate = states.End;
	pieces = [];
	pieces.push(deadPiece);
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
		for (var i = 0; i < pieces.length; i++)
		{
			pieces[i].update();
		}
	}

	for (var i = 0; i < fadeTexts.length; i++)
		fadeTexts[i].update();

	if (fadeTexts[3].alpha > 0.999999)
		fadeTexts[3].fadeOut();

	if (fadeTexts[4].alpha > 0.999999)
		fadeTexts[4].fadeOut();
}

function draw()
{
	// redraw background over contents of prior frame
	ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, width, height);

	s_guy.draw(ctx, width/2-s_guy.width/2, height/2-s_guy.height/2);

	//for (var i = 0; i < targetBoxes.length; i++)
	//	targetBoxes[i].draw(ctx);

	for (var i = 0; i < pieces.length; i++)
		pieces[i].draw(ctx);

	for (var i = 0; i < fadeTexts.length; i++)
		fadeTexts[i].draw(ctx);

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
		string += ", iP: " + fingers[i].isPincher;

		ctx.fillText(string, 10, (50*i)+50);
		string = "";
	}

	ctx.fillText("touches: " + touches, 10, height-10);

	ctx.font = "20px Arial";
	for (var i = 0; i < pieces.length; i++)
	{
		string += i;
		//string += ", s: " + pieces[i].pressState;
		string += ", a: " + pieces[i].pinchAngle;

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
