//Created by XORXOR: 2016 - codevember
// Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
var container;
var camera, controls, scene, renderer;
var texture;
var sky, sunSphere;

var elements = [];
var uniforms;

var azimuth = 0.50;
var inclination = .3;
init()
animate();

function initSky() {

    // Add Sky Mesh
    sky = new THREE.Sky();
    scene.add( sky.mesh );

    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry( 20000, 16, 8 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );

    uniforms = sky.uniforms;
    uniforms.turbidity.value = 16;
    uniforms.rayleigh.value =  1.027;
    uniforms.luminance.value = 1;
    uniforms.mieCoefficient.value = 0.01;
    uniforms.mieDirectionalG.value = 0.97;

    moveSun();

}

function moveSun(time){
    var distance = 4000;
    var theta = Math.PI * ( inclination - 0.5 );
    var phi = 2 * Math.PI * (azimuth - 0.5 );

    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    sky.uniforms.sunPosition.value.copy( sunSphere.position );
}

function init() {

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, .1, 20000 );
    camera.position.set( -.6, 5.2, 0 );
    camera.rotation.set(-Math.PI/2,-Math.PI/2,-Math.PI/2)
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xdce2d6);

    document.body.appendChild( renderer.domElement );

    //LIGHT
    var ambient = new THREE.AmbientLight( 0xffffff,1 );
    scene.add(ambient);
    //STUFF

    n = 100;
    for (var i = n - 1; i >= 0; i--) {
        var elementGeometry = new THREE.BoxGeometry(4, 4, 4);
        var elementMaterial = new THREE.MeshLambertMaterial({opacity:1, transparent:true,color:0xffffff});
        //elementMaterial.color.setHSL(Math.random(),.45,.51)
 
        var element = new THREE.Mesh(elementGeometry, elementMaterial);
        scene.add(element);   
        element.scale.set( (Math.random()*.8)*14,.3,.3 )
        element.position.y = 33 + (Math.random()-.5) * 70
        element.position.z = (Math.random()-.5) * 500

        element.position.x = Math.random()*1000
        elements.push(element) 
    }

    //mirrorball
    var radius = 5;
    mirrorCamera = new THREE.CubeCamera( 0.1, 5000, 1024 );
    mirrorCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
    scene.add( mirrorCamera );
    
    var geometry = new THREE.SphereGeometry( radius, 256,256 );
    var mat = new THREE.MeshBasicMaterial( { envMap: mirrorCamera.renderTarget.texture,fog:true,shading: THREE.SmoothShading});

    obj = new THREE.Mesh(geometry,mat);

    scene.add(obj);

    initSky();
    window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {

    obj.visible = false; 
    mirrorCamera.updateCubeMap( renderer, scene );
    obj.visible = true; 

    for (var i = elements.length - 1; i >= 0; i--) {
        if (elements[i].position.x < -100) {
            elements[i].position.x = 1000
            elements[i].material.opacity = 0;
        }
        elements[i].position.x -= 1+4 * (i/elements.length);
        elements[i].material.opacity += .01;
    }
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.left = window.innerWidth / - 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}