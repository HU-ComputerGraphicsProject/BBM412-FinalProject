let canvas = document.getElementById("render-canvas");
let engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false});


let scene = new BABYLON.Scene(engine);
scene.ambientColor = BABYLON.Color3.FromInts(10, 30, 10);
scene.clearColor = BABYLON.Color3.FromInts(135, 206, 250);
scene.gravity = new BABYLON.Vector3(0, -9.8, 0);
//scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
//scene.fogDensity = 0.02;
//scene.fogColor = scene.clearColor;


let camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, -5, 0), scene);
scene.activeCamera = camera1;
scene.activeCamera.attachControl(canvas, true);
camera1.lowerRadiusLimit = 2;
camera1.upperRadiusLimit = 10;
camera1.wheelDeltaPercentage = 0.01;


//let light = new BABYLON.PointLight("light", new BABYLON.Vector3(10, 10, 0), scene);
let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
light.position = new BABYLON.Vector3(0, -5, -5);
light.intensity = 2.5;
light.range = 100;

// Skybox
let skybox = BABYLON.Mesh.CreateBox("skyBox", 150.0, scene);
let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
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

// Invisible borders
let border0 = BABYLON.Mesh.CreateBox("border0", 1, scene);
border0.scaling = new BABYLON.Vector3(1, 100, 100);
border0.position.x = -50.0;
border0.checkCollisions = true;
border0.isVisible = false;

let border1 = BABYLON.Mesh.CreateBox("border1", 1, scene);
border1.scaling = new BABYLON.Vector3(1, 100, 100);
border1.position.x = 50.0;
border1.checkCollisions = true;
border1.isVisible = false;

let border2 = BABYLON.Mesh.CreateBox("border2", 1, scene);
border2.scaling = new BABYLON.Vector3(100, 100, 1);
border2.position.z = 50.0;
border2.checkCollisions = true;
border2.isVisible = false;

let border3 = BABYLON.Mesh.CreateBox("border3", 1, scene);
border3.scaling = new BABYLON.Vector3(100, 100, 1);
border3.position.z = -50.0;
border3.checkCollisions = true;
border3.isVisible = false;

// Ground
let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/c.png", 100, 100, 100, 0, -0.1, scene, false);
let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
groundMaterial.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene);

groundMaterial.diffuseTexture.uScale = 6;
groundMaterial.diffuseTexture.vScale = 6;
groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
groundMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
ground.material = groundMaterial;
ground.receiveShadows = true;
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

let animalList = [];
let animalListWithBellman = [];
let animalListMeshes = [];
let animalListMeshesFinal = [];

let distanceMatrix=[];

