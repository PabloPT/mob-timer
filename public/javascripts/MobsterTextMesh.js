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
    this.dullFactor = 0.5;
    this.material.color.set(color * this.dullFactor);
    if (!this.geometry.boundingBox) {
      this.geometry.computeBoundingBox();
    }
    //add a plane behind text for raycast-hit-improvement
    const bb = this.geometry.boundingBox;
    let targetV3 = new THREE.Vector3();
    bb.getSize(targetV3);
    const planeRayCastTargetMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(targetV3.x, targetV3.y)
    );
    planeRayCastTargetMesh.material.visible = false;
    //off-set plane to match textgeometry
    const center = this.getCenterPoint();
    planeRayCastTargetMesh.position.x = center.x;
    planeRayCastTargetMesh.position.y = center.y; // + 0.45;
    planeRayCastTargetMesh.position.z = center.z; // + 0.25;
    this.add(planeRayCastTargetMesh);

    this.name = name;
    this.font = font;
    this.color = color;
  }

  setBright() {
    this.material.color.set(this.color);
  }
  setDull() {
    this.material.color.set(this.color * 0.5);
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
