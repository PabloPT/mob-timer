//in terminal: npm run test:browser

describe('#ParticleSystem()', function() {
  context('generateRandomLetter', function() {
    it('should return random letter', function(done) {
      const loader = new THREE.FontLoader();
      loader.load('../helvetiker_regular.typeface.json', font => {
        const ps = new ParticleSystem(font, 1);
        expect(1).to.equal(ps.generateRandomLetter().length);
        done();
      });
    });
  });
  context('constructor', function() {
    it('should generate as many particles as particleCount', function(done) {
      const loader = new THREE.FontLoader();
      loader.load('../helvetiker_regular.typeface.json', font => {
        const ps = new ParticleSystem(font, 100);
        expect(100).to.equal(ps.children.length);
        done();
      });
    });
  });
  context('animation', function() {
    it('should move particles', function(done) {
      const loader = new THREE.FontLoader();
      loader.load('../helvetiker_regular.typeface.json', font => {
        const ps = new ParticleSystem(font, 1);

        ps.moveParticles();
        ps.children.forEach(p => {
          expect(p.position.y).to.not.equal(0);
        });

        done();
      });
    });
    it('should move apply gravity', function(done) {
      var x = THREE.Math.lerp(0, 4 + -2, 0.5);
      expect(x).to.equal(1);
      x = THREE.Math.lerp(1, 3.6 + -2, 0.5);
      expect(x).to.equal(1.3);
      x = THREE.Math.lerp(1.3, 3.24 + -2, 0.5);
      expect(x).to.equal(1.27);
      x = THREE.Math.lerp(1.27, 2.9160000000000004 + -2, 0.5);
      expect(x).to.equal(1.2550000000000001);
      //x = THREE.Math.lerp(1.27, 3.24 + -2, 0.5);
      done();
    });
  });
});
