let canvas = document.getElementById("render-canvas");
let engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false});
let coordSystem=function(b){var g=b.normalize();b=0==Math.abs(b.x)&&0==Math.abs(b.y)?(new BABYLON.Vector3(b.z,0,0)).normalize():(new BABYLON.Vector3(b.y,-b.x,0)).normalize();var r=BABYLON.Vector3.Cross(b,g);return{x:b,y:g,z:r}},randPct=function(b,g){return 0==g?b:(1+(1-2*Math.random())*g)*b},createBranch=function(b,g,r,w,h,l,v,n,x){for(var t=[],d,c=[],f,q=[],a=0;12>a;a++)t[a]=[];for(var m=0;m<h;m++)for(a=m/h,d=g.y.scale(a*r),d.addInPlace(g.x.scale(v*Math.exp(-a)*Math.sin(l*a*Math.PI))),d.addInPlace(b),c[m]=d,d=n*(1+(.4*Math.random()-.2))*(1-(1-w)*a),q.push(d),a=0;12>a;a++)f=a*Math.PI/6,f=g.x.scale(d*Math.cos(f)).add(g.z.scale(d*Math.sin(f))),f.addInPlace(c[m]),t[a].push(f);for(a=0;12>a;a++)t[a].push(c[c.length-1]);return{branch:BABYLON.MeshBuilder.CreateRibbon("branch",{pathArray:t,closeArray:!0},x),core:c,_radii:q}},createTreeBase=function(b,g,r,w,h,l,v,n,x,t){var d=2/(1+Math.sqrt(5)),c=new BABYLON.Vector3(0,1,0),f,c=coordSystem(c),q=new BABYLON.Vector3(0,0,0),a=[],m=[],e=[],A=[],q=createBranch(q,c,b,g,r,1,x,1,t);a.push(q.branch);var y=q.core;m.push(y);e.push(q._radii);A.push(c);for(var q=y[y.length-1],y=2*Math.PI/h,z,u,p,C,B=0;B<h;B++)if(f=randPct(B*y,.25),f=c.y.scale(Math.cos(randPct(l,.15))).add(c.x.scale(Math.sin(randPct(l,.15))*Math.sin(f))).add(c.z.scale(Math.sin(randPct(l,.15))*Math.cos(f))),z=coordSystem(f),f=createBranch(q,z,b*v,g,r,n,x*d,g,t),p=f.core,p=p[p.length-1],a.push(f.branch),m.push(f.core),e.push(f._radii),A.push(z),1<w)for(var D=0;D<h;D++)u=randPct(D*y,.25),u=z.y.scale(Math.cos(randPct(l,.15))).add(z.x.scale(Math.sin(randPct(l,.15))*Math.sin(u))).add(z.z.scale(Math.sin(randPct(l,.15))*Math.cos(u))),u=coordSystem(u),C=createBranch(p,u,b*v*v,g,r,n,x*d*d,g*g,t),a.push(C.branch),m.push(C.core),e.push(f._radii),A.push(u);return{tree:BABYLON.Mesh.MergeMeshes(a),paths:m,radii:e,directions:A}},createTree=function(b,g,r,w,h,l,v,n,x,t,d,c,f,q,a,m){1!=h&&2!=h&&(h=1);var e=createTreeBase(b,g,r,h,l,v,n,d,c,m);e.tree.material=w;var A=b*Math.pow(n,h),y=A/(2*f),z=1.5*Math.pow(g,h-1);n=BABYLON.MeshBuilder.CreateDisc("leaf",{radius:z/2,tessellation:12,sideOrientation:BABYLON.Mesh.DOUBLESIDE},m);b=new BABYLON.SolidParticleSystem("leaveSPS",m,{updatable:!1});b.addShape(n,2*f*Math.pow(l,h),{positionFunction:function(b,a,g){a=Math.floor(g/(2*f));1==h?a++:a=2+a%l+Math.floor(a/l)*(l+1);var E=(g%(2*f)*y+3*y/2)/A,d=Math.ceil(r*E);d>e.paths[a].length-1&&(d=e.paths[a].length-1);var k=d-1,c=k/(r-1),m=d/(r-1);b.position=new BABYLON.Vector3(e.paths[a][k].x+(e.paths[a][d].x-e.paths[a][k].x)*(E-c)/(m-c),e.paths[a][k].y+(e.paths[a][d].y-e.paths[a][k].y)*(E-c)/(m-c)+(.6*z/q+e.radii[a][d])*(g%2*2-1),e.paths[a][k].z+(e.paths[a][d].z-e.paths[a][k].z)*(E-c)/(m-c));b.rotation.z=Math.random()*Math.PI/4;b.rotation.y=Math.random()*Math.PI/2;b.rotation.z=Math.random()*Math.PI/4;b.scale.y=1/q}});b=b.buildMesh();b.billboard=!0;n.dispose();d=new BABYLON.SolidParticleSystem("miniSPS",m,{updatable:!1});n=new BABYLON.SolidParticleSystem("minileavesSPS",m,{updatable:!1});var u=[];c=2*Math.PI/l;for(var p=0;p<Math.pow(l,h+1);p++)u.push(randPct(Math.floor(p/Math.pow(l,h))*c,.2));c=function(a,b,d){var c=d%Math.pow(l,h);1==h?c++:c=2+c%l+Math.floor(c/l)*(l+1);var f=e.directions[c],c=new BABYLON.Vector3(e.paths[c][e.paths[c].length-1].x,e.paths[c][e.paths[c].length-1].y,e.paths[c][e.paths[c].length-1].z),k=u[d],k=f.y.scale(Math.cos(randPct(v,0))).add(f.x.scale(Math.sin(randPct(v,0))*Math.sin(k))).add(f.z.scale(Math.sin(randPct(v,0))*Math.cos(k))),f=BABYLON.Vector3.Cross(BABYLON.Axis.Y,k),k=Math.acos(BABYLON.Vector3.Dot(k,BABYLON.Axis.Y)/k.length());a.scale=new BABYLON.Vector3(Math.pow(g,h+1),Math.pow(g,h+1),Math.pow(g,h+1));a.quaternion=BABYLON.Quaternion.RotationAxis(f,k);a.position=c;};for(var C=[],B=[],p=e.paths.length,D=e.paths[0].length,F=0;F<x;F++)C.push(2*Math.PI*Math.random()-Math.PI),B.push([Math.floor(Math.random()*p),Math.floor(Math.random()*(D-1)+1)]);p=function(a,c,b){var d=B[b][0],f=B[b][1],k=e.directions[d];c=new BABYLON.Vector3(e.paths[d][f].x,e.paths[d][f].y,e.paths[d][f].z);c.addInPlace(k.z.scale(e.radii[d][f]/2));b=C[b];k=k.y.scale(Math.cos(randPct(t,0))).add(k.x.scale(Math.sin(randPct(t,0))*Math.sin(b))).add(k.z.scale(Math.sin(randPct(t,0))*Math.cos(b)));b=BABYLON.Vector3.Cross(BABYLON.Axis.Y,k);k=Math.acos(BABYLON.Vector3.Dot(k,BABYLON.Axis.Y)/k.length());a.scale=new BABYLON.Vector3(Math.pow(g,h+1),Math.pow(g,h+1),Math.pow(g,h+1));a.quaternion=BABYLON.Quaternion.RotationAxis(b,k);a.position=c};d.addShape(e.tree,Math.pow(l,h+1),{positionFunction:c});d.addShape(e.tree,x,{positionFunction:p});d=d.buildMesh();d.material=w;n.addShape(b,Math.pow(l,h+1),{positionFunction:c});n.addShape(b,x,{positionFunction:p});w=n.buildMesh();b.dispose();w.material=a;a=BABYLON.MeshBuilder.CreateBox("",{},m);a.isVisible=!1;e.tree.parent=a;d.parent=a;return w.parent=a};

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        // Do not add a loading screen if there is already one
        return;
    }

    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Loadingsome.gif/600px-Loadingsome.gif' />";
    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';
    customLoadingScreenCss.innerHTML = `
            #customLoadingScreenDiv{
                background-color: #FFFFFFcc;
                color: white;
                font-size:50px;
                text-align:center;
            }
            `;
    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize", this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function(){
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("scene is now loaded");
}

