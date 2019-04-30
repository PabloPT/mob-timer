class Mob {
  constructor() {
    this.mobsters = [];
  }

  addMobster(mobster) {
    this.mobsters.push(mobster);
  }

  getMobster(index) {
    return this.mobsters[index];
  }

  getActiveMobster() {
    return this.mobsters.find(m => {
      return m.active;
    });
  }

  setActiveMobster(mobster) {
    if (
      !this.mobsters.find(m => {
        return m === mobster;
      })
    ) {
      throw Error('Mobster not found in mob!');
    }
    for (let m of this.mobsters) {
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
    const toBeActiveMobster = this.mobsters[index];
    if (!toBeActiveMobster) {
      throw Error('Mobster not found in mob!');
    }
    for (let m of this.mobsters) {
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
    const indexToRemove = this.mobsters.findIndex(m => {
      return m === mobster;
    });
    this.mobsters.splice(indexToRemove, 1); //what if last index?
  }

  positionMobsters() {
    const count = this.mobsters.length;
    if (!count) return;

    let startPositionY = (count * 1.5) / 2; // align around y=0
    this.mobsters.forEach(mobster => {
      startPositionY -= 1.5;
      mobster.position.y = startPositionY;
    });
  }

  setNextMobsterAsActive() {
    let activeMobster;
    for (let i = 0; i < this.mobsters.length; i++) {
      let m = this.mobsters[i];
      if (m.active) {
        m.active = false;
        if (i + 1 >= this.mobsters.length) {
          this.mobsters[0].active = true;
          activeMobster = this.mobsters[0];
        } else {
          this.mobsters[i + 1].active = true;
          activeMobster = this.mobsters[i + 1];
        }
        break;
      }
    }

    return activeMobster;
  }
}
