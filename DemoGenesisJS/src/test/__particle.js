require('test/__base_scene.js');

gu.test.LayerParticle = gu.test.LayerBase.extend({
  ctor: function () {
    this._super();
    this.particle = new cc.ParticleSystem(res.particleBuildingUpgradeDone);
    this.particle.x = cc.winSize.width / 2;
    this.particle.y = cc.winSize.height / 2;
    this.object.addChild(this.particle);
    return true;
  },
  configCSD: function () {
    this._super();
    this.csdName = res.layerTest;
    this.buttons.push('buttonObj');
  },
  onClick: function (button) {
    this.particle.resetSystem();
  }
});
