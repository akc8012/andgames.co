"use strict";

function Vec2(x, y)
{
	this.x = x;
	this.y = y;
}

function distance(x, y)
{
	var dist = (x*x) + (y*y);
	dist = Math.sqrt(dist);
	return dist;
}

function print(msg)
{
	console.log(msg);
}