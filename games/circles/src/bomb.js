"use strict";

function Bomb(x, y, radius, color)
{
	this.pos = new Vec2(x, y);
	do
	{
		this.vel = new Vec2(randomRange(-3, 3), randomRange(-3, 3));
	}
	while(this.vel.x == 0 || this.vel.y == 0);

	this.offset = new Vec2(-1, -1);
	this.radius = radius;
	this.color = color;
	this.pressed = false;
	this.fingerId = -1;
	this.getDestroyed = false;
	this.timeArc = (3*Math.PI)/2;
}

Bomb.prototype.update = function()
{
	if (!this.pressed)
	{
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

		//this.pos.x += (width - this.pos.x) * .1;
	}

	if ((this.vel.x > 0 && this.pos.x-this.radius > 0) || 
		(this.vel.x < 0 && this.pos.x+this.radius < width))
	{
		if (this.pos.x-this.radius < 0 || this.pos.x+this.radius > width)
			this.vel.x *= -1;
		if (this.pos.y-this.radius < 0 || this.pos.y+this.radius > height)
			this.vel.y *= -1;
	}

	this.timeArc += 0.01;
	if (this.timeArc >= ((3*Math.PI)/2) + (2*Math.PI))
	{
		this.timeArc -= 0.01;
		endGame(this);
	}
}

Bomb.prototype.canPress = function(finger)
{
	var xDist = Math.abs(finger.x - this.pos.x);
	var yDist = Math.abs(finger.y - this.pos.y);
	var dist = distance(xDist, yDist);

	return dist < this.radius;
}

Bomb.prototype.getDist = function(finger)
{
	var xDist = Math.abs(finger.x - this.pos.x);
	var yDist = Math.abs(finger.y - this.pos.y);
	var dist = distance(xDist, yDist);

	return dist;
}

Bomb.prototype.press = function(finger, fingerId)
{
	if (this.canPress(finger))
	{
		this.offset = new Vec2(finger.x - this.pos.x, finger.y - this.pos.y);
		this.pressed = true;
		this.fingerId = fingerId;
		return true;
	}
	return false;
}

Bomb.prototype.drag = function(finger)
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

Bomb.prototype.release = function()
{
	this.offset = new Vec2(-1, -1);
	this.pressed = false;
	this.fingerId = -1;

	for (var i = 0; i < targetBoxes.length; i++)
	{
		if (targetBoxes[i].isInsideBox(this.pos))
		{
			if (this.color == targetBoxes[i].color)
			{
				addScore(this.color);
				this.getDestroyed = true;
			}
			else
				endGame(this);
		}
	}
}

Bomb.prototype.draw = function(ctx)
{
	var drawRadius = this.radius * (this.pressed ? 1.12 : 1);
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, drawRadius, 0, 2*Math.PI);
	ctx.fillStyle = this.color == colors.cyan ? "cyan" : "magenta";
	ctx.fill();

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "yellow";
	ctx.arc(this.pos.x, this.pos.y, drawRadius, this.timeArc, ((3*Math.PI)/2) + (2*Math.PI));
	ctx.stroke();
}
