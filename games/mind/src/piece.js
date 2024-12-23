"use strict";

function Piece(x, y, angle, spriteNdx)
{
	this.pos = new Vec2(x, y);
	this.spriteNdx = spriteNdx;
	this.startAngle = angle;	// only needed for checking if we've rotated yet
	this.pinchAngle = this.startAngle;

	this.scale = 1;
	do
	{
		this.vel = new Vec2(randomRange(-3, 3), randomRange(-3, 3));
	}
	while(this.vel.x == 0 || this.vel.y == 0);

	this.radius = 60;
	this.offset = new Vec2(-1, -1);
	this.pinchAngleOffset = 0.0;
	this.scaleOffset = -1;
	this.PressStates = { None: 0, Pressed: 1, Pinched: 2 };
	this.pressState = this.PressStates.None;
	this.fingerId = -1;
	this.pinchId = -1;
	this.isSnapped = false;
}

Piece.prototype.isPressed = function()
{
	return this.pressState == this.PressStates.Pressed;
}

Piece.prototype.isPinched = function()
{
	return this.pressState == this.PressStates.Pinched;
}

Piece.prototype.update = function()
{
	
}

Piece.prototype.canPress = function(finger)
{
	if (this.isPinched() || this.isSnapped) return false;

	var xDist = Math.abs(finger.x - this.pos.x);
	var yDist = Math.abs(finger.y - this.pos.y);
	var dist = distance(xDist, yDist);

	return dist < this.radius;
}

Piece.prototype.getDist = function(finger)
{
	var xDist = Math.abs(finger.x - this.pos.x);
	var yDist = Math.abs(finger.y - this.pos.y);
	var dist = distance(xDist, yDist);

	return dist;
}

Piece.prototype.press = function(finger, fingerId)
{
	if (this.canPress(finger))
	{
		this.offset = new Vec2(finger.x - this.pos.x, finger.y - this.pos.y);
		this.pressState = this.PressStates.Pressed;
		this.fingerId = fingerId;
		return true;
	}
	return false;
}

Piece.prototype.pinch = function(pincher, pinchId)
{
	if (this.isSnapped) return;

	this.pinchId = pinchId;
	this.pressState = this.PressStates.Pinched;

	this.pinchAngleOffset = (Math.atan2(pincher.y - this.pos.y, pincher.x - this.pos.x)*180/Math.PI) - this.pinchAngle;

	var xDist = Math.abs(pincher.x - this.pos.x);
	var yDist = Math.abs(pincher.y - this.pos.y);
	var dist = distance(xDist, yDist);
	this.scaleOffset = (dist*0.01) - this.scale;
}

Piece.prototype.drag = function(finger)
{
	this.pos = new Vec2(finger.x - this.offset.x, finger.y - this.offset.y);

	var wallDist = this.radius;

	if (this.pos.x-wallDist < 0)
		this.pos.x = wallDist;
	if (this.pos.x+wallDist > width)
		this.pos.x = width-wallDist;
	if (this.pos.y-wallDist < 0)
		this.pos.y = wallDist;
	if (this.pos.y+wallDist > height)
		this.pos.y = height-wallDist;
}

Piece.prototype.pinchDrag = function(pincher)
{
	var angle = (Math.atan2(pincher.y - this.pos.y, pincher.x - this.pos.x)*180/Math.PI) - this.pinchAngleOffset;
	while (angle > 180) angle -= 360;
	while (angle < -180) angle += 360;
	this.pinchAngle = angle;

	var xDist = Math.abs(pincher.x - this.pos.x);
	var yDist = Math.abs(pincher.y - this.pos.y);
	var dist = distance(xDist, yDist);
	var newScale = (dist*0.01) - this.scaleOffset;
	if (newScale >= 1 && newScale < 1.7)
		this.scale = newScale;
}

Piece.prototype.release = function(isPincher)
{
	if (isPincher)
	{
		this.pinchId = -1;
		this.pinchAngleOffset = 0.0;
		this.scaleOffset = -1;
		this.pressState = this.PressStates.Pressed;
	}
	else
	{
		this.pressState = this.PressStates.None;
		this.fingerId = -1;
		this.pinchId = -1;
		this.pinchAngleOffset = 0.0;
		this.scaleOffset = -1;
		this.offset = new Vec2(-1, -1);

		if (Math.abs(this.pinchAngle - 0.0) < 20 && this.insideTargetBox())
		{
			this.isSnapped = true;
			this.resetScaleAndRotation();

			var fadeNdx = Math.abs(piecesLeft-pieces.length);
			fadeNdx = Math.floor(fadeNdx/2);
			fadeTexts[fadeNdx].fadeIn();
			piecesLeft--;
		}
	}
}

Piece.prototype.insideTargetBox = function()
{
	for (var i = 0; i < targetBoxes.length; i++)
	{
		if (targetBoxes[i].isInsideBox(this.pos, this.spriteNdx))
		{
			this.pos = targetBoxes[i].getCenter();
			return true;
		}
	}
	return false;
}

Piece.prototype.resetScaleAndRotation = function()
{
	this.pinchAngle = 0.0;
	this.scale = 1;
}

Piece.prototype.draw = function(ctx)
{
	ctx.save();

	var sprite = (this.isPressed() || this.isPinched()) ? s_glowPieces[this.spriteNdx] : s_pieces[this.spriteNdx];
	ctx.translate(this.pos.x, this.pos.y);					// translate to origin relative to current pos
	ctx.rotate(this.pinchAngle*Math.PI/180);							// do rotation, at origin
	ctx.scale(this.scale, this.scale);
	ctx.translate(-sprite.width/2, -sprite.height/2);	// move back to start pos, having completed rotation

	sprite.draw(ctx, 0, 0);
	ctx.restore();


	/*ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
	ctx.fillStyle = 'cyan';
	ctx.fill();*/
}
