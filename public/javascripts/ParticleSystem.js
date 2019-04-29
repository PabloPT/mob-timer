class ParticleSystem extends THREE.Group {
  showParticles = false;
  velocityMax = 5;
  liftMax = 8;
  constructor(font, particleCount, sceneWidth, sceneHeight) {
    super();
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
      letterMesh.velocity =
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

  generateRandomColor = () => {
    //return Math.floor(0x1000000 * Math.random());//any color
    return Math.floor(0x100 * Math.random()) << 8; //shades of green
  };

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
      this.position.set(position.x, position.y, position.z);
    }
  }

  moveParticles() {
    this.children.forEach(p => {
      p.position.y = THREE.Math.lerp(p.position.y, p.lift, 0.1);
      p.lift -= 0.1;

      p.position.x = THREE.Math.lerp(
        p.position.x,
        p.position.x + p.velocity,
        0.1
      );

      //if out of scene, reinitiate
      if (p.position.y < -this.sceneHeight) {
        p.visible = this.showParticles;
        p.position.y = 0;
        p.lift = Math.random() * (this.liftMax - 1) + 1;
        p.velocity =
          Math.random() * (this.velocityMax - -this.velocityMax) +
          -this.velocityMax;
        p.position.x = 0;
      }

      if (p.position.x > this.sceneWidth || p.position.x < -this.sceneWidth) {
        p.visible = this.showParticles;
        p.position.y = 0;
        p.lift = Math.random() * (this.liftMax - 1) + 1;
        p.velocity =
          Math.random() * (this.velocityMax - -this.velocityMax) +
          -this.velocityMax;
        p.position.x = 0;
      }
    });
  }
}
