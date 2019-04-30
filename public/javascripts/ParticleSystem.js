class ParticleSystem extends THREE.Group {
  constructor(font, particleCount, sceneWidth, sceneHeight) {
    super();
    this.originPosition = new THREE.Vector3(0, 0, 0);
    this.showParticles = false;
    this.velocityMax = 5;
    this.liftMax = 8;
    this.sceneHeight = sceneHeight;
    this.sceneWidth = sceneWidth;
    if (!font && !particleCount) {
      return;
    }
    for (let i = 0; i < particleCount; i++) {
      const letterMesh = new THREE.Mesh(
        new THREE.TextGeometry(this.generateRandomLetter(), {
          font: font,
          size: 0.5,
          height: 0.25
        }),
        new THREE.MeshLambertMaterial({ color: this.generateRandomColor() })
      );
      letterMesh.velocityX =
        Math.random() * (this.velocityMax - -this.velocityMax) +
        -this.velocityMax;
      letterMesh.velocityZ =
        Math.random() * (this.velocityMax - -this.velocityMax) +
        -this.velocityMax;
      letterMesh.lift = Math.random() * (this.liftMax - 1) + 1;
      letterMesh.alpha = 0.1;
      this.add(letterMesh);
    }
  }

  show() {
    this.showParticles = true;
  }

  hide() {
    this.showParticles = false;
  }

  generateRandomColor() {
    //return Math.floor(0x1000000 * Math.random());//any color
    return Math.floor(0x100 * Math.random()) << 8; //shades of green
  }

  generateRandomLetter() {
    const letterToChooseFrom =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ(){}#$;:+-!?%&<>123456789';
    const randomNumber = Math.floor(
      Math.random() * (letterToChooseFrom.length - 0) + 0
    );
    return letterToChooseFrom.substring(randomNumber, randomNumber + 1);
  }

  setOriginPosition(position) {
    if (position) {
      this.originPosition = position;
    }
  }

  moveParticles() {
    this.children.forEach(p => {
      p.position.y = THREE.Math.lerp(p.position.y, p.lift, 0.1);
      p.lift -= 0.1;

      p.position.x = THREE.Math.lerp(
        p.position.x,
        p.position.x + p.velocityX,
        0.1
      );

      p.position.z = THREE.Math.lerp(
        p.position.z,
        p.position.z + p.velocityZ,
        0.1
      );

      //if out of scene, reinitiate
      if (p.position.y < -this.sceneHeight) {
        this.reInitiateParticle(p);
      }

      if (p.position.x > this.sceneWidth || p.position.x < -this.sceneWidth) {
        this.reInitiateParticle(p);
      }
    });
  }
  reInitiateParticle(p) {
    p.visible = this.showParticles;
    p.position.y = this.originPosition.y;
    p.lift = Math.random() * (this.liftMax - 1) + 1;
    p.velocityX =
      Math.random() * (this.velocityMax - -this.velocityMax) +
      -this.velocityMax;
    p.velocityZ =
      Math.random() * (this.velocityMax - -this.velocityMax) +
      -this.velocityMax;
    p.position.x = this.originPosition.x;
    p.position.z = this.originPosition.z;
  }
}