ground.onReady = function () {
    ground.optimize(100);

    // Shadows
    let shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    let hero = null;
    // Trees

    //leaf material
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
                        let range = 60;
                        let count = 100;
                        for (let index = 0; index < 10; index++) {
                            let newInstance = newMeshes[0].createInstance("i" + index);
                            let x = Math.random() * range;
                            let z = Math.random() * range;

                            let y = ground.getHeightAtCoordinates(x, z); // Getting height from ground object
                            newInstance.position = new BABYLON.Vector3(x, y, z);
                            newInstance.rotate(BABYLON.Axis.Y, Math.random() * Math.PI * 2, BABYLON.Space.WORLD);
                            let scale = 0.5 + Math.random() * 2;
                            newInstance.scaling.addInPlace(new BABYLON.Vector3(scale, scale, scale));

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
                        }

                        shadowGenerator.getShadowMap().refreshRate = 0; // We need to compute it just once
                        shadowGenerator.usePoissonSampling = true;

                        // Collisions
                       // camera.checkCollisions = true;
                       // camera.applyGravity = true;
                    });

    BABYLON.SceneLoader.ImportMesh("Rabbit", "/scenes/", "Rabbit.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        let rabbit = newMeshes[1];
        rabbit.scaling = new BABYLON.Vector3(0.015, 0.015, 0.015);
        //rabbit.position.y = 50;
        rabbit.isVisible = false;
        animalList.push(new BABYLON.Vector3(0, 0, 0));
        for (let x = 0; x < 5; x++) {
            let rabbit_family1=rabbit.clone("rabbit_family"+x);
            rabbit_family1.isVisible = true;
            shadowGenerator.getShadowMap().renderList.push(rabbit_family1);
            rabbit_family1.position.x = Math.random() * 50;
            rabbit_family1.position.y = 0.1;
            rabbit_family1.position.z = Math.random() * 50 ;
            rabbit_family1.rotation = new BABYLON.Vector3(0, 0, -1.5);

            rabbit_family1.skeleton = rabbit.skeleton.clone("clonedSkeleton1");

            matrix = BABYLON.Matrix.Translation(20, 276, -30*2);
            matrix.addToSelf(BABYLON.Matrix.Scaling(.5,.5,.5));
            idx = rabbit_family1.thinInstanceAdd(matrix);

            animalList.push(new BABYLON.Vector3(rabbit_family1.position.x, rabbit_family1.position.y, rabbit_family1.position.z));
            animalListMeshes.push("rabbit_family"+x);
            // animalList.push(rabbit_family1));

        }

        //TODO: Tavşanlar düzgün dağılmıyor
        /*for (let i = 0; i <5; i++) {
            let sk1 = scene.getNodeByName("rabbit_family"+i).skeleton;
            scene.beginAnimation(sk1, 0, 73, true, 0.8);
        }*/

        // console.log(animalList.length);
        //console.log(animalList);

        for (let i = 0; i < animalList.length; i++) {
            let tempMatrix = [];
            for (let j=0; j < animalList.length; j++) {
                tempMatrix.push(distanceVector(animalList[i].x, animalList[i].y, animalList[i].z, animalList[j].x, animalList[j].y, animalList[j].z));
            }
            distanceMatrix.push(tempMatrix);
        }

        // camera.checkCollisions = true;
        // camera.applyGravity = true;
    });

    BABYLON.SceneLoader.ImportMesh("pig", "/scenes/", "pig.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        let pig = meshes[0];
        pig.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
        //rabbit.position.y = 50;
        pig.isVisible = true;
        let pig_family1=pig.clone("pig_family");

        pig.position.x = Math.random() * 50;
        pig.position.y = 0.1;
        pig.position.z = Math.random() * 50 ;


       // animalList.push(new BABYLON.Vector3(0, 0, 0));
        for (let x = 0; x < 5; x++) {
            let pig_family1=pig.clone("pig_family"+x);
            pig_family1.isVisible = true;
            //shadowGenerator.getShadowMap().renderList.push(rabbit_family1);
            pig_family1.position.x = Math.random() * 50;
            pig_family1.position.y = 0.1;
            pig_family1.position.z = Math.random() * 50 ;
            pig_family1.rotation = new BABYLON.Vector3(0, 0, -1.5);

            pig_family1.skeleton = pig.skeleton.clone("clonedSkeleton1");

            matrix = BABYLON.Matrix.Translation(20, 276, -30*2);
            matrix.addToSelf(BABYLON.Matrix.Scaling(.5,.5,.5));
            idx = pig_family1.thinInstanceAdd(matrix);


        }

    });

    BABYLON.SceneLoader.ImportMesh("chicken", "/scenes/", "chicken.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        let chicken = newMeshes[1];
        chicken.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
        //rabbit.position.y = 50;
        chicken.position.x = 10;
        chicken.isVisible = false;
        // animalList.push(new BABYLON.Vector3(0, 0, 0));
        for (let x = 0; x < 5; x++) {
            let rabbit_family1=rabbit.clone("rabbit_family"+x);
            rabbit_family1.isVisible = true;
            shadowGenerator.getShadowMap().renderList.push(rabbit_family1);
            rabbit_family1.position.x = Math.random() * 50;
            rabbit_family1.position.y = 0.1;
            rabbit_family1.position.z = Math.random() * 50 ;
            rabbit_family1.rotation = new BABYLON.Vector3(0, 0, -1.5);

            rabbit_family1.skeleton = rabbit.skeleton.clone("clonedSkeleton1");

            matrix = BABYLON.Matrix.Translation(20, 276, -30*2);
            matrix.addToSelf(BABYLON.Matrix.Scaling(.5,.5,.5));
            idx = rabbit_family1.thinInstanceAdd(matrix);

            //animalList.push(new BABYLON.Vector3(rabbit_family1.position.x, rabbit_family1.position.y, rabbit_family1.position.z));
            // animalListMeshes.push("rabbit_family"+x);
            // animalList.push(rabbit_family1));

        }

    });
        // Load hero character
    BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        hero = newMeshes[0];

        //Scale the model down
        hero.scaling.scaleInPlace(0.1);

        //Lock camera on the character
        camera1.target = hero;

        //Hero character variables
        let heroSpeed = 0.3;
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

            //Manage animations to be played
            if (keydown) {
                if (!animating) {
                    animating = true;
                    if (inputMap["s"]) {
                        //Walk backwards
                        walkBackAnim.start(true, 1.0, walkBackAnim.from, walkBackAnim.to, false);
                    }
                    else if
                    (inputMap["b"]) {
                        //Samba!
                        sambaAnim.start(true, 1.0, sambaAnim.from, sambaAnim.to, false);
                    }
                    else {
                        //Walk
                        walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
                    }
                }
            }
            else {

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
    });

    let button = BABYLON.GUI.Button.CreateSimpleButton("but", "Show path");
    button.width = 0.1;
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.top = "-400px";
    button.left = "800px";
    advancedTexture.addControl(button);

    button.onPointerClickObservable.add(function () {
        let finalPath =  heldKarpSetup(distanceMatrix, 0);

        for (let i=0; i < finalPath.length; i++) {
            animalListWithBellman.push(animalList[finalPath[i]]);
        }

        for (let i=1; i < finalPath.length  ; i++) {
            console.log(finalPath[i]);
            animalListMeshesFinal.push(animalListMeshes[finalPath[i] - 1]);
        }

        console.log(finalPath);
        console.log(animalListMeshes);
        console.log(animalListMeshesFinal);
        let points = [];
        for (let i = 0; i < animalList.length; i++) {
            points.push(new BABYLON.Vector3(animalListWithBellman[i].x, 0.1, animalListWithBellman[i].z ));
        }

        //Draw the curve
        let track = BABYLON.MeshBuilder.CreateLines('track', {points: points}, scene);
        track.color = new BABYLON.Color3(1, 0.5, 0.8);
        track.enableEdgesRendering();
        track.edgesWidth = 6.0;

    });
    let healButton = BABYLON.GUI.Button.CreateSimpleButton("but", "Heal the animal");
    healButton.width = 0.1;
    healButton.height = "40px";
    healButton.color = "white";
    healButton.background = "green";
    healButton.top = "-300px";
    healButton.left = "800px";
    advancedTexture.addControl(healButton);

    healButton.onPointerClickObservable.add(function () {

        let temp = 1000;
        let currentAnimal = null;
        let distance = null;
        let ii = null;

        for (let i = 1; i < animalListWithBellman.length; i++) {
            distance = distanceVector(hero.position.x, 0, hero.position.z, animalListWithBellman[i].x, 0, animalListWithBellman[i].z);

            // console.log("  x  " + hero.position.x +  "  z  " +hero.position.z+ "  x  "+ animalListWithBellman[i].x+ "  z  "+animalListWithBellman[i].z);
            // console.log(distance);

            if ( distance < temp) {
                temp = distance;
                currentAnimal = animalListMeshesFinal[i - 1];
                ii=i;
            }
        }

        console.log("dist   " + temp + "  anim  " + currentAnimal);

        if (temp < 5 ) {
            let sk1 = scene.getNodeByName(currentAnimal).skeleton;
            let x = animalListWithBellman[ii].x;
            let z = animalListWithBellman[ii].z;
            scene.getNodeByName(currentAnimal).rotation = new BABYLON.Vector3(0,0,0);
            scene.getNodeByName(currentAnimal).position = new BABYLON.Vector3(x + 3.3,-2.1,z);
            scene.beginAnimation(sk1, 0, 73, true, 0.8);
            animalCount -= 1;
            textblock.text = "Animals: " + animalCount;
        }
    });
}

function distanceVector( x1,y1,z1, x2,y2,z2 )
{
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;

    return  Math.sqrt( dx * dx + dy * dy + dz * dz );
}


let renderLoop = function () {
    scene.render();
};

engine.runRenderLoop(renderLoop);