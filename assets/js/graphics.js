function createShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	  var program = gl.createProgram();
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  gl.linkProgram(program);
	  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	  if (success) {
	  	return program;
	  }
	  console.log(gl.getProgramInfoLog(program));
	  gl.deleteProgram(program);
}

function setRectangle(gl, rect) {
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		rect.model[0].x, rect.model[0].y,
		rect.model[1].x, rect.model[1].y,
		rect.model[3].x, rect.model[3].y,
		rect.model[3].x, rect.model[3].y,
		rect.model[1].x, rect.model[1].y,
		rect.model[2].x, rect.model[2].y,
	]), gl.DYNAMIC_DRAW);
	var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}


