class MobWatchApp {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.textFont;
    this.clockDisplay;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.stopWatch = new StopWatch(10);
    this.particleSystem = new ParticleSystem(); //initiate to avoid undefined checks, reinitiate on font loaded
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

    const mainSpotLight = new THREE.SpotLight(0xffc009);
    mainSpotLight.position.set(2, 8, -10);
    mainSpotLight.castShadow = true;
    mainSpotLight.shadow.mapSize.width = 1024;
    mainSpotLight.shadow.mapSize.height = 1024;
    mainSpotLight.shadow.camera.near = 500;
    mainSpotLight.shadow.camera.far = 4000;
    mainSpotLight.shadow.camera.fov = 30;
    mainSpotLight.angle = Math.PI / 10;
    this.mob = new MobGroup();
    this.scene.add(this.ambientLight);
    this.scene.add(this.spotLightTarget);
    this.scene.add(this.orbitingSpotLight);
    this.scene.add(mainSpotLight);
    this.scene.add(this.mob);

    this.animate();
  }

  addNewMobster(name) {
    const newMobster = this.mob.addMobster(name, this.textFont);
    this.mob.positionMobsters();

    const activeMobster = this.mob.getActiveMobster();
    if (activeMobster == newMobster) {
      this.getReadyToStart(newMobster);
    } else {
      this.reAlignAroundActiveMobster(activeMobster);
    }
  }

  createOrbitingSpotLight(spotLightTarget) {
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

    //flares
    const textureFlare0 = this.textureLoader.load(
      'https://threejs.org/examples/textures/lensflare/lensflare0.png'
    );
    const textureFlare3 = this.textureLoader.load(
      'https://threejs.org/examples/textures/lensflare/lensflare3.png'
    );

    const lensflare = new THREE.Lensflare();
    lensflare.addElement(
      new THREE.LensflareElement(textureFlare0, 100, 0, spotLight.color)
    );
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.2));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 80, 0.5));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.8));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 150, 1));
    spotLight.add(lensflare);
    return spotLight;
  }

  generateRandomColor() {
    return Math.floor(0x1000000 * Math.random());
  }

  resizeCamera() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setClockDisplayText() {
    this.clockDisplay.setText(this.stopWatch.getCountDown());
  }

  isTimeUp() {
    if (this.stopWatch.timeIsUp) {
      this.stopWatch.timeIsUp = false;

      const mobster = this.mob.setNextMobsterAsActive();
      if (mobster) {
        this.getReadyToStart(mobster);
      }
    }
  }

  getReadyToStart(mobster) {
    this.mob.setActiveMobster(mobster);
    this.reAlignAroundActiveMobster(mobster);
    this.orbitingSpotLight.resume();
    this.orbitingSpotLight.show();
    this.particleSystem.show();
    this.stopWatch.reset();
    window.doReset();
  }

  reAlignAroundActiveMobster(activeMobster) {
    this.clockDisplay.alignToTargetHeight(activeMobster.getCenterPoint());
    this.particleSystem.setOriginPosition(activeMobster.getCenterPoint());
    this.orbitingSpotLight.setOrbitingCenter(activeMobster);
  }

  onMouseMove(event) {}
  onMouseUp(event) {
    if (!this.mouse) {
      return;
    }
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
        this.getReadyToStart(hitObject.object.parent);
      }
    }
  }
  pauseOrbitingSpotLight(event) {
    if (event.keyCode === 32) this.orbitingSpotLight.togglePauseOrbit();
  }
  stopWatchStart() {
    this.stopWatch.start();
    this.orbitingSpotLight.pause();
    this.particleSystem.hide();
  }
  stopWatchPause() {
    if (this.stopWatch.paused) {
      this.stopWatch.resume();
      this.orbitingSpotLight.pause();
      this.particleSystem.hide();
    } else {
      this.stopWatch.pause();
      this.orbitingSpotLight.resume();
      this.particleSystem.show();
    }
  }
  stopWatchReset() {
    this.stopWatch.reset();
    this.orbitingSpotLight.resume();
    this.particleSystem.show();
  }
  loadMobsters(textFont) {
    this.textFont = textFont;
  }
  loadClockDisplay(numberFont) {
    this.clockDisplay = new ClockDisplay(
      numberFont,
      0x00ff00,
      new THREE.Vector3(-4, 0, 0)
    );
    this.scene.add(this.clockDisplay);
  }
  loadParticleSystem(font) {
    let size = new THREE.Vector2();
    this.renderer.getSize(size);
    this.particleSystem = new ParticleSystem(font, 100, 50, 20);
    this.scene.add(this.particleSystem);
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    this.isTimeUp();
    this.orbitingSpotLight.calculateNewPosition();
    if (this.clockDisplay) {
      this.setClockDisplayText();
    }
    this.particleSystem.moveParticles();
    this.renderer.render(this.scene, this.camera);
  }
}