engine.displayLoadingUI();
let scene = new BABYLON.Scene(engine);
scene.ambientColor = BABYLON.Color3.FromInts(0.1, 0.1, 0.1);
scene.clearColor = BABYLON.Color3.FromInts(0.1, 0.1, 0.1);
//scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
//scene.fogDensity = 0.00002;
//scene.fogColor = scene.clearColor;

var soundSprite = new BABYLON.Sound("", "/sounds/ForestAmbience.mp3", scene, null, { loop: true, autoplay: true, length: 9.200, offset: 14.000 });

let camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(30, 0, 10), scene);
camera.attachControl(canvas, false)
camera.setPosition(new BABYLON.Vector3(50, 100, 100))
camera.checkCollisions = true
camera.applyGravity = true
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

camera.lowerRadiusLimit = 8
camera.upperRadiusLimit = 10

camera.keysLeft = []
camera.keysRight = []
camera.keysUp = []
camera.keysDown = []

const assumedFramesPerSecond = 60;
const earthGravity = -9.81;
scene.gravity = new BABYLON.Vector3(0, earthGravity / assumedFramesPerSecond, 0);

//let light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), scene);
let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
light.position = new BABYLON.Vector3(0, -5, -5);
light.intensity = 3;
light.range = 100;

// Skybox
let skybox = BABYLON.Mesh.CreateBox("skyBox", 150.0, scene);
let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('//www.babylonjs.com/assets/skybox/TropicalSunnyDay', scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;
skybox.infiniteDistance = true;

// GUI
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
let instructions = new BABYLON.GUI.TextBlock();
instructions.text = "Move w/ WASD keys, B for Samba, look with the mouse";
instructions.color = "white";
instructions.fontSize = 16;
instructions.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
instructions.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
advancedTexture.addControl(instructions);

let animalCount = 5;
let textblock = new BABYLON.GUI.TextBlock();
textblock.text = "Animals: " + animalCount;
textblock.fontSize = 24;
textblock.top = "-450px";
textblock.left = "-850px";
textblock.color = "white";
advancedTexture.addControl(textblock);

let score = 0;
let textblock2 = new BABYLON.GUI.TextBlock();
textblock2.text = "Score: " + score;
textblock2.fontSize = 24;
textblock2.top = "-400px";
textblock2.left = "-850px";
textblock2.color = "white";
advancedTexture.addControl(textblock2);

// Invisible borders
let border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
border0.scaling = new BABYLON.Vector3(1, 100, 100);
border0.position.x = -100.0;
border0.checkCollisions = true;
border0.isVisible = false;

let border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
border1.scaling = new BABYLON.Vector3(1, 100, 100);
border1.position.x = 100.0;
border1.checkCollisions = true;
border1.isVisible = false;

let border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
border2.scaling = new BABYLON.Vector3(100, 100, 1);
border2.position.z = 100.0;
border2.checkCollisions = true;
border2.isVisible = false;

let border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
border3.scaling = new BABYLON.Vector3(100, 100, 1);
border3.position.z = -100.0;
border3.checkCollisions = true;
border3.isVisible = false;

// Ground
let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/c.png", 200, 200, 100, 0, -0.1, scene, false);
let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
groundMaterial.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene);

