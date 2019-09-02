#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
	// Get a value in the range of 0 to 1
	vec2 zeroToOne = a_position / u_resolution;

	// Multiply the value to get a range of 0 to 2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// Subtract one to get the range -1 to 1 for WebGL
	vec2 clipSpace = zeroToTwo - 1.0;	
	
	// Multiply y axis by -1 to get top left (0,0)
	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}