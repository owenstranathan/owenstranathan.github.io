
/**************
 * Collisions *
 **************/

function Collision(collides, point, normal, penetration) {
	this.collides = collides;
	this.point = point;
	this.normal = normal;
	this.penetration = penetration;
}

// Rectangle Collisions
function collision(r1, r2) {
	collisions = [];
	for (var i = 0; i < 4; i++) {
		var a = r1.position;
		var b = r1.vertices[i];
		for (var j = 0; j < 4; j++) {
			var c = r1.vertices[j];
			var d = r1.vertices[(j+1)%4];
			var intersection = lineSegmentIntersection(a, b, c, d);
			if(intersection != null) {
				var pen = b.sub(intersection).magnitude();
				var normal = findNormal(c, d, a).normalized();
				return Collision(true, intersection, normal, pen);
			}
		}
	}
	return Collision(false, null, Vec2.zero(), 0);
}

function resolveCollisions(game) {
	var col = collision(game.leftPaddle.shape, game.ball);
	if (col.collides) {
		game.ball.position.add(col.normal.mult(col.penetration));
		game.ball.velocity.mult(-1);
		game.velocity.add(game.leftPaddle.velocity.mult(0.5));
	}
	var col = collision(game.rightPaddle.shape, game.ball);
	if (col.collides) {
		game.ball.position.add(col.normal.mult(col.penetration));
		game.ball.velocity.mult(-1);
		game.velocity.add(game.rightPaddle.velocity.mult(0.5));
	}
	var col = collision(game.ball.shape, game.arena);
	if (col.collides) {
		game.ball.position.add(col.normal.mult(col.penetration));
		game.ball.velocity.mult(-1);
	}
}
