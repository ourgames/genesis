#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os, sys, re  
import shutil, xlrd, string, math
import imp 
imp.reload(sys) 
sys.setdefaultencoding('utf-8')

def recreate_folder(folder):
    if os.path.exists(folder):
        shutil.rmtree(folder)
    if os.path.exists(folder) == False:
        os.makedirs(folder)

def read_excel(file):
    try:
        data = xlrd.open_workbook(file)
        return data
    except Exception, e:
        print('**ERROR', str(e))

def read_sheets_to_dict(excelData, avaliable_sheets):
    sheetsDict = {}
    sheetNames = excelData.sheet_names()
    for sheetName in sheetNames: # read all sheets
        if not avaliable_sheets.has_key(sheetName):
            continue

        sht = excelData.sheet_by_name(sheetName)
        sheetsDict[sheetName] = []

        for rownum in range(sht.nrows): # read a row of a sheet
            sheetsDict[sheetName].append([])
            for colnum in range(sht.ncols):
                try:
                    cell = sht.cell(rownum, colnum)
                    sheetsDict[sheetName][rownum].append(cell)
                except Exception, e:
                    print('**ERROR', sheetName, rownum, colnum, e)
                    continue
    return sheetsDict

def get_config_js_file_name(sheet_name):
    return sheet_name.replace('item_', 'cfg_').replace('.xml', '')

nums = string.digits
def check(a):
    if type(a) is not str:
        return False
    else:
        for i in a:
            if i not in nums:
                return False
        return True

def get_nbg_xml(sheetsDict, avaliable_sheets):
    groups = {}
    jss = {}

    for sheet_name, sheet_matrix in sheetsDict.iteritems():
        if not avaliable_sheets.has_key(sheet_name):
            continue

        hasGroupId = avaliable_sheets[sheet_name]

        short_sheet_name = sheet_name.replace('item_', '').replace('.xml', '')
        js_sheet_name = get_config_js_file_name(sheet_name)
        titles = {}
        groupstr = ''
        jsstr = ''
        startRow = -1
        startCol = -1

        isTitleFinished = False
        isFinished = False
        for rownum in range(len(sheet_matrix)):
            rowstr = ''
            rowjs = ''

            id_cell = None
            for colnum in range(len(sheet_matrix[rownum])):
                cell = sheet_matrix[rownum][colnum].value

                # 找到表头
                if 'id' == cell:
                    startRow = rownum
                    startCol = colnum

                isCellFloat = False
                if isinstance(cell, int):
                    cell = '%0d' % cell
                    isCellFloat = True
                elif isinstance(cell, float):
                    diffValue = cell - math.floor(cell)
                    if diffValue > 0:
                        # cell = '%f' % cell
                        cell = cell
                    else:
                        cell = '%0d' % cell
                    isCellFloat = True
                else:
                    isCellFloat = check(str(cell.decode()))

                if startRow >= 0 and startCol >= 0 and cell != None and isTitleFinished == False and len(str(cell)) <= 0:
                    isTitleFinished = True

                # 遇到没有 id 值的行，结束
                if startRow >= 0 and startCol >= 0 and cell != None and isTitleFinished and titles.has_key(colnum) and 'id' == titles[colnum]:
                    id_cell = str(cell)
                if id_cell != None and len(id_cell) <= 0:
                    isFinished = True
                    break

                if startRow >= 0 and startCol >= 0 and cell != None and len(str(cell)) > 0:
                    if rownum == startRow and isTitleFinished == False:
                        # if str(cell) != '|' and str(cell) != ';':
                        titles[colnum] = str(cell)
                    elif titles.has_key(colnum):
                        rowstr = rowstr + ' ' + titles[colnum] + '="' + str(cell) + '"'

                        if 'id' == titles[colnum]:
                            id_cell = str(cell)
                            rowjs =  '__data[\'%s\'] = {%s' % (str(cell), rowjs)
                            # print rowjs
                        elif isCellFloat and 'name' != titles[colnum] and 'description' != titles[colnum]:
                            rowjs = '%s, %s:%s' % (rowjs, titles[colnum], str(cell))
                        else:
                            rowjs = '%s, %s:"%s"' % (rowjs, titles[colnum], str(cell))
            # col ends

            # 遇到没有 id 值的行，结束
            if isFinished:
                break

            if len(rowstr) > 0:
                groupstr = groupstr + '        <ItemSpec' + rowstr + '/>\n'

            if len(rowjs) > 0:
                jsstr = jsstr + '\n' + rowjs + '};'
        # row ends

        if len(groupstr) > 0:
            if hasGroupId:
                groupstr = '<Group id="' + short_sheet_name + '">\n' + groupstr + '    </Group>'
                # fuck
                groupstr = groupstr.replace('<Group id="item">', '<Group id="data_config">')
            groups[sheet_name] = groupstr

        if len(jsstr) > 0:
            # 文件头
            jss[sheet_name] = "require('data/util/data_pack.js');" + "\n\n"
            jss[sheet_name] = jss[sheet_name] + "(function(){" + "\n\n"
            # 表名
            jss[sheet_name] = jss[sheet_name] + '// ' + sheet_name + "\n\n"
            # js table name
            jss[sheet_name] = jss[sheet_name] + "var __data = {};" + "\n\n"

            # jss[sheet_name] = jss[sheet_name] + "__data" + js_sheet_name + ' = {}\n\n'
            # keys
            for colnum, title in titles.iteritems():
                jss[sheet_name] = "%s// %s[id]['%s']\n" % (jss[sheet_name], js_sheet_name, title)
            # 列
            jss[sheet_name] = jss[sheet_name] + jsstr + '\n'
             # 清理多余字符
            jss[sheet_name] = jss[sheet_name].replace('{, ', '{')
    # sheet ends

    return (groups, jss)