groundMaterial.diffuseTexture.uScale = 6;
groundMaterial.diffuseTexture.vScale = 6;
groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
ground.material = groundMaterial;
ground.receiveShadows = true;
ground.position.x = 40;
ground.position.z = 40;
//ground.checkCollisions = true;

// Keyboard events
let inputMap = {};
scene.actionManager = new BABYLON.ActionManager(scene);
scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));
scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));

let isStart = false;
let points = [];
let isPathVisible = false;
let track = null;
let heroSpeed = 0;

var textblockRules = new BABYLON.GUI.TextBlock();
textblockRules.text =
    "You can walk and direct press a, s, d and w keys\n\n " +
    "You can show the shortest path between the injured animals press q key\n\n" +
    "You can collect garbages press e key\n\n" +
    "You can heal the animals press r key\n\n" +
    "You can plant flowers and trees press t key\n\n"
    "Press start!\\n\\n\" +"
;
textblockRules.fontSize = 20;
textblockRules.fontStyle = "bold";
textblockRules.fontFamily = "Segoe UI"
textblockRules.height = "300px";
textblockRules.top = "280px";
textblockRules.color = "Yellow";
textblockRules.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
textblockRules.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
advancedTexture.addControl(textblockRules);

var buttonStart = BABYLON.GUI.Button.CreateSimpleButton("onoff", "START");
buttonStart.width = "200px";
buttonStart.height = "100px";
buttonStart.top = "180px";
buttonStart.fontSize = 30;
buttonStart.fontFamily = "Segoe UI"
buttonStart.cornerRadius = 20;
buttonStart.paddingBottom = 5;
buttonStart.thickness = 2;
buttonStart.background = "white";

