/*========================= PHONG'S SHADERS ========================= */

var phong_shader_vertex_src = `
    attribute vec3 position;
    attribute vec3 normal;
    
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;

    varying vec3 vNormal;
    varying vec3 vView;

    void main(void) 
    {
        gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0);
        vNormal = vec3(Mmatrix * vec4(normal, 0.0));
        vView = vec3(Vmatrix * Mmatrix * vec4(position, 1.0));
    }`;

var phong_shader_fragment_src = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vView;
    const vec3 source_ambient_color = vec3(1.0, 1.0, 1.0);
    const vec3 source_diffuse_color = vec3(1.0, 1.0, 1.0);
    const vec3 source_specular_color = vec3(1.0, 1.0, 0.0);
    const vec3 source_direction = vec3(0.0, 0.0, 1.0);
    
    const vec3 mat_ambient_color = vec3(0.3, 0.3, 0.3); 
    const vec3 mat_diffuse_color = vec3(1.0, 1.0, 1.0); 
    const vec3 mat_specular_color = vec3(0.3, 0.3, 0.3); 
    const float mat_shininess = 2.5;

    void main(void) 
    { 
        vec3 color = vec3(0.1, 0.1, 0.1); 
        vec3 I_ambient = source_ambient_color * mat_ambient_color; 
        vec3 I_diffuse =    source_diffuse_color * 
                            mat_diffuse_color * 
                            max(0.0, dot(vNormal, source_direction));

        vec3 V = normalize(vView); 
        vec3 R = reflect(source_direction, vNormal);  // from surface to source
        
        
        vec3 I_specular =   source_specular_color * 
                            mat_specular_color * 
                            pow(max(dot(R, V), 0.0), mat_shininess);

        vec3 I = I_ambient + I_diffuse + I_specular; 
        gl_FragColor = vec4(I * color, 1.0); 
    }`;