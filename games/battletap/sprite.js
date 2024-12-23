var
s_floor,
s_player,
s_playerr,	// replace with this
s_enemy,
s_tutBacking,
s_tutText,
s_sun,
s_succeedRays,
s_bubble,
s_failBg,
s_title,
s_startButt,
s_retryButt,
s_scoreBacking,
s_new,
s_barBacking,
s_barFill,
s_barHealth,
s_clouds,
s_name,
s_tapGlow,
s_tapIcon;

function Sprite(src, width, height, x, y)
{
	this.img = new Image();
	this.img.src = src;
	this.width = width*scaleFactor;
	this.height = height*scaleFactor;
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
	ctx.drawImage(this.img, this.x, this.y, this.width/scaleFactor, this.height/scaleFactor, x, y, this.width, this.height);
};

function initSprites()
{
	s_floor = new Sprite("res/floor.png", 320, 140);
	s_player = 
	[
		new Sprite("res/player.png", 25, 50, 0, 0),		// idle
		new Sprite("res/player.png", 25, 50, 27, 0),	// walk 1
		new Sprite("res/player.png", 25, 50, 54, 0),	// walk 2
		new Sprite("res/player.png", 25, 50, 81, 0),	// jump
		new Sprite("res/player.png", 25, 50, 108, 0),	// fall
		new Sprite("res/player.png", 25, 50, 135, 0),	// hurt
		new Sprite("res/player.png", 25, 50, 162, 0),	// spin
		new Sprite("res/player.png", 25, 50, 189, 0)	// dead
	];
	s_enemy = 
	[
		new Sprite("res/enemy.png", 25, 50, 0, 0),		// idle
		new Sprite("res/enemy.png", 25, 50, 27, 0),		// walk 1
		new Sprite("res/enemy.png", 25, 50, 54, 0),		// walk 2
		new Sprite("res/enemy.png", 25, 50, 81, 0),		// jump
		new Sprite("res/enemy.png", 25, 50, 108, 0),	// fall
		new Sprite("res/enemy.png", 25, 50, 135, 0),	// hurt
		new Sprite("res/enemy.png", 25, 50, 162, 0),	// spin
		new Sprite("res/enemy.png", 25, 50, 189, 0)		// dead
	];
	s_tutBacking = new Sprite("res/tutBacking.png", 320, 480);
	s_tutText =
	[
		new Sprite("res/tutText.png", 290, 47, 0, 0),	// attack
		new Sprite("res/tutText.png", 290, 47, 0, 49),	// attack again
		new Sprite("res/tutText.png", 290, 47, 0, 98),	// dodge
		new Sprite("res/tutText.png", 290, 68, 0, 147)	// spin

	];
	s_sun = 
	[
		new Sprite("res/sun.png", 159, 152, 0, 0),		// idle
		new Sprite("res/sun.png", 159, 152, 163, 0),	// happy
		new Sprite("res/sun.png", 159, 152, 326, 0)		// sad
	];
	s_succeedRays = new Sprite("res/succeedRays.png", 755, 661);
	s_bubble = 
	[
		new Sprite("res/bubble.png", 231, 80, 0, 0),
		new Sprite("res/bubble.png", 231, 80, 0, 82),
		new Sprite("res/bubble.png", 231, 80, 0, 164)
	];

	s_failBg = new Sprite("res/failBg.png", 320, 480);
	s_title = new Sprite("res/title.png", 247, 64);
	s_startButt = new Sprite("res/startButt.png", 73, 37);
	s_retryButt = new Sprite("res/retryButt.png", 73, 37);
	s_scoreBacking = new Sprite("res/scoreBacking.png", 368, 206);
	s_new = new Sprite("res/new.png", 37, 19);
	s_barBacking = new Sprite("res/barBacking.png", 304, 53);
	s_barFill = new Sprite("res/barFill.png", 292, 46);
	s_barHealth = new Sprite("res/barHealth.png", 105, 32);
	s_clouds = new Sprite("res/clouds.png", 640, 268);
	s_name = new Sprite("res/name.png", 189, 23);
	s_tapGlow = new Sprite("res/tapGlow.png", 320, 480);
	s_tapIcon = new Sprite("res/tapIcon.png", 89, 88);
}