def export_xml(excels_path, xml_path, js_path, avaliable_xml):
    if len(avaliable_xml) <= 0:
        pass
    list_dirs = os.walk(excels_path)
    for root, dirs, files in list_dirs:
        for f in files:
            if (f.find('.xlsx') > 0 or f.find('.xls') > 0) and f.find('~$') < 0:
                filepath = os.path.join(root, f)
                print(filepath)
                excelData = read_excel(filepath)
                sheetsDict = read_sheets_to_dict(excelData, avaliable_xml)
                groups_jss = get_nbg_xml(sheetsDict, avaliable_xml)

                groups = groups_jss[0]
                for sheet_name, xml_str in groups.iteritems():
                    print('    ' + sheet_name)
                    xml_str = '''<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<tns:database xmlns:tns="http://www.iw.com/sns/platform/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    %s
</tns:database>''' % xml_str
                    xml_filepath = os.path.join(xml_path, sheet_name)
                    xml = open(xml_filepath, 'w')
                    xml.write(xml_str)
                    xml.close()

                if len(js_path) > 0:
                    jss = groups_jss[1]
                    for sheet_name, js_str in jss.iteritems():
                        cfg_sheetname = get_config_js_file_name(sheet_name)
                        js_str = '''%s\n\ngu.data.%s = new gu.data.DataPack(__data);\n\n}());''' % (js_str , cfg_sheetname)
                        js_filepath = os.path.join(js_path, cfg_sheetname + '.js')
                        js = open(js_filepath, 'w')
                        js.write(js_str)
                        js.close()
    pass

