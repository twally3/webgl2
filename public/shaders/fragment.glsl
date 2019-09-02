#version 300 es

precision mediump float;

uniform vec4 u_colour;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
	
	// Just set the output to a constant redish-purple
	outColor = u_colour;
}