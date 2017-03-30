require('data/util/data_pack.js');

(function(){

var __data = {};
__data.LEVEL_INFO_TYPE = {
  DESCRIPTION: 0,
  FEATURE: 1,
  VALUE: 2
};
__data[gu.data.building.TYPE.CITY_HALL] = {
  description: '',
  title: 'CITY_HALL',
  detail: [
    { level: 2, food: 10, wood: 10, iron: 0, silver: 0, gold: 50, time: 200, info: { type: __data.LEVEL_INFO_TYPE.FEATURE, features: [100, 110] } },
    { level: 3, food: 20, wood: 20, iron: 0, silver: 0, gold: 100, time: 400, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 100, 105: 100 } } },
    { level: 4, food: 40, wood: 40, iron: 0, silver: 0, gold: 200, time: 800, info: { type: __data.LEVEL_INFO_TYPE.DESCRIPTION, info: 'xxxxx' } },
    { level: 5, food: 40, wood: 40, iron: 0, silver: 0, gold: 400, time: 1600, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 200, 105: 300 } } },
  ]
};
__data[gu.data.building.TYPE.STABLE] = {
  description: 'STABLE STABLE STABLE',
  title: 'STABLE',
  detail: [
    { level: 2, food: 10, wood: 10, iron: 0, silver: 0, gold: 50, time: 3, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 100, 105: 100 } } },
    { level: 3, food: 20, wood: 20, iron: 0, silver: 0, gold: 100, time: 400, info: { type: __data.LEVEL_INFO_TYPE.FEATURE, features: [100, 110] } },
    { level: 4, food: 40, wood: 40, iron: 0, silver: 0, gold: 200, time: 800, info: { type: __data.LEVEL_INFO_TYPE.DESCRIPTION, info: 'xxxxx' } },
    { level: 5, food: 40, wood: 40, iron: 0, silver: 0, gold: 400, time: 1600, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 200, 105: 300 } } },
  ]
};
__data[gu.data.building.TYPE.BARRACKS] = {
  description: 'BARRACKS BARRACKS BARRACKS BARRACKS',
  title: 'BARRACKS',
  detail: [
    { level: 2, food: 10, wood: 10, iron: 0, silver: 0, gold: 50, time: 5, info: { type: __data.LEVEL_INFO_TYPE.DESCRIPTION } },
    { level: 3, food: 20, wood: 20, iron: 0, silver: 0, gold: 100, time: 400, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 100, 105: 100 } } },
    { level: 4, food: 40, wood: 40, iron: 0, silver: 0, gold: 200, time: 800, info: { type: __data.LEVEL_INFO_TYPE.FEATURE, features: [100, 110] } },
    { level: 5, food: 40, wood: 40, iron: 0, silver: 0, gold: 400, time: 1600, info: { type: __data.LEVEL_INFO_TYPE.VALUE, values: { 101: 200, 105: 300 } } },
  ]
}; 

gu.data.building.level = new gu.data.DataPack(__data);

}());
