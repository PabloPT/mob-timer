class MobGroup extends THREE.Group {
  constructor() {
    super();
    //this.mobsters = [];
  }

  addMobster(name, font) {
    const newMobster = new MobsterTextMesh(name, font, 0x00ff00);
    this.add(newMobster);

    if (this.children.length === 1) {
      this.setActiveMobster(newMobster);
    }

    return newMobster;
  }

  getMobster(index) {
    return this.children[index];
  }

  getActiveMobster() {
    return this.children.find(m => {
      return m.active;
    });
  }

  setActiveMobster(mobster) {
    if (
      !this.children.find(m => {
        return m === mobster;
      })
    ) {
      throw Error('Mobster not found in mob!');
    }
    for (let m of this.children) {
      if (m != mobster) {
        m.active = false;
        m.setDull();
      } else {
        m.active = true;
        m.setBright();
      }
    }
  }

  setActiveMobsterByIndex(index) {
    const toBeActiveMobster = this.children[index];
    if (!toBeActiveMobster) {
      throw Error('Mobster not found in mob!');
    }
    for (let m of this.children) {
      if (m != toBeActiveMobster) {
        m.active = false;
        m.setDull();
      } else {
        m.active = true;
        m.setBright();
      }
    }
  }
  removeMobster(mobster) {
    const indexToRemove = this.children.findIndex(m => {
      return m === mobster;
    });

    this.children.splice(indexToRemove, 1); //what if last index?
  }

  positionMobsters() {
    const count = this.children.length;
    if (!count) return;

    let startPositionY = (count * 1.5) / 2; // align around y=0
    this.children.forEach(mobster => {
      startPositionY -= 1.5;
      mobster.position.y = startPositionY;
    });
  }

  setNextMobsterAsActive() {
    let activeMobster;
    for (let i = 0; i < this.children.length; i++) {
      let m = this.children[i];
      if (m.active) {
        m.active = false;
        if (i + 1 >= this.children.length) {
          this.children[0].active = true;
          activeMobster = this.children[0];
        } else {
          this.children[i + 1].active = true;
          activeMobster = this.children[i + 1];
        }
        break;
      }
    }

    return activeMobster;
  }
}
