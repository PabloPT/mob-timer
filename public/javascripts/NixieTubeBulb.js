class NixieTubeBulb extends THREE.Group {
  constructor(font, bulbName, bulbPosition) {
    super();
    this.bulbName = bulbName;
    this.bulbFont = font;
    this.bulbNumbers = [];
    this.bulbPosition = bulbPosition;
    this.addAllNumbers();
  }

  addAllNumbers() {
    //add 0-9 to a single bulb
    for (let i = 0; i < 10; i++) {
      const mesh = new THREE.Mesh(
        new THREE.TextGeometry(`${i}`, {
          font: this.bulbFont,
          size: 2,
          height: 0.025
        }),
        new THREE.MeshLambertMaterial({
          color: 0xffffff,
          wireframe: true
        })
      );
      mesh.position.set(
        this.bulbPosition.x,
        this.bulbPosition.y,
        this.bulbPosition.z
      );
      this.bulbNumbers.push(mesh);
    }

    this.bulbNumbers.forEach(b => {
      this.add(b);
    });
  }

  setActiveNumber(activeNumber) {
    this.bulbNumbers.forEach(num => {
      num.active = false;
    });
    const bulbNumber = this.bulbNumbers[activeNumber];
    bulbNumber.active = true;
    bulbNumber.material.color.set(0xffa500);
    bulbNumber.material.emissive.set(0xffa500);
  }

  getBulbNumbers() {
    return this.bulbNumbers;
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
