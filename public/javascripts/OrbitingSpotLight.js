class OrbitingSpotLight extends THREE.SpotLight {
  paused = false;
  constructor(color) {
    super(color);
  }
  elipseMaxWidth = 3; //elipsens x-längd
  elipseMaxDepth = 2; //elipsens z-längd
  elipseRevolvingPointX = 0; //start x
  elipseRevolvingPointY = 0; //start py
  elipseRevolvingPointZ = 0;
  timeAlpha = 0;
  spotLightPositionX = 0;
  spotLightPositionY = 0; //height or orbit
  spotLightPositionZ = 0;

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
    if (this.paused && this.spotLightIsInFrontOfTarget()) {
      //hide spotlight geometry
      return;
    }
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
  }
}
