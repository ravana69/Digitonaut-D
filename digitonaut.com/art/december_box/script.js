var ww = window.innerWidth,
    wh = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas")
});
renderer.setSize(ww, wh);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, ww/wh, 1, 10000);
camera.position.y = 200;
camera.position.z = 300;
camera.lookAt(new THREE.Vector3(0,0,0));

var light = new THREE.PointLight( 0xffffff, 1, 500 );
light.position.y = 0;
light.position.z = 0;
scene.add(light);

var controls = new THREE.OrbitControls(camera);

window.addEventListener("mouseup", updateScene);
window.addEventListener("touchend", updateScene);
function updateScene(){
  for(var i=0;i<cubes.children.length;i++){
    TweenMax.to(cubes.children[i].position, 1,{
      x:0,
      y:0,
      z:0,
      ease:Power2.easeIn,
      delay: Math.random()
    });
  }
  setTimeout(function(){
    TweenMax.set(cubes.scale,{
      x:0.001,
      y:0.001,
      z:0.001
    });
    createScene();
    TweenMax.to(cubes.scale,1,{
      x:1,
      y:1,
      z:1,
      ease:Power2.easeInOut
    });
  }, 1000 + cubes.children.length);
}
window.addEventListener("resize", function() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
});

var cubes = new THREE.Object3D();
var color = null;
function createScene(){
  color = Math.floor(Math.random()*180)+180;
  renderer.setClearColor(new THREE.Color("hsl("+color+",50%,50%)"),0.1);
  noise.seed(Math.random());
  cubes.children = [];
  var geom = new THREE.BoxBufferGeometry(10,10,10);
  var size = 10;
  for(var x=-size*0.5;x<size*0.5;x++){
    for(var y=-size*0.5;y<size*0.5;y++){
      for(var z=-size*0.5;z<size*0.5;z++){
        var material = new THREE.MeshPhongMaterial({
          color : createColor(x,y,z),
          emissive : createColor(x,y,z),
          emissiveIntensity : 0.5,
          shininess : 50
        });
        var cube = new THREE.Mesh(geom, material);
        cube.position.x = x*15;
        cube.position.y = y*15;
        cube.position.z = z*15;
        
        TweenMax.to(cube.scale, 2, {
          x:0.1,
          y:0.1,
          z:0.1,
          yoyo:true,
          repeat:-1,
          ease:Power2.easeInOut,
          delay : -Math.round(noise.simplex3(x*0.08, y*0.08, z*0.08))-1.5
        });
        cubes.add(cube);
      }
    }
  }
  scene.add(cubes);
}


function createColor(x,y,z){
  x *= 0.08;
  y *= 0.08;
  z *= 0.08;
  var l = Math.round((Math.abs(noise.simplex3(x, y, z)))*100);
  return "hsl("+color+",50%,"+l+"%)";
}

function render(a){
  requestAnimationFrame(render);
  
  cubes.rotation.y = -a*0.0002;
  
  renderer.render(scene, camera);
  
}

createScene();
requestAnimationFrame(render);