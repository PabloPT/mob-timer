class MobWatchApp {
  textFont;
  clockDisplay;
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  stopWatch = new StopWatch(10);
  particleSystem = new ParticleSystem(); //initiate to avoid undefined checks, reinitiate on font loaded

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
    this.camera.position.set(0, 0, 15);

    this.ambientLight = new THREE.AmbientLight(0x808080);

    this.spotLightTarget = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffc009 })
    );
    this.spotLightTarget.visible = false;
    this.spotLightTarget.position.set(2, 0, 0);

    this.orbitingSpotLight = this.createOrbitingSpotLight(this.spotLightTarget);
    this.orbitingSpotLight.visible = false;

    const mainSpotLight = new THREE.SpotLight(0xffc009);
    mainSpotLight.position.set(2, 8, -10);
    mainSpotLight.castShadow = true;
    mainSpotLight.shadow.mapSize.width = 1024;
    mainSpotLight.shadow.mapSize.height = 1024;
    mainSpotLight.shadow.camera.near = 500;
    mainSpotLight.shadow.camera.far = 4000;
    mainSpotLight.shadow.camera.fov = 30;
    mainSpotLight.angle = Math.PI / 10;

    this.scene.add(this.ambientLight);
    this.scene.add(this.spotLightTarget);
    this.scene.add(this.orbitingSpotLight);
    this.scene.add(mainSpotLight);

    this.mob = new Mob();

    window.addEventListener('resize', this.resizeCamera, false);

    this.animate();
  }

  addNewMobster = name => {
    const mobster = new MobsterTextMesh(name, this.textFont, 0x00ff00);
    this.mob.addMobster(mobster);
    this.scene.add(mobster);
    this.mob.positionMobsters();

    if (this.mob.mobsters.length === 1) {
      this.setActiveMobster(mobster);
      this.orbitingSpotLight.visible = true;
      this.orbitingSpotLight.paused = false;
    } else {
      this.clockDisplay.alignToTargetHeight(
        this.mob.getMobster(0).getCenterPoint()
      );
      this.orbitingSpotLight.setOrbitingCenter(this.mob.getMobster(0));
    }
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
      if (mobster) {
        this.setActiveMobster(mobster);
        this.particleSystem.setOriginPosition(mobster.getCenterPoint());
      }
      this.particleSystem.show();
    }
  };

  setActiveMobster = mobster => {
    this.mob.setActiveMobster(mobster);
    this.orbitingSpotLight.setOrbitingCenter(mobster);
    this.clockDisplay.alignToTargetHeight(mobster.getCenterPoint());
    this.particleSystem.setOriginPosition(mobster.getCenterPoint());
    this.stopWatch.reset();
    this.orbitingSpotLight.paused = false;
    window.doReset();
  };

  onMouseMove = event => {};
  onMouseUp = event => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    for (let hitObject of intersects) {
      if (
        hitObject.object.parent &&
        hitObject.object.parent instanceof MobsterTextMesh
      ) {
        this.setActiveMobster(hitObject.object.parent);
      }
    }
  };
  pauseOrbitingSpotLight = event => {
    if (event.keyCode === 32) this.orbitingSpotLight.togglePauseOrbit();
  };
  stopWatchStart = () => {
    this.stopWatch.start();
    this.orbitingSpotLight.paused = true;
    this.particleSystem.hide();
  };
  stopWatchPause = () => {
    this.stopWatch.pause();
    this.orbitingSpotLight.paused = false;
    const activeMobster = this.mob.getActiveMobster();
    this.particleSystem.setOriginPosition(activeMobster.getCenterPoint());
    this.particleSystem.show();
  };
  stopWatchReset = () => {
    this.stopWatch.reset();
    this.orbitingSpotLight.paused = false;
    const activeMobster = this.mob.getActiveMobster();
    this.particleSystem.setOriginPosition(activeMobster.getCenterPoint());
    this.particleSystem.show();
  };
  loadMobsters = textFont => {
    this.textFont = textFont;
  };
  loadClockDisplay = numberFont => {
    this.clockDisplay = new ClockDisplay(
      numberFont,
      0x00ff00,
      new THREE.Vector3(-4, 0, 0)
    );
    this.scene.add(this.clockDisplay);
  };
  loadParticleSystem = font => {
    let size = new THREE.Vector2();
    this.renderer.getSize(size);
    this.particleSystem = new ParticleSystem(font, 100, 50, 20);
    this.scene.add(this.particleSystem);
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    this.isTimeUp();
    this.orbitingSpotLight.calculateNewPosition();
    if (this.clockDisplay) {
      this.setClockDisplayText();
    }
    this.particleSystem.moveParticles();
    this.renderer.render(this.scene, this.camera);
  };
}