buttonStart.onPointerClickObservable.add(function() {
    let isStart = true;
    buttonStart.isEnabled = false;
    buttonStart.isVisible = false;
    textblockRules.isEnabled = false;
    textblockRules.alpha = 0;
    heroSpeed = 0.5;

    calculatePath();
});

advancedTexture.addControl(buttonStart);
//variables for animal
let texList=[];
let shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
let manager = new BABYLON.GUI.GUI3DManager(scene);

let animalList = [];
let animalListWithBellman = [];
let animalListMeshes = [];
let animalListMeshesFinal = [];7
let animalHealList = [];
let distanceMatrix=[];
let garbageList = [];
let garbagePositionList = [];
let hero = null;


BABYLON.Effect.ShadersStore["customVertexShader"]= `   
		precision highp float;
    	attribute vec3 position;
    	attribute vec2 uv;
    	uniform mat4 worldViewProjection;
    	varying vec2 vUV;
    	void main(void) {
    	    gl_Position = worldViewProjection * vec4(position, 1.0);
    	    vUV = uv;
    	}`;

BABYLON.Effect.ShadersStore["customFragmentShader"]=`
	    precision highp float;
        varying vec2 vUV;
        uniform vec2 screenSize;
    	uniform sampler2D textureSampler;
        uniform highp sampler2D depth;
       	void main(void) {
            vec2 coords = gl_FragCoord.xy / screenSize;
            float distanceToCenter = length(vUV - vec2(0.5,0.5));
            float d = texture2D(depth, coords).x;
            float z = gl_FragCoord.z;
            float a = z > d ? 0.3 : 1.0;
            a = distanceToCenter < 0.5 ? a : 0.0;
            float plop = distanceToCenter < 0.45 ? 1.0 : .8;
            gl_FragColor = vec4(texture2D(textureSampler, vUV).xyz * plop, a);
    	}`;


ground.onReady = async function () {
    ground.optimize(100);

    createTrees();
    createGarbage(8, "cyawan.glb");
    createGarbage(8, "cup.glb");
    createGarbage(10,"apple.glb");
    //createLodge("lodge.glb");

    loadCharacter();

}

function distanceVector( x1,y1,z1, x2,y2,z2 )
{
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;

    return  Math.sqrt( dx * dx + dy * dy + dz * dz );
}
animalList.push(new BABYLON.Vector3(0, 0, 0));

    //Load animals
    createAnimal(2,"Playfuldog.glb",1,0.5);
    createAnimal(2,"pig.babylon",0,0.03);
    createAnimal(1,"chicken.babylon",0,0.009);


