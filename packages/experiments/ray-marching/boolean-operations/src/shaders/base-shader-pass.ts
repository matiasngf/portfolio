// Shader base starter https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/CopyShader.js

export const CopyShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform float opacity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;
    
		void main() {
			gl_FragColor = texture2D( tDiffuse, vUv );
			gl_FragColor.a *= opacity;
		}`

};

/*
const myShaderPass = new ShaderPass(MyShader);
composer.addPass(myShaderPass);
*/