// //左侧是新api，右侧是旧api
// //常量
// cc.sys.LANGUAGE_ENGLISH         <-- cc.LANGUAGE_ENGLISH 
// cc.sys.LANGUAGE_CHINESE         <-- cc.LANGUAGE_CHINESE
// cc.sys.LANGUAGE_FRENCH          <-- cc.LANGUAGE_FRENCH
// cc.sys.LANGUAGE_ITALIAN         <-- cc.LANGUAGE_ITALIAN
// cc.sys.LANGUAGE_GERMAN          <-- cc.LANGUAGE_GERMAN
// cc.sys.LANGUAGE_SPANISH         <-- cc.LANGUAGE_SPANISH
// cc.sys.LANGUAGE_RUSSIAN         <-- cc.LANGUAGE_RUSSIAN
// cc.sys.LANGUAGE_KOREAN          <-- cc.LANGUAGE_KOREAN
// cc.sys.LANGUAGE_JAPANESE        <-- cc.LANGUAGE_JAPANESE
// cc.sys.LANGUAGE_HUNGARIAN       <-- cc.LANGUAGE_HUNGARIAN
// cc.sys.LANGUAGE_PORTUGUESE      <-- cc.LANGUAGE_PORTUGUESE
// cc.sys.LANGUAGE_ARABIC          <-- cc.LANGUAGE_ARABIC
// cc.sys.LANGUAGE_NORWEGIAN       <-- cc.LANGUAGE_NORWEGIAN
// cc.sys.LANGUAGE_POLISH          <-- cc.LANGUAGE_POLISH

// cc.sys.language                 <-- cc.Application.getInstance().getCurrentLanguage()

gu.locale = {
  _text: {},
  setLocale: function (locale) {
    this.text = this._text[locale];
  }
};
gu.locale._text[cc.sys.LANGUAGE_CHINESE] = {
  scheduler: '定时器',
  counter: '计数',
  touch_event: '触摸事件',
  jsbinding: 'Javascript绑定',
  viewport: '视角',
  view_city: '城市视图',
  grammar: '语法',
  particle: '粒子效果'
};
gu.locale._text[cc.sys.LANGUAGE_ENGLISH] = {
  scheduler: 'Scheduler',
  counter: 'Counter',
  touch_event: 'Touch Events',
  jsbinding: 'Javascript Binding',
  viewport: 'Viewport',
  view_city: 'City View',
  grammar: 'Grammar',
  particle: 'Particle'
};

// 设置当前语言为系统当前语言 set locale to system locale
gu.locale.setLocale(cc.sys.language);