async function loadCharacter() {
    // Load hero character
    BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        hero = newMeshes[0];
        //Scale the model down
        hero.scaling.scaleInPlace(0.1);

        //Lock camera on the character
        camera.setTarget(hero)

        //Hero character variables
        let heroSpeedBackwards = 0.01;
        let heroRotationSpeed = 0.1;

        let animating = true;
        const walkAnim = scene.getAnimationGroupByName("Walking");
        const walkBackAnim = scene.getAnimationGroupByName("WalkingBack");
        const idleAnim = scene.getAnimationGroupByName("Idle");
        const sambaAnim = scene.getAnimationGroupByName("Samba");

        //Rendering loop (executed for everyframe)
        scene.onBeforeRenderObservable.add(() => {
            let keydown = false;
            //Manage the movements of the character (e.g. position, direction)
            if (inputMap["w"]) {
                hero.moveWithCollisions(hero.forward.scaleInPlace(heroSpeed));
                keydown = true;
            }
            if (inputMap["s"]) {
                hero.moveWithCollisions(hero.forward.scaleInPlace(-heroSpeedBackwards));
                keydown = true;
            }
            if (inputMap["a"]) {
                hero.rotate(BABYLON.Vector3.Up(), -heroRotationSpeed);
                keydown = true;
            }
            if (inputMap["d"]) {
                hero.rotate(BABYLON.Vector3.Up(), heroRotationSpeed);
                keydown = true;
            }
            if (inputMap["b"]) {
                keydown = true;
            }
            if (inputMap["e"]) {
                collectGarbage();
                keydown = true;
            }
            if (inputMap["r"]) {
                healAnimal();
                changeColor();
                keydown = true;
            }
            if (inputMap["t"]) {
                backgroundBox.isVisible = true;
                keydown = true;
            }
            if (inputMap["q"]) {
                if (!isPathVisible) {
                    drawPath();
                    isPathVisible = true;
                } else {
                    destroyPath();
                    isPathVisible = false;
                }
                keydown = true;
            }
            //Manage animations to be played
            if (keydown) {
                if (!animating) {
                    animating = true;
                    if (inputMap["s"]) {
                        //Walk backwards
                        walkBackAnim.start(true, 1.0, walkBackAnim.from, walkBackAnim.to, false);
                    } else if
                    (inputMap["b"]) {
                        //Samba!
                        sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
                    } else {
                        //Walk
                        walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
                    }
                }
            } else {
                if (animating) {
                    //Default animation is idle when no key is down
                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

                    //Stop all animations besides Idle Anim when no key is down
                    sambaAnim.stop();
                    walkAnim.stop();
                    walkBackAnim.stop();

                    //Ensure animation are played only once per rendering loop
                    animating = false;
                }
            }
        });

        engine.hideLoadingUI();
    });

    // Load a GUI from the snippet server.
    let gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
    let loadedGUI = await gui.parseFromSnippetAsync("FZ9KU3#9");
    // Set the ideal W and H if you wish to scale with the window.
    gui.idealWidth = 2048;
    gui.idealHeight = 2048;

    // Get a control by name a change a property.
    let backgroundBox = gui.getControlByName("BackgroundBox");
    backgroundBox.isVisible = false;

    var scaleFactor;
    var plant;
    var plantBoolean = false;

    let tulipBtn = gui.getControlByName("TulipBtn");
    let roseBtn = gui.getControlByName("RoseBtn");
    let shrubBtn = gui.getControlByName("ShrubBtn");
    let sunflowerBtn = gui.getControlByName("SunflowerBtn");
    let daisyBtn = gui.getControlByName("DaisyBtn");
    let whiteBtn = gui.getControlByName("WhiteTreeBtn");

    let treeBtn = gui.getControlByName("TreeBtn");
    let appleTreeBtn = gui.getControlByName("AppleTreeBtn");
    let grassBtn = gui.getControlByName("GrassBtn");

    let exitButton = gui.getControlByName("ExitButton");

    exitButton.onPointerClickObservable.add(() => {
        backgroundBox.isVisible = false;
    });

    roseBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "Rose";
        scaleFactor = 0.2;
        backgroundBox.isVisible = false;

    });

    daisyBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "Daisy";
        scaleFactor = 0.2;
        backgroundBox.isVisible = false;

    });

    shrubBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "Shrub";
        scaleFactor = 0.03;
        backgroundBox.isVisible = false;
    });


    tulipBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "Tulip";
        scaleFactor = 0.2;
        backgroundBox.isVisible = false;

    });

    sunflowerBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "Sunflower";
        scaleFactor = 0.5;
        backgroundBox.isVisible = false;

    });

    whiteBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "WhiteOakTree";
        scaleFactor = 0.05;
        backgroundBox.isVisible = false;

    });

    treeBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "rocks_trees_ao";
        scaleFactor = 0.5;
        backgroundBox.isVisible = false;

    });

    appleTreeBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "AppleTree";
        scaleFactor = 0.05;
        backgroundBox.isVisible = false;

    });

    grassBtn.onPointerClickObservable.add(() => {
        plantBoolean = true;
        plant = "grass";
        scaleFactor = 2.5;
        backgroundBox.isVisible = false;

    });

    let vector = {x: '', y: '', z: ''};
    scene.onPointerDown = function (event, pickResult) {

        if (plantBoolean) {
            //left mouse click
            if (event.button == 2) {
                vector = pickResult.pickedPoint;
                console.log('rigth mouse click: ' + vector.x + ',' + vector.y + ',' + vector.z);
                BABYLON.SceneLoader.ImportMesh("", "/scenes/plants/", plant + ".glb", scene, function (newMeshes) {
                    newMeshes[1].material.opacityTexture = null;
                    newMeshes[1].material.backFaceCulling = false;
                    for (let i = 1; i < newMeshes.length; i++) {
                        newMeshes[i].isVisible = false;
                    }

                    for (let i = 1; i < newMeshes.length; i++) {
                        newMeshes[i].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
                        shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                        // var range = 50;
                        var count = 1;
                        for (var index = 0; index < count; index++) {
                            var newInstance = newMeshes[i].createInstance("i" + index);
                            newInstance.position = new BABYLON.Vector3(vector.x, -0.05, vector.z);
                            newInstance.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);

                            shadowGenerator.getShadowMap().renderList.push(newInstance);
                            score += 5;
                            textblock2.text = "Score: " + score;
                        }
                    }
                    shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
                    shadowGenerator.usePoissonSampling = true;
                });

                var animations = [];
                var animat = BABYLON.SceneLoader.ImportMesh("", "/scenes/", "FloatingRainbowHearts.glb", scene, function (newMeshes) {
                    //newMeshes[1].material.opacityTexture = null;
                    //newMeshes[1].material.backFaceCulling = false;
                    for (let i = 1; i < newMeshes.length; i++) {
                        newMeshes[i].isVisible = false;
                    }

                    for (let i = 1; i < newMeshes.length; i++) {
                        //newMeshes[i].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
                        shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);

                        // var range = 50;
                        var count = 1;
                        for (var index = 0; index < count; index++) {
                            var newInstance = newMeshes[i].createInstance("i" + index);
                            animations.push(newInstance);
                            newInstance.position = new BABYLON.Vector3(vector.x + 1, -0.05, vector.z);
                            newInstance.scaling = new BABYLON.Vector3(50, 50, 50);

                            shadowGenerator.getShadowMap().renderList.push(newInstance);
                        }
                    }
                    shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
                    shadowGenerator.usePoissonSampling = true;
                });
            }
        }
    }
}

