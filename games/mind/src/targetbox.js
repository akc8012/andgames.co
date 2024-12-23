"use strict";

function TargetBox(x, y, width, height, index)
{
	this.pos = new Vec2(x, y);
	this.size = new Vec2(width, height);
	this.index = index;
}

TargetBox.prototype.update = function()
{

}

TargetBox.prototype.isInsideBox = function(pos, spriteNdx)
{
	if (pos.x > this.pos.x && pos.x < this.pos.x+this.size.x &&
		pos.y > this.pos.y && pos.y < this.pos.y+this.size.y &&
		this.index == spriteNdx)
		return true;
	else
		return false;
}

TargetBox.prototype.getCenter = function()
{
	return new Vec2(this.pos.x + this.size.x/2, this.pos.y + this.size.y/2);
}

TargetBox.prototype.draw = function(ctx)
{
	ctx.fillStyle = "#555";
	ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

	ctx.beginPath();
	ctx.lineWidth = "6";
	ctx.strokeStyle = 'magenta';
	ctx.rect(this.pos.x+(ctx.lineWidth/2), this.pos.y+(ctx.lineWidth/2), 
		this.size.x-(ctx.lineWidth), this.size.y-(ctx.lineWidth)); 
	ctx.stroke();
}
