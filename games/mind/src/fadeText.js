"use strict";

function FadeText(x, y, alpha, sprite)
{
	this.pos = new Vec2(x, y);
	this.alpha = alpha;
	this.fadeTarget = this.alpha;
	this.sprite = sprite;
}

FadeText.prototype.update = function()
{
	this.alpha += (this.fadeTarget - this.alpha) * 0.1;
}

FadeText.prototype.fadeIn = function()
{
	this.fadeTarget = 1;
}

FadeText.prototype.fadeOut = function()
{
	this.fadeTarget = 0;
}

FadeText.prototype.draw = function(ctx)
{
	ctx.save();

	ctx.translate(this.pos.x, this.pos.y);
	ctx.globalAlpha = this.alpha;

	this.sprite.draw(ctx, 0, 0);
	ctx.restore();
}