function createGarbage(count, obj) {
    BABYLON.SceneLoader.ImportMesh("", "/scenes/", obj, scene, function (meshes) {
        meshes[1].material.opacityTexture = null;
        meshes[1].material.backFaceCulling = false;
        meshes[1].isVisible = false;
        meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object

        let range = 50;
        for (let index = 0; index < count; index++) {
            let newInstance = meshes[1].createInstance(obj + "index");
            let x = Math.random() * range;
            let z =  Math.random() * range;

            let y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object
            newInstance.position = new BABYLON.Vector3(x, y, z);
            newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);
            let scale = 2;
            newInstance.scaling.addInPlace(new BABYLON.Vector3(scale, scale, scale));
            garbageList.push(newInstance);
            garbagePositionList.push(new BABYLON.Vector3(x, y, z));
        }

    });
}

function createLodge(obj) {
    BABYLON.SceneLoader.ImportMesh("", "/scenes/", obj, scene, function (meshes) {
        meshes[1].material.opacityTexture = null;
        meshes[1].material.backFaceCulling = false;
        meshes[1].isVisible = false;
        meshes[1].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
            let newInstance = meshes[1].createInstance("i0" );
            let x = -100;
            let z = -100;
            let y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object
            newInstance.position = new BABYLON.Vector3(x, y, z);
    });
}

