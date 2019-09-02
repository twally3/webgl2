const canvas = document.querySelector('canvas');
/**
 * @type {WebGLRenderingContext}
 */
// @ts-ignore
const gl = canvas.getContext('webgl2');

if (!gl) throw new Error('Get a better browser');

/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) return shader;

	console.error(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) return program;

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

(async function main() {
	const [vertexShaderSrc, fragmentShaderSrc] = await Promise.all([
		fetch('../shaders/vertex.glsl'),
		fetch('../shaders/fragment.glsl')
	]).then(shaders => Promise.all(shaders.map(shader => shader.text())));

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	const fragmentShader = createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSrc
	);

	const program = createProgram(gl, vertexShader, fragmentShader);

	const positionArrtibLocation = gl.getAttribLocation(program, 'a_position');

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const positions = [0, 0, 0, 0.5, 0.7, 0];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	gl.enableVertexAttribArray(positionArrtibLocation);

	const size = 2; // 2 components per iteration
	const type = gl.FLOAT; // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
	const offset = 0; // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionArrtibLocation,
		size,
		type,
		normalize,
		stride,
		offset
	);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Bind the attribute/buffer set we want.
	gl.bindVertexArray(vao);

	const primitiveType = gl.TRIANGLES;
	// const offset = 0;
	const count = 3;
	gl.drawArrays(primitiveType, offset, count);
})();
