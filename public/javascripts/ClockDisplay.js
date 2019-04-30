class ClockDisplay extends THREE.Group {
  constructor(font, color, position) {
    super();

    this.clockDisplayMesh;
    this.font;
    this.color;
    this.position;

    if (!font && !color && !position) {
      return;
    }

    this.font = font;
    this.color = color;
    this.position.set(position.x, position.y, position.z);
    this.createText('00:00');
    this.add(this.clockDisplayMesh);
  }

  createText(newText) {
    this.clockDisplayMesh = new THREE.Mesh(
      new THREE.TextGeometry(newText, {
        font: this.font,
        size: 1,
        height: 0.25
      }),
      new THREE.MeshLambertMaterial({ color: this.color })
    );
  }

  getCenterPoint() {
    if (!this.clockDisplayMesh.geometry.boundingBox) {
      this.clockDisplayMesh.geometry.computeBoundingBox();
    }
    const bb = this.clockDisplayMesh.geometry.boundingBox;
    const centerTarget = new THREE.Vector3();
    bb.getCenter(centerTarget);
    const positionClone = this.clockDisplayMesh.position.clone();
    positionClone.add(centerTarget);
    return positionClone;
  }
  alignToTargetHeight(targetCenterPosition) {
    if (!this.clockDisplayMesh.geometry.boundingBox) {
      this.clockDisplayMesh.geometry.computeBoundingBox();
    }
    const currentCenterPoint = this.getCenterPoint();
    const differense = targetCenterPosition.y - currentCenterPoint.y;

    this.clockDisplayMesh.position.y += differense;
  }
  textHasChanged(newText) {
    return this.clockDisplayMesh.geometry.parameters.text !== newText;
  }
  setText(newText) {
    if (this.textHasChanged(newText)) {
      this.replaceText(newText);
    }
  }
  replaceText(newText) {
    const p = this.clockDisplayMesh.position;
    this.remove(this.clockDisplayMesh);
    this.createText(newText);
    this.clockDisplayMesh.position.set(p.x, p.y, p.z);
    this.add(this.clockDisplayMesh);
  }
}
