var res = {
  // scene
  layerTitle: 'csd/scene/layer_title.json',
  layerTouch: 'csd/test/layer_touch.json',
  layerGrammar: 'csd/test/layer_grammar.json',
  layerJSBinding: 'csd/test/layer_js_binding.json',
  layerViewport: 'csd/test/layer_viewport.json',

  // view
  layerViewCity: 'csd/view/layer_view_city.json',
  layerViewCityUpper: 'csd/view/layer_view_city_upper.json',

  // ui
  layerUICity: 'csd/ui/layer_ui_city.json',
  layerUIDialog: 'csd/ui/layer_ui_dialog.json',

  // build
  buildingButton: 'csd/building/ui/building_button.json',
  buildingMenu: 'csd/building/ui/building_menu.json',
  builidngBalloonButton: 'csd/building/ui/building_balloon_button.json',

  // dialog
  dialogBuildinigUpgrade: 'csd/dialog/building/dialog_building_upgrade.json',
  dialogBuildinigUpgradeNewFeature: 'csd/dialog/building/dialog_building_upgrade_new_feature.json',
  dialogBuildinigUpgradeNewValue: 'csd/dialog/building/dialog_building_upgrade_new_value.json',

  // prompt
  promptInstantTip: 'csd/prompt/prompt_instant_tip.json',

  // test
  layerTest: 'csd/scene/layer_test.json',

  // particle 
  particleBuildingUpgradeDone: 'res/particle/building/build_upgrade_done.plist',
};

var g_resources = [];
for (var i in res) {
  g_resources.push(res[i]);
}