function createAnimal(count, obj , num , scaleFactor) {
    BABYLON.SceneLoader.ImportMesh("", "/scenes/", obj, scene, function (newMeshes) {
        //scene.getMeshByID("__root__").position = new BABYLON.Vector3(1, 1, 1);
        newMeshes[num].material.opacityTexture = null;
        newMeshes[num].material.backFaceCulling = false;
        newMeshes[num].isVisible = false;
        newMeshes[num].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
        shadowGenerator.getShadowMap().renderList.push(newMeshes[num]);
        var range = 50;

        for (var index = 0; index < count; index++) {
            var newInstance = newMeshes[num].createInstance(obj + "" + index);
            var x = Math.random() * range;
            var z =  Math.random() * range;

            var y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object
            newInstance.position = new BABYLON.Vector3(x, y, z);
            newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);
            newInstance.scaling.addInPlace(new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor));

            animalList.push(new BABYLON.Vector3(x, y, z));
            animalListMeshes.push(obj + "" + index);

            shadowGenerator.getShadowMap().renderList.push(newInstance);

            var tex2 = new BABYLON.DynamicTexture("name"+index, {width: 256, height: 256}, scene);
            var font2 = "bold 124px monospace";
            tex2.drawText("2", null, null, font2, "black", "red", true, true);

            var renderer = scene.enableDepthRenderer(camera, true);


            // Sprite1
            var spriteMaterial = new BABYLON.ShaderMaterial("mat", scene, {
                    vertex: "custom",
                    fragment: "custom",
                },
                {
                    attributes: ["position", "uv"],
                    uniforms: ["worldViewProjection", "screenSize"],
                    needAlphaBlending: true
                });

            spriteMaterial.setTexture("depth", renderer.getDepthMap());
            spriteMaterial.setTexture("textureSampler", tex2);
            spriteMaterial.backFaceCulling = false;
            spriteMaterial.disableDepthWrite = true;
            spriteMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;


            // Sprite2
            var sprite2 = new BABYLON.MeshBuilder.CreatePlane("sprite"+index, { size:0.3 }, scene);

            sprite2.material = spriteMaterial;
            sprite2.position.y = y+2;
            sprite2.position.z = z;
            sprite2.position.x = x;

            texList.push(sprite2);

            var pushButton2 = new BABYLON.GUI.MeshButton3D(sprite2, "pushButton2");
            manager.addControl(pushButton2);

            pushButton2.onPointerClickObservable.add((e)=>{
                console.log('PushButton1 pushed!');
                changeColor();
            });
        }
        shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
        shadowGenerator.usePoissonSampling = true;

        for (let i = 0; i < animalList.length; i++) {
            let tempMatrix = [];
            for (let j=0; j < animalList.length; j++) {
                tempMatrix.push(distanceVector(animalList[i].x, animalList[i].y, animalList[i].z, animalList[j].x, animalList[j].y, animalList[j].z));
            }
            console.log(tempMatrix);
            distanceMatrix.push(tempMatrix);
        }

        let tempMatrix = [];
        for (let i = 0; i < distanceMatrix.length; i++) {
            if (distanceMatrix[i].length == 6) {
                tempMatrix.push(distanceMatrix[i]);
            }
        }

        distanceMatrix = tempMatrix;

        console.log(distanceMatrix);


    });

}

function createTrees() {

    let green = new BABYLON.StandardMaterial("green", scene);
    green.diffuseColor = new BABYLON.Color3(0,1,0);

    //trunk and branch material
    let bark = new BABYLON.StandardMaterial("bark", scene);
    bark.emissiveTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", scene);
    bark.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", scene);
    bark.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    bark.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes

    //Tree parameters
    let trunk_height = 10;
    let trunk_taper = 0.5;
    let trunk_slices = 5;
    let boughs = 2; // 1 or 2
    let forks = 4;
    let fork_angle = Math.PI/4;
    let fork_ratio = 2/(1+Math.sqrt(3)); //PHI the golden ratio
    let branch_angle = Math.PI/3;
    let bow_freq = 1;
    let bow_height = 1.5;
    let branches = 5;
    let leaves_on_branch = 5;
    let leaf_wh_ratio = 0.5;

    //Create Trees
    BABYLON.SceneLoader.ImportMesh("", "//www.babylonjs.com/assets/Tree/", "tree.babylon", scene, function (newMeshes) {
        newMeshes[0].material.opacityTexture = null;
        newMeshes[0].material.backFaceCulling = false;
        newMeshes[0].isVisible = false;
        newMeshes[0].position.y = ground.getHeightAtCoordinates(0, 0); // Getting height from ground object
        shadowGenerator.getShadowMap().renderList.push(newMeshes[0]);
        let range = 120;
        for (let index = 0; index < 100; index++) {
            let newInstance = newMeshes[0].createInstance("i" + index);
            let x = range / 2 - Math.random() * range;
            let z = range / 2 - Math.random() * range;

            let y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object
            newInstance.position = new BABYLON.Vector3(x, y, z);
            newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);
            newInstance.scaling = new BABYLON.Vector3(50.1,50.1,50.1);

            shadowGenerator.getShadowMap().renderList.push(newInstance);
        }

        //SPS Tree Generator
        for (let i = 0; i <10 ; i++) {
            let tree = createTree(trunk_height, trunk_taper, trunk_slices, bark, boughs, forks, fork_angle, fork_ratio, branches, branch_angle, bow_freq, bow_height, leaves_on_branch, leaf_wh_ratio, green, scene);
            let x = range / 2 - Math.random() * range;
            let z = range / 2 - Math.random() * range;
            let y = ground.getHeightAtCoordinates(x, z);
            //TODO:Ağaçları küçült ya da hazırları büyült
            //tree.scale=new BABYLON.Vector3(0.020, 0.020, 0.020);
            tree.position=new BABYLON.Vector3(x, y, z) ;
            tree.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
        }

        shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
        shadowGenerator.usePoissonSampling = true;
    });
}

