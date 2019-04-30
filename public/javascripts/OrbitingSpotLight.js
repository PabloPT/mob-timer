class OrbitingSpotLight extends THREE.SpotLight {
  constructor(color) {
    super(color);
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
