
var md5 = require('../../utils/md5')

exports.login = function (login_data, login_config={}) {
    console.log('login')
    console.log(login_data)
    console.log(login_config)
    var app_server_key = login_config['appKey']

    var openid = login_data.openId || ''
    var t = login_data['timestamp']
    var sign = login_data['sign']

    var sign_str = `${openid}&${t}&${app_server_key}`
    console.log(sign_str)
    var my_sign = md5(sign_str)
    console.log(my_sign)

    var open_id,timestamp,message;
    var code = 1
    try {
        if( sign === my_sign ){
            open_id = openid
            timestamp = t
            code = 0
            message = 'success'
        }else{
            console.log(sign_str)
            message = 'sign error'
        }
    } catch (error) {
        message = error.toString()
    }
    return {code,message,open_id}
};

exports.create = function (login_data, login_config={}) {
    console.log('create')
    
    return 'create'
    // return {code,message,open_id}
};

exports.confirm = function (login_data, login_config={}) {
    console.log('confirm')
    
    return 'confirm'
    // return {code,message,open_id}
};