var
s_player;

function Sprite(src, width, height, x, y, sf)
{
	this.img = new Image();
	this.img.src = src;
	this.width = width*sf;
	this.height = height*sf;
	this.x = 0;
	this.y = 0;
	
	if (x != undefined && y != undefined)
	{
		this.x = x;
		this.y = y;
	}
};

Sprite.prototype.draw = function(ctx, x, y, sf)
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
	ctx.drawImage(this.img, this.x, this.y, this.width/sf, this.height/sf, x, y, this.width, this.height);
};

function initSprites(sf)
{
	s_player = 
	[
		new Sprite("res/player.png", 25, 50, 0, 0, sf),		// idle
		new Sprite("res/player.png", 25, 50, 27, 0, sf),	// walk 1
		new Sprite("res/player.png", 25, 50, 54, 0, sf),	// walk 2
		new Sprite("res/player.png", 25, 50, 81, 0, sf),	// jump
		new Sprite("res/player.png", 25, 50, 108, 0, sf),	// fall
		new Sprite("res/player.png", 25, 50, 135, 0, sf),	// hurt
		new Sprite("res/player.png", 25, 50, 162, 0, sf),	// spin
		new Sprite("res/player.png", 25, 50, 189, 0, sf)	// dead
	];
}
