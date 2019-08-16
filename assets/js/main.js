main();

function main() {
	let graphics = new Graphics();
	console.log(graphics.canvas.width);
	console.log(graphics.canvas.height);
	drawScene(graphics.gl, graphics.programInfo, graphics.buffers);
}

