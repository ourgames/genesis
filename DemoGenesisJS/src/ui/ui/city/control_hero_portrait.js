require('ui/base/base_csd_layer.js');

gu.ui.ui.ControlHeroPortrait = gu.ui.BaseBindNode.extend({
  configCSD: function () {
    this._super();
    this.controlNames.push('bg_player_health', 'bg_player_mana', 'bg_player_vip_disabled', 'bg_player_vip');
    this.clickables.push('hero_portrait');
  },
});
