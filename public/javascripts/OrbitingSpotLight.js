class OrbitingSpotLight extends THREE.SpotLight {
  constructor(color) {
    super(color);
    // this.tick = 0;
    // this.clock = new THREE.Clock();
    this.elipseMaxWidth = 3; //elipsens x-längd
    this.elipseMaxDepth = 2; //elipsens z-längd
    this.elipseRevolvingPointX = 0; //start x
    this.elipseRevolvingPointY = 0; //start py
    this.elipseRevolvingPointZ = 0;
    this.timeAlpha = 0;
    this.spotLightPositionX = 0;
    this.spotLightPositionY = 0; //height or orbit
    this.spotLightPositionZ = 0;
    this.paused = false;
    this.visible = false;
    // const cometFactory = new CometFactory();
    // this.comet = cometFactory.createComet();
    // this.add(this.comet);
  }

  setOrbitingCenter(mobsterTextMesh) {
    const newCenterPoint = mobsterTextMesh.getCenterPoint();
    this.spotLightPositionY = newCenterPoint.y + 1;
    this.elipseRevolvingPointY = newCenterPoint.y;

    this.elipseRevolvingPointZ = 0;
    this.target.position.set(
      newCenterPoint.x,
      newCenterPoint.y,
      newCenterPoint.z
    );
    this.position.y = this.spotLightPositionY;
    const boxSize = new THREE.Vector3();
    mobsterTextMesh.geometry.computeBoundingBox();
    mobsterTextMesh.geometry.boundingBox.getSize(boxSize);
    this.elipseMaxWidth = boxSize.x + 1;
  }

  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }

  pause() {
    this.paused = true;
  }
  resume() {
    this.paused = false;
  }

  togglePauseOrbit() {
    this.paused = !this.paused;
    if (this.paused) {
      const angle = this.position.angleTo(this.target.position);
      console.log('paused at position: ', this.position);
      console.log('paused at angle : ', angle);
    }
  }

  spotLightIsInFrontOfTarget() {
    return (
      this.position.z > 0 &&
      Math.round(this.position.x) === Math.round(this.target.position.x)
    );
  }

  calculateNewPosition() {
    if (this.position.z > 0) {
      const lensflare = this.children.find(c => {
        return c instanceof THREE.Lensflare;
      });
      if (lensflare) lensflare.visible = false;
    } else {
      const lensflare = this.children.find(c => {
        return c instanceof THREE.Lensflare;
      });
      if (lensflare) lensflare.visible = true;
    }

    if (this.paused && this.spotLightIsInFrontOfTarget()) {
      //hide spotlight geometry
      return;
    }

    //particles
    this.timeAlpha += 5;
    this.spotLightPositionX =
      this.elipseRevolvingPointX +
      this.elipseMaxWidth * Math.cos(this.timeAlpha * 0.005);
    this.spotLightPositionZ =
      this.elipseRevolvingPointZ +
      this.elipseMaxDepth * Math.sin(this.timeAlpha * 0.005);
    this.position.set(
      this.spotLightPositionX,
      this.spotLightPositionY,
      this.spotLightPositionZ
    );

    // var delta = this.clock.getDelta() * 1;
    // this.tick += delta;

    // if (this.tick < 0) this.tick = 0;
    // if (delta > 0) {
    //   // this.optionsPSGPU.position.x =
    //   //   Math.sin(this.tick * this.spawnerOptionsPSGPU.horizontalSpeed) * 20;
    //   // this.optionsPSGPU.position.y =
    //   //   Math.sin(this.tick * this.spawnerOptionsPSGPU.verticalSpeed) * 10;
    //   // this.optionsPSGPU.position.z =
    //   //   Math.sin(
    //   //     this.tick * this.spawnerOptionsPSGPU.horizontalSpeed +
    //   //       this.spawnerOptionsPSGPU.verticalSpeed
    //   //   ) * 5;
    //   for (var x = 0; x < this.comet.spawnerOptions.spawnRate * delta; x++) {
    //     // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
    //     // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
    //     this.comet.spawnParticle(this.comet.gpuParticleSystemOptions);
    //   }
    // }

    // this.comet.update(this.tick);
  }
}
