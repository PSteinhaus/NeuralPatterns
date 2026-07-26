const Shaders = {
    fragmentShader: `
    precision mediump float;

    uniform sampler2D u_image;

    varying vec2 texCoord;

    uniform vec2 onePixel;

    uniform bool doStep;

	uniform vec4 colorMask;

	uniform float u_kernel[9];


    vec2 getCoords(vec2 coord, vec2 offset){
        return mod(coord + onePixel * offset, 1.0);
    }

	ACTIVATION_FUNCTION

    void main(void){

        if(doStep){
            PERSISTENT_DISPLAY
            
            // kernel indexes
            //    0       1       2
            //    3       4       5
            //    6       7       8
            // corresponding pixel coordinates (c, r)
            // ( 1,-1) ( 0,-1) (-1,-1)
            // ( 1, 0) ( 0, 0) (-1, 0)
            // ( 1, 1) ( 0, 1) (-1, 1)
            //                                          pixel( c,  r)   kernel weight[i]

            vec3 c0 = texture2D(u_image, getCoords(texCoord, vec2( 1.,-1.))).rgb;
            vec3 c1 = texture2D(u_image, getCoords(texCoord, vec2( 0.,-1.))).rgb;
            vec3 c2 = texture2D(u_image, getCoords(texCoord, vec2(-1.,-1.))).rgb;
            vec3 c3 = texture2D(u_image, getCoords(texCoord, vec2( 1., 0.))).rgb;
            vec3 c4 = texture2D(u_image, getCoords(texCoord, vec2( 0., 0.))).rgb;
            vec3 c5 = texture2D(u_image, getCoords(texCoord, vec2(-1., 0.))).rgb;
            vec3 c6 = texture2D(u_image, getCoords(texCoord, vec2( 1., 1.))).rgb;
            vec3 c7 = texture2D(u_image, getCoords(texCoord, vec2( 0., 1.))).rgb;
            vec3 c8 = texture2D(u_image, getCoords(texCoord, vec2(-1., 1.))).rgb;

            float sum_r = 
                  c0.r * u_kernel[0] 
                + c1.r * u_kernel[1]
                + c2.r * u_kernel[2]
                + c3.r * u_kernel[3]
                + c4.r * u_kernel[4]
                + c5.r * u_kernel[5]
                + c6.r * u_kernel[6]
                + c7.r * u_kernel[7]
                + c8.r * u_kernel[8];
            
            float sum_g = 
                  c0.g * u_kernel[0] 
                + c1.g * u_kernel[1]
                + c2.g * u_kernel[2]
                + c3.g * u_kernel[3]
                + c4.g * u_kernel[4]
                + c5.g * u_kernel[5]
                + c6.g * u_kernel[6]
                + c7.g * u_kernel[7]
                + c8.g * u_kernel[8];
            
            float sum_b = 
                  c0.b * u_kernel[0] 
                + c1.b * u_kernel[1]
                + c2.b * u_kernel[2]
                + c3.b * u_kernel[3]
                + c4.b * u_kernel[4]
                + c5.b * u_kernel[5]
                + c6.b * u_kernel[6]
                + c7.b * u_kernel[7]
                + c8.b * u_kernel[8];
            
            // Note on reversed implementation:
            // According to https://en.wikipedia.org/wiki/Kernel_(image_processing)#Convolution if the kernel
            // is not symmetric, it should be reversed before computing. This is how it is implemented in 
            // a number of python libraries, and thus how I implemented it here. I find it more intuitive.

            vec3 finalColor = activation(sum_r, sum_g, sum_b);
            
            gl_FragColor = vec4(finalColor, 1.);

        } else {
			// no color masking as in original neuralpatterns.io
			gl_FragColor = texture2D(u_image, texCoord);
        }
    }
    `,

    vertexShader: `
    attribute vec2 coordinates;

    varying vec2 texCoord;
    
    void main(void){
        
        texCoord = (coordinates/2.0 + 0.5);
        
        gl_Position = vec4(coordinates, 1.0, 1.0);
    
    }
    `,

    persistentSource: `
    vec3 cur = texture2D(u_image, getCoords(texCoord, vec2(0.0, 0.0))).rgb;
    if (cur.r > 0.0 || cur.g > 0.0 || cur.b > 0.0){
        gl_FragColor = vec4(cur, 1.0);
        return;
    }
    `,

    defaultActivationSource: 
    `vec3 activation(float r, float g, float b) {\n\treturn vec3(r, g, b);\n}`,
}

export default Shaders;