# -----------------------------------------------------------------------------
# 客户端 sheetName:hasGroupId
avaliable_xml = {
    'item_building.xml':True,
    'item_power.xml':True,
    'item_general.xml':True,
    'item_goods.xml':True,
    'item_arms.xml':True,
    'item_status.xml':True,
    'item_science.xml':True,
    'item_quest.xml':True,
    'item_plot.xml':True,
    'item_guide.xml':True,
    'item_loadingTips.xml':True,
    'item_house.xml':True,
    'item_role.xml':True,
    'item_grade.xml':True,
    'item_upgradeNotice.xml':True,
    'item_position.xml':True,
    'item_wonder.xml':True,
    'item_vip.xml':True,
    'item_scienceType.xml':True,
    'item_wonder.xml':True,
    'item_tower.xml':True,
    'item_gift.xml':True,
    'item_rank.xml':True,
    'item_alliancescience.xml':True,
    'item_allianceshop.xml':True,
    'item_position_unlock.xml':True,
    'item_explore.xml':True,
    'item_field_monster.xml':True,
    'item_score.xml':True,
    'item_language.xml':True,
    'item_worldcastle.xml':True,
    'item_ab.xml':True,
    'item_sk.xml':True,
    'item_changeLanguage.xml':True,
    'item_office.xml':True,
    'item_equipment.xml':True,
    'item_lordDetails.xml':True,
    'item_activity_panel.xml':True,
    'item_lueagearea.xml':True,
    'item_achievement.xml':True,
    'item_medal.xml':True,
    'item_resource2.xml':True,
    'item_daily_quest.xml':True,
    'item_territory_effect.xml':True,
    'item_territory.xml':True,
    'item_serverpos.xml':True,
    'item_trial.xml':True,
    'item_territory_banner.xml':True,
    'item_quest_phase.xml':True,
    'item_svip.xml':True,
    'c_resource_generation.xml':True,
    'c_world_city.xml':True,
    'c_world_map.xml':True,
}

# 服务器 sheetName:hasGroupId
avaliable_server_xml = {
    'ab.xml':False,
    'ability.xml':False,
    'accumulate.xml':False,
    'achievement.xml':False,
    'activity_panel.xml':False,
    'alliancescience.xml':False,
    'allianceshop.xml':False,
    'area.xml':False,
    'arms.xml':False,
    'army.xml':False,
    'building.xml':False,
    'cargo.xml':False,
    'daily_quest.xml':False,
    'daily_reward.xml':False,
    'deep_link.xml':False,
    'effect.xml':False,
    'emulator.xml':False,
    'equipment.xml':False,
    'events.xml':False,
    'exchange.xml':False,
    'explore.xml':False,
    'fb_share.xml':False,
    'field_monster.xml':False,
    'fragment.xml':False,
    'general.xml':False,
    'gift.xml':False,
    'gold_price.xml':False,
    'goods.xml':False,
    'grade.xml':False,
    'heap.xml':False,
    'heritage.xml':False,
    'heroactivity.xml':False,
    'heroevent.xml':False,
    'hotgoods.xml':False,
    'hotstore.xml':False,
    'house.xml':False,
    'item.xml':False,
    'lottery.xml':False,
    'mail.xml':False,
    'office.xml':False,
    'onlineReward.xml':False,
    'package.xml':False,
    'position.xml':False,
    'position_unlock.xml':False,
    'princess.xml':False,
    'quest.xml':False,
    'rank.xml':False,
    'resdential.xml':False,
    'resource2.xml':False,
    'reward.xml':False,
    'role.xml':False,
    'science.xml':False,
    'score.xml':False,
    'setting.xml':False,
    'sign_in.xml':False,
    'sk.xml':False,
    'skill2.xml':False,
    'soldiers.xml':False,
    'status.xml':False,
    'svip.xml':False,
    'territory.xml':False,
    'territory_effect.xml':False,
    'time_gift.xml':False,
    'treasure.xml':False,
    'trial.xml':False,
    'vip.xml':False,
    'wb_kill.xml':False,
    'wb_reward.xml':False,
    'wb_skill.xml':False,
    'wonder.xml':False,
    'world_city.xml':False,
}

script_path = os.path.split(os.path.realpath(__file__))[0]

#
excels_path = os.path.join(script_path, './excel')
xml_path = os.path.join(script_path, './export/xml')
js_path = os.path.join(script_path, './export/xml_js')
recreate_folder(xml_path)
recreate_folder(js_path)
export_xml(excels_path, xml_path, js_path, avaliable_xml)

#
xml_server_path = os.path.join(script_path, './export/xml_server')
recreate_folder(xml_server_path)
export_xml(excels_path, xml_server_path, '', avaliable_server_xml)

