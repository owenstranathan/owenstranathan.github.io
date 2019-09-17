const GAME_WIDTH 			= 512;
const GAME_HEIGHT 			= 256;
const PADDLE_WIDTH 			= 4;
const PADDLE_HEIGHT 		= 28;
const PADDLE_OFFSET 		= 4;
const BALL_WIDTH 			= 5;
const BALL_HEIGHT 			= 5;

const BALL_STATE_FREE 		= 0;
const BALL_STATE_SERVING  	= 1;

function Paddle(position) {
	this.shape = new Rectangle(position, PADDLE_WIDTH, PADDLE_HEIGHT);
	this.velocity = Vec2.zero();
}

Paddle.prototype.update = function() {
	this.shape.position = this.shape.add(this.velocity);
	this.shape.update()
}

function Ball(position) {
	this.shape = new Rectangle(position, BALL_WIDTH, BALL_HEIGHT);
	this.velocity = new Vec2(0.1 + Math.random(), Math.random());
	this.paddle = null // Used for serving
}

Ball.prototype.update = function() {
	this.shape.position = this.shape.add(this.velocity);
	this.shape.update()
}

function Game(paddleDimensions, ballDimensions) {
	this.leftPlayerScore = 0;
	this.rightPlayerScore = 0;
	this.leftPaddle = new Paddle(new Vec2(PADDLE_OFFSET, GAME_HEIGHT/2));
	this.rightPaddle = new Paddle(new Vec2(GAME_WIDTH-PADDLE_OFFSET, GAME_HEIGHT/2));
	this.ball = new Ball(new Vec2(GAME_WIDTH/2, GAME_HEIGHT/2));
	this.arena = new Rectangle(new GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT);
}

Game.prototype.update = function() {
	resolveCollisions(this);
	this.leftPaddle.update()
	this.rightPaddle.update()
	this.ball.update()
}


