"use strict";

function TargetBox(x, y, width, height, color)
{
	this.pos = new Vec2(x, y);
	this.size = new Vec2(width, height);
	this.color = color;
}

TargetBox.prototype.update = function()
{

}

TargetBox.prototype.isInsideBox = function(pos)
{
	if (pos.x > this.pos.x && pos.x < this.pos.x+this.size.x &&
		pos.y > this.pos.y && pos.y < this.pos.y+this.size.y)
		return true;
	else
		return false;
}

TargetBox.prototype.draw = function(ctx)
{
	ctx.fillStyle = "#555";
	ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

	ctx.beginPath();
	ctx.lineWidth = "6";
	ctx.strokeStyle = this.color == colors.cyan ? "cyan" : "magenta";
	ctx.rect(this.pos.x+(ctx.lineWidth/2), this.pos.y+(ctx.lineWidth/2), 
		this.size.x-(ctx.lineWidth), this.size.y-(ctx.lineWidth)); 
	ctx.stroke();
}
