let canvas;
let camera, scene, renderer;
let uniforms;
let startTime;

init();
animate();

function init() {
  console.log('init');
  container = document.getElementById("webgl-container");
  
  startTime = Date.now();
  
  camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000);
  
  scene = new THREE.Scene();
  
  const geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
  
  uniforms = {
    iTime: {type: "f", value: 1.0},
    iResolution: {type: "v2", value: new THREE.Vector2()},
    iMouse: {type: "v2", value: new THREE.Vector2()},
  }
  
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });
  
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  handleResize();
  window.addEventListener("resize", handleResize);
  
  handleMouseMove({
    clientX: window.innerWidth * 0.5, 
    clientY: window.innerHeight * 0.5,
  });
  window.addEventListener("mousemove", handleMouseMove);
}

function handleResize() {
  uniforms.iResolution.value.x = window.innerWidth * window.devicePixelRatio;
  uniforms.iResolution.value.y = window.innerHeight * window.devicePixelRatio;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function handleMouseMove(event) {
  uniforms.iMouse.value.x = event.clientX * window.devicePixelRatio;
  uniforms.iMouse.value.y = 
    (window.innerHeight - event.clientY) * window.devicePixelRatio;
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

function render() {
  const currentTime = Date.now();
  uniforms.iTime.value = (currentTime - startTime) * 0.001;
  renderer.render(scene, camera);
}