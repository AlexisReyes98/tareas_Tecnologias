var createScene  = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 0.8, 0.8);
};
var scene = createScene();

engine.runRenderLoop(function() {
    scene.render();
});
