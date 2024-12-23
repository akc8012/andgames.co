var
s_guy,
s_pieces,
s_glowPieces,
s_peace,
s_of,
s_mind,
s_hold,
s_twoFingers;

function Sprite(src, width, height, x, y)
{
	this.img = new Image();
	this.img.src = src;
	this.width = width;
	this.height = height;
	this.x = 0;
	this.y = 0;
	
	if (x != undefined && y != undefined)
	{
		this.x = x;
		this.y = y;
	}
};

Sprite.prototype.draw = function(ctx, x, y)
{
	// drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
	// img	Specifies the image, canvas, or video element to use
	// sx	Optional. The x coordinate where to start clipping
	// sy	Optional. The y coordinate where to start clipping
	// swidth	Optional. The width of the clipped image
	// sheight	Optional. The height of the clipped image
	// x	The x coordinate where to place the image on the canvas
	// y	The y coordinate where to place the image on the canvas
	// width	Optional. The width of the image to use (stretch or reduce the image)
	// height	Optional. The height of the image to use (stretch or reduce the image)
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

function initSprites()
{
	s_guy = new Sprite("res/guy.png", 363, 503, 0, 0);

	s_pieces = 
	[
		new Sprite("res/orange.png", 113, 135, 0, 0),
		new Sprite("res/pink.png", 123, 100, 0, 0),
		new Sprite("res/green.png", 124, 92, 0, 0),
		new Sprite("res/blue.png", 67, 71, 0, 0),
		new Sprite("res/purple.png", 103, 99, 0, 0)
	];

	s_glowPieces = 
	[
		new Sprite("res/orangeGlow.png", 125, 147, 0, 0),
		new Sprite("res/pinkGlow.png", 135, 112, 0, 0),
		new Sprite("res/greenGlow.png", 136, 104, 0, 0),
		new Sprite("res/blueGlow.png", 79, 82, 0, 0),
		new Sprite("res/purpleGlow.png", 115, 111, 0, 0)
	];

	s_peace = new Sprite("res/peace.png", 212, 90, 0, 0);
	s_of = new Sprite("res/of.png", 97, 61, 0, 0);
	s_mind = new Sprite("res/mind.png", 191, 87, 0, 0);

	s_hold = new Sprite("res/touchAndHold.png", 369, 40, 0, 0);
	s_twoFingers = new Sprite("res/twoFingers.png", 496, 40, 0, 0);
}