function changeColor() {
    let temp = 1000;
    let currentGarbage = null;
    let distance = null;
    let ii = null;

    for (let i = 0; i < texList.length; i++) {
        distance = distanceVector(hero.position.x, 0, hero.position.z, texList[i].position.x, 0, texList[i].position.z);

        if ( distance < temp) {
            temp = distance;
            currentGarbage = texList[i];
            ii=i;
        }
    }

    if (temp < 5 ) {
        var tex2 = new BABYLON.DynamicTexture("name", {width: 256, height: 256}, scene);
        var font2 = "bold 124px monospace";
        tex2.drawText("10", null, null, font2, "black", "green", true, true);

        var renderer = scene.enableDepthRenderer(camera, true);

// Sprite1
        var spriteMaterial = new BABYLON.ShaderMaterial("mat", scene, {
                vertex: "custom",
                fragment: "custom",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "screenSize"],
                needAlphaBlending: true
            });

        spriteMaterial.setTexture("depth", renderer.getDepthMap());
        spriteMaterial.setTexture("textureSampler", tex2);
        spriteMaterial.backFaceCulling = false;
        spriteMaterial.disableDepthWrite = true;
        spriteMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

        currentGarbage.material = spriteMaterial;
    }
}

function collectGarbage() {
    let temp = 1000;
    let currentGarbage = null;
    let distance = null;
    let ii = null;

    for (let i = 1; i < garbageList.length; i++) {
        distance = distanceVector(hero.position.x, 0, hero.position.z, garbageList[i].position.x, 0, garbageList[i].position.z);

        if ( distance < temp) {
            temp = distance;
            currentGarbage = garbageList[i];
            ii=i;
        }
    }

    if (temp < 5 ) {
        currentGarbage.position.x = 500;
        currentGarbage.position.y = -100;
        currentGarbage.position.z = 500;
        score += 10;
        textblock2.text = "Score: " + score;
    }
}

function healAnimal() {
    let temp = 1000;
    let currentAnimal = null;
    let distance = null;
    let ii = null;

    for (let i = 1; i < animalListWithBellman.length; i++) {
        distance = distanceVector(hero.position.x, 0, hero.position.z, animalListWithBellman[i].x, 0, animalListWithBellman[i].z);

        if ( distance < temp) {
            temp = distance;
            currentAnimal = animalListMeshesFinal[i - 1];
            ii=i;
        }
    }

    if (!animalHealList[ii] ) {
         if (temp < 5 ) {
            let sk1 = scene.getNodeByName(currentAnimal).skeleton;
            scene.beginAnimation(sk1, 0, 73, true, 0.8);
            animalCount -= 1;
            textblock.text = "Animals: " + animalCount;

            score += 20;
            textblock2.text = "Score: " + score;
            animalHealList[ii] = true;
        }
    }
}

function calculatePath() {
    let finalPath =  heldKarpSetup(distanceMatrix, 0);

    for (let i=0; i < finalPath.length; i++) {
        animalListWithBellman.push(animalList[finalPath[i]]);
    }

    for (let i=1; i < finalPath.length  ; i++) {
        console.log(finalPath[i]);
        animalListMeshesFinal.push(animalListMeshes[finalPath[i] - 1]);
    }
      for (let i=1; i < finalPath.length  ; i++) {
          animalHealList.push(false);
    }

    for (let i = 0; i < animalList.length; i++) {
        points.push(new BABYLON.Vector3(animalListWithBellman[i].x, 0.1, animalListWithBellman[i].z ));
    }
}

function drawPath() {
    //Draw the curve
    track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
    track.color = new BABYLON.Color3(0.1, 0.5, 0.2);
    track.enableEdgesRendering();
    track.edgesWidth = 6.0;
}

function destroyPath() {
    track.isVisible = false;
}

let renderLoop = function () {
    scene.render();
};

engine.runRenderLoop(renderLoop);

window.addEventListener("resize", function () {
    engine.resize();
});
