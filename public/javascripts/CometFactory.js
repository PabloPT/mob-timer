class CometFactory {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.gpuParticleSystemOptions = {
      maxParticles: 250000,
      particleNoiseTex: this.textureLoader.load(
        'https://threejs.org/examples/textures/perlin-512.png'
      ),
      particleSpriteTex: this.textureLoader.load(
        'https://threejs.org/examples/textures/particle2.png'
      ),
      position: new THREE.Vector3(),
      positionRandomness: 0.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.5,
      color: 0xaa88ff,
      colorRandomness: 0.2,
      turbulence: 0.5,
      lifetime: 2,
      size: 5,
      sizeRandomness: 1
    };
    this.spawnerOptions = {
      spawnRate: 15000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1
    };
  }
  createComet() {
    const comet = new THREE.GPUParticleSystem(this.gpuParticleSystemOptions);
    comet.gpuParticleSystemOptions = this.gpuParticleSystemOptions;
    comet.spawnerOptions = this.spawnerOptions;
  }
}
