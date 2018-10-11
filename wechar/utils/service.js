/**
 * 接口服务配置文件 
 */

var service = {
  service: {
    m_act_wonderful_list: 'longkin.invest.m_act_wonderful_list', //精彩活动
    m_others_new_detial: "longkin.others.m_others_new_detial", //新闻详情
    m_others_new_list: 'longkin.others.m_others_new_list', //新闻列表
    m_invest_trade_list_index: 'longkin.invest.m_invest_trade_list_index', //首页项目列表
    m_others_getservice_time: 'longkin.others.m_others_getservice_time',
    m_invest_trade_detil: 'longkin.invest.m_invest_trade_detil'
  },

  //系统参数配置
  systemPms: {
    //request_time:"" apihelper.getDate("yyyyMMddHHmmssfff"),//请求时间
    //sign_type: 'md5',//加密方式  
    //partner_id: apihelper.systemConfig.partner_id
    version: '3.6.5', //版本号
    format: 'json', //获取返回数据格式
  },
  
  //API请求配置
  systemConfig: {
    posurl: "https://app.longkin.net", //post API 请求地址
    SECURITYKEY: "longkin123!@#*", //密钥
    partner_id: "17ab7302-6ba9-4c4e-ab48-9ff004951b41", //合作方ID
  }
};

module.exports = service