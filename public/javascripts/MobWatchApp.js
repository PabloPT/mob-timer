class MobWatchApp {
  textFont;
  clockDisplay;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  stopWatch = new StopWatch(10);

  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this.camera.position.z = 15;
    // this.camera.position.y = 1;
    // this.camera.position.x = -2;
    //this.camera.position.set(-2, 1, 15);
    this.camera.position.set(0, 0, 15);
    //this.camera.rotation.y = (-16 * Math.PI) / 180;
    //this.cameraHelper = new THREE.CameraHelper(this.camera);
    //this.scene.add(this.cameraHelper);

    this.ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(this.ambientLight);
    this.spotLightTarget = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffc009 })
    );
    this.spotLightTarget.visible = false;
    this.spotLightTarget.position.set(2, 0, 0);
    this.scene.add(this.spotLightTarget);

    this.orbitingSpotLight = this.createOrbitingSpotLight(this.spotLightTarget);
    this.orbitingSpotLight.visible = false;
    this.scene.add(this.orbitingSpotLight);

    this.mob = new Mob();

    window.addEventListener('resize', this.resizeCamera, false);

    this.animate();

    //this.stopWatch = new StopWatch(10);
  }

  addNewMobster = name => {
    const mobster = new MobsterTextMesh(name, this.textFont, 0xff0000);
    this.mob.addMobster(mobster);
    this.scene.add(mobster);
    this.mob.positionMobsters();

    if (this.mob.mobsters.length === 1) this.setActiveMobster(mobster);
    else {
      this.setActiveMobster(this.mob.getMobster(0));
    }
    this.orbitingSpotLight.visible = true;
    this.orbitingSpotLight.paused = false;
  };

  createOrbitingSpotLight = spotLightTarget => {
    const spotLightSphere = new THREE.SphereBufferGeometry(0.1, 16, 8);
    const spotLight = new OrbitingSpotLight(0xffc009);
    spotLight.add(
      new THREE.Mesh(
        spotLightSphere,
        new THREE.MeshBasicMaterial({ color: 0xffc009 })
      )
    );
    spotLight.position.set(-1, 4.3, 2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    spotLight.angle = Math.PI / 10;
    spotLight.target = spotLightTarget;
    return spotLight;
  };

  generateRandomColor = () => {
    return Math.floor(0x1000000 * Math.random());
  };

  resizeCamera = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  setClockDisplayText = () => {
    this.clockDisplay.setText(this.stopWatch.getCountDown());
  };

  isTimeUp = () => {
    if (this.stopWatch.timeIsUp) {
      this.stopWatch.timeIsUp = false;

      const mobster = this.mob.setNextMobsterAsActive();
      //recator this..
      this.setActiveMobster(mobster);
    }
  };

  // setActiveMobster = mobster => {
  //   this.orbitingSpotLight.setOrbitingCenter(mobster);
  //   this.clockDisplay.alignToTargetHeight(mobster.getCenterPoint());
  // };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.isTimeUp();

    this.orbitingSpotLight.calculateNewPosition();
    //this.cameraHelper.update();
    if (this.clockDisplay) this.setClockDisplayText();
    this.renderer.render(this.scene, this.camera);
  };
  loadMobsters = textFont => {
    this.textFont = textFont;

    // this.addNewMobster('olbap 1');
    // this.addNewMobster('olbap 22');
    // this.addNewMobster('olbap 333');
    // this.addNewMobster('olbap 4444');
    // this.addNewMobster('olbap 55555');
    // this.addNewMobster('olbap 666666');

    //    this.mob.setActiveMobsterByIndex(3);
    //   this.orbitingSpotLight.setOrbitingCenter(this.mob.getMobster(3));
  };
  loadClockDisplay = numberFont => {
    this.clockDisplay = new ClockDisplay(
      numberFont,
      0x00ff00,
      new THREE.Vector3(-4, 0, 0)
    );
    this.scene.add(this.clockDisplay);
  };
  setActiveMobster = mobster => {
    this.mob.setActiveMobster(mobster);
    this.orbitingSpotLight.setOrbitingCenter(mobster);
    this.clockDisplay.alignToTargetHeight(mobster.getCenterPoint());
    //set clock display to duration again??
    this.stopWatch.reset();
  };

  onMouseMove = event => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
  onMouseUp = event => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    for (let hitObject of intersects) {
      if (hitObject.object instanceof MobsterTextMesh) {
        this.setActiveMobster(hitObject.object);
      }
    }
  };
  pauseOrbitingSpotLight = event => {
    if (event.keyCode === 32) this.orbitingSpotLight.togglePauseOrbit();
  };
  stopWatchStart = () => {
    this.stopWatch.start();
    this.orbitingSpotLight.paused = true;
  };
  stopWatchPause = () => {
    this.orbitingSpotLight.paused = this.stopWatch.pause();
  };
  stopWatchReset = () => {
    this.stopWatch.reset();
    this.orbitingSpotLight.paused = false;
  };
}
