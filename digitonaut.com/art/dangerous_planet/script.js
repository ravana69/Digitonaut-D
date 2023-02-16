// Shaders
		var vertShader = document.querySelector('#vertexshader').innerHTML;
		var fragShader = document.querySelector('#fragmentshader').innerHTML;

		// Renderer
		var renderer = new THREE.WebGLRenderer({canvas:document.getElementById('main'),antialiasing:true});
		
renderer.setClearColor(0x111111);
		renderer.setSize(window.innerWidth,window.innerHeight);

		// Camera
		var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 5000 );
		camera.position.y = 20;
		camera.position.z = 40;

		// Scene
		var scene = new THREE.Scene();
		scene.rotation.x = 2;
		// Create + init position mesh
		var ammount = 1;
		var material = new THREE.ShaderMaterial( {
			uniforms: {
				time: { type: "f", value: 0 },
			},
			vertexShader : vertShader,
			fragmentShader : fragShader
		} );

		var geometry = new THREE.SphereGeometry( 30,200,200);
		var planet = new THREE.Mesh( geometry, material );
		scene.add( planet );
		// planet.scale.x = 1;
		planet.position.x = 0;
		planet.position.y = 0;
		planet.position.z = 0;
		planet.modifier = Math.random();
		planet.material.transparent = true;
		planet.material.opacity = 1*Math.random();

		// Render
		var start = Date.now();
		function render(){
			material.uniforms[ 'time' ].value = .00015 * ( Date.now() - start );

			scene.rotation.y += 0.002;
			
			renderer.render(scene,camera);
			window.requestAnimationFrame(render);
		}

		window.requestAnimationFrame(render);