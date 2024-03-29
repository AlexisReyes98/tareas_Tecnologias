/*========================= THE CUBE ========================= */

function Cube() {
    this.vertexes = [ // set 2 identical points for vectors of normal
        -1, -1, -1, -1, -1, -1,
        1, -1, -1, 1, -1, -1,   //   back face
        1, 1, -1, 1, 1, -1,
        -1, 1, -1, -1, 1, -1,

        -1, -1, 1, -1, -1, 1,
        1, -1, 1, 1, -1, 1,   // front face
        1, 1, 1, 1, 1, 1,
        -1, 1, 1, -1, 1, 1,

        -1, -1, -1, -1, -1, -1,
        -1, 1, -1, -1, 1, -1,  // left face
        -1, 1, 1, -1, 1, 1,
        -1, -1, 1, -1, -1, 1,

        1, -1, -1, 1, -1, -1,
        1, 1, -1, 1, 1, -1,   //  right face
        1, 1, 1, 1, 1, 1,
        1, -1, 1, 1, -1, 1,

        -1, -1, -1, -1, -1, -1,
        -1, -1, 1, -1, -1, 1, //  bottom face
        1, -1, 1, 1, -1, 1,
        1, -1, -1, 1, -1, -1,

        -1, 1, -1, -1, 1, -1,
        -1, 1, 1, -1, 1, 1, //  top face
        1, 1, 1, 1, 1, 1,
        1, 1, -1, 1, 1, -1
    ];

    this.faces = [ // 2 triangles for every face
        0, 1, 2,  // back face
        0, 2, 3,

        4, 5, 6,  //  front face
        4, 6, 7,

        8, 9, 10, //  left face
        8, 10, 11,

        12, 13, 14,   //  right face
        12, 14, 15,

        16, 17, 18,   //  bottom face
        16, 18, 19,

        20, 21, 22,   //  top face
        20, 22, 23
    ];
};