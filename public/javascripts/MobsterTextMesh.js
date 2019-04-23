class MobsterTextMesh extends THREE.Mesh {
  constructor(name, font, color) {
    super(
      new THREE.TextGeometry(name, {
        font: font,
        size: 1,
        height: 0.25
      }),
      new THREE.MeshLambertMaterial({ color: color })
    );

    this.name = name;
    this.font = font;
    this.color = color;
  }

  getCenterPoint() {
    if (!this.geometry.boundingBox) {
      this.geometry.computeBoundingBox();
    }
    const bb = this.geometry.boundingBox;
    const centerTarget = new THREE.Vector3();
    bb.getCenter(centerTarget);
    const positionClone = this.position.clone();
    positionClone.add(centerTarget);
    return positionClone;
  }
}
