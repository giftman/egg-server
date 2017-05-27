var aiaiucode = (function () {
    function aiaiucode() {
    }
    aiaiucode.Info_SUCCESS = 1;
    aiaiucode.Info_CANCEL = 2;
    aiaiucode.Info_FAIL = 3;
    aiaiucode.Info_ERROR = 4;
    aiaiucode.Pay_CLOSE = 5;
    aiaiucode.Pay_SUCCESS = 6;
    aiaiucode.Pay_FAIL = 7;
    aiaiucode.Pay_CANCEL = 8;
    aiaiucode.Pay_ERROR_DATA = 9;
    aiaiucode.Pay_ERROR_PARAM_NUM = 10;
    aiaiucode.Common_SUCCESS = 101;
    aiaiucode.Common_CANCEL = 102;
    aiaiucode.Common_FAIL = 103;
    aiaiucode.Common_ERROR_PARAM_NUM = 104;
    aiaiucode.Common_ERROR_PARAM_EMPTY = 105;
    aiaiucode.Common_ERROR_DATA = 106;
    return aiaiucode;
})();

var aiaiuevent = (function () {
    function aiaiuevent() {
    }
    aiaiuevent.POST_INIT = "AIAIU_SDK_INIT";
    aiaiuevent.POST_PAY = "AIAIU_SDK_PAY";
    aiaiuevent.PAY_CLOSE = "AIAIU_PAY_CLOSE";
    aiaiuevent.PAY_SUCCESS = "AIAIU_PAY_SUCCESS";
    aiaiuevent.PAY_FAIL = "AIAIU_PAY_FAIL";
    aiaiuevent.PAY_CANCEL = "AIAIU_PAY_CANCEL";
    aiaiuevent.PAY_ERROR_DATA = "AIAIU_PAY_ERROR_DATA";
    aiaiuevent.PAY_ERROR_PARAM_NUM = "AIAIU_PAY_ERROR_PARAM_NUM";
    aiaiuevent.JSON_ERROR = "AIAIU_JSON_ERROR";
    aiaiuevent.POST_SHARE = "AIAIU_SDK_SHARE";
    aiaiuevent.POST_APISTATUS = 'AIAIU_SDK_APISTATUS';
    aiaiuevent.POST_FAVORITE = 'AIAIU_SDK_FAVORITE';
    return aiaiuevent;
})();

var aiaiusdk = (function () {
    function aiaiusdk() {
    }
    aiaiusdk.init = function (_initdata) {
        aiaiusdk._bInit = true;
        if(_initdata){
            aiaiusdk._bInit = 1;
            aiaiusdk.open_id = _initdata.open_id;
            aiaiusdk.app_id = _initdata.app_id;
            if(_initdata.channel){
                aiaiusdk.channel = parseInt(_initdata.channel);
                // 加载js
                aiaiusdk.sdkLoad();
            }else{
                window.addEventListener("message", function (evt) {
                    aiaiusdk.SDKEvent(evt.data);
                }, false);
            }
        }else{
            aiaiusdk._bInit = 2;
            window.addEventListener("message", function (evt) {
                aiaiusdk.SDKEvent(evt.data);
            }, false);
        }
    };
    aiaiusdk.logout = function (_logoutdata) {
        var params = {
            open_id : _logoutdata.open_id
        };
        aiaiusdk.sdkLogout(params);
    };
    aiaiusdk.selectServer = function (_serverdata) {
        var params = {
            open_id : _serverdata.open_id,
            server_id : _serverdata.server_id,
            server_name : _serverdata.server_name
        };
        aiaiusdk.server_id = _serverdata.server_id;
        aiaiusdk.jsonp("http://passport.4177.com/game/gameServer?"+aiaiusdk.formatParams(params),function(ret) {
            if(ret.code == 200){
                aiaiusdk.sdkGameServer(ret.data);
            }
        });
    };
    aiaiusdk.createRole = function (_roledata) {
        var params = {
            open_id : _roledata.open_id,
            server_id : _roledata.server_id,
            server_name : _roledata.server_name,
            role_id : _roledata.role_id,
            role_name : _roledata.role_name
        };
        aiaiusdk.server_id = _roledata.server_id;
        aiaiusdk.role_id = _roledata.role_id;
        aiaiusdk.jsonp("http://passport.4177.com/game/gameRole?"+aiaiusdk.formatParams(params),function(ret) {
            if(ret.code == 200){
                aiaiusdk.sdkGameRole(ret.data);
            }
        });
    };
    aiaiusdk.share = function (_data, lisenter) {
        var params = {
            open_id : _data.open_id
        };
        aiaiusdk.PostCommonEvent(params, lisenter, 'share');
    };
    aiaiusdk.favorite = function (_data, lisenter) {
        var params = {
            open_id : _data.open_id
        };
        if(_data.open_id && _data.open_id != ''){
            aiaiusdk.open_id = _data.open_id;
        }
        aiaiusdk.PostCommonEvent(_data, lisenter, 'favorite');
    };
    aiaiusdk.SDKEvent = function (data) {
        console.log("aiaiusdk 收到数据 = " + data);
        var json = JSON.parse(data);
        if (json.action == aiaiuevent.POST_INIT) {
            aiaiusdk.initEvent(json.action, json);
        }
        else if (json.source == 'pay') {
            aiaiusdk.payEvent(json.action, json);
        }
        else if (json.source) {
            aiaiusdk.CommonEvent(json.action, json);
        }
    };
    aiaiusdk.pay = function (_paydata, lisenter) {
        if(aiaiusdk.server_id != ''){
            _paydata.server_id = aiaiusdk.server_id;
        }
        if(aiaiusdk.role_id != ''){
            _paydata.role_id = aiaiusdk.role_id;
        }
        if (arguments.length < 2) {
            lisenter(aiaiucode.Pay_ERROR_PARAM_NUM, "参数错误");
            return;
        }
        if (!_paydata) {
            lisenter(aiaiucode.Pay_ERROR_DATA, "参数错误");
            return;
        }
        this.payListener = lisenter;
        var payStr = JSON.stringify(_paydata);
        if(aiaiusdk.paying){
            return;
        }
        setTimeout(function(){
            aiaiusdk.paying = false;
        },2000);
        aiaiusdk.paying = true;
        // console.log('aiaiu pay');
        aiaiusdk.PostEvent(aiaiuevent.POST_PAY, 'pay', payStr);
    };

    aiaiusdk.PostEvent = function (event, source, data) {
        var params = JSON.parse(data);
        if(aiaiusdk.join == 2){
            aiaiusdk.sdkPay(params);
        }else{
            var ishttps = 'https:' == document.location.protocol ? true: false;
            if(ishttps){
                var psyStyleUrl = 'https://passport.4177.com/pay/payStyle';
            }else{
                var psyStyleUrl = 'http://passport.4177.com/pay/payStyle';
            }
            aiaiusdk.jsonp(psyStyleUrl+"?open_id="+params.open_id,function(ret) {
                if(ret.code == 200 && ret.data.join == 2){
                    aiaiusdk.app_id = ret.data.app_id;
                    aiaiusdk.channel = parseInt(ret.data.channel);
                    if(aiaiusdk._bInit == 2){
                        aiaiusdk._bInit = 1;
                        aiaiusdk.sdkLoad();
                    }
                    aiaiusdk.join = ret.data.join;
                    aiaiusdk.sdkPay(params);
                }else{
                    var msg = {action: event, source: source, data: data};
                    window.parent.postMessage(JSON.stringify(msg), "*");
                }
            });
        }
    };

    // 公用方法START
    aiaiusdk.PostCommonEvent = function (_data, lisenter, source) {
        aiaiusdk[source].lisenter = lisenter;
        var Str = JSON.stringify(_data);
        if(aiaiusdk[source].doing){
            return;
        }
        setTimeout(function(){
            aiaiusdk[source].doing = false;
        },2000);
        aiaiusdk[source].doing = true;
        if(source == 'share'){
            aiaiusdk.sdkShare(source, _data, lisenter);
        }
        if(source == 'favorite'){
            aiaiusdk.sdkFavorite(source, _data, lisenter);
        }
    };
    aiaiusdk.PostCommonCheckPararm = function (_data, lisenter) {
        if (arguments.length < 2) {
            lisenter(aiaiucode.ERROR_PARAM_NUM, "参数错误");
            return;
        }
        if (!aiaiusdk._bInit) {
            lisenter(aiaiucode.Login_FAIL, "操作失败,请先初始化");
            return;
        }
        if (!_data) {
            lisenter(aiaiucode.ERROR_PARAM_EMPTY, "数据参数为空");
            return;
        }
        return true;
    };
    aiaiusdk.CommonEvent = function (evt, data) {
        aiaiusdk[data.source].doing = false;
        switch(data.source)
        {
            case 'share':
                var eventLang = '分享';
                break;
            case 'apiStatus':
                var eventLang = '查询';
                break;
            case 'favorite':
                var eventLang = '收藏';
                aiaiusdk.sdkAfterFavorite();
                break;
            default:
                var eventLang = '操作';
        }
        aiaiusdk[data.source].lisenter(data.action, aiaiusdk.CommonLang(data.action, data), JSON.stringify(data.data));
    };
    // 语言包
    aiaiusdk.CommonLang = function (code, data) {
        switch(data.source)
        {
            case 'share':
                var eventLang = '分享';
                break;
            case 'apiStatus':
                var eventLang = '查询';
                break;
            case 'favorite':
                var eventLang = '收藏';
                break;
            default:
                var eventLang = '操作';
        }
        switch(code)
        {
            case aiaiucode.Common_CLOSE:
                var codeLang = '取消';
                break;
            case aiaiucode.Common_SUCCESS:
                var codeLang = '成功';
                break;
            case aiaiucode.Common_FAIL:
                var codeLang = '失败';
                break;
            case aiaiucode.Common_ERROR_DATA:
                var codeLang = '参数错误';
                break;
            case aiaiucode.Common_ERROR_PARAM_NUM:
                var codeLang = '参数数量错误';
                break;
            default:
                var codeLang = '异常';
        }
        return eventLang+codeLang;

    };
    // 公用方法END
        aiaiusdk.sdkLoad = function() {
        switch(aiaiusdk.channel)
        {
            case 451:
                aiaiusdk.loadJs("http://issue.68uxi.com/assets/issue_sdk.js", function(){
                        aiaiusdk.jsonp("http://passport.4177.com/channel/451/init/"+aiaiusdk.app_id+"?open_id="+aiaiusdk.open_id,function(ret) {
                            if(ret.code == 200){
                                window.H5Play68 = H5Play68.init(ret.data.appid, ret.data.pf);
                            }
                        });
                    }
                );
                break;
            
            default:
                window.addEventListener("message", function (evt) {
                    aiaiusdk.SDKEvent(evt.data);
                }, false);
                break;
        }

    };
    aiaiusdk.sdkPay = function(params) {
        switch(aiaiusdk.channel)
        {
            case 204:
                window.location.href = 'http://passport.4177.com/channel/204/pay/'+aiaiusdk.app_id+'?'+aiaiusdk.formatParams(params);
                break;
            case 446:
                window.location.href = 'http://passport.4177.com/channel/446/pay/'+aiaiusdk.app_id+'?'+aiaiusdk.formatParams(params);
                break;
            case 451:
                aiaiusdk.jsonp("http://passport.4177.com/channel/451/pay/"+aiaiusdk.app_id+"?"+aiaiusdk.formatParams(params),function(ret) {
                    if(ret.code == 200){
                        H5Play68.pay(ret.data.account, ret.data.itemname, ret.data.money, ret.data.attach, ret.data.sign, ret.data.serverid);
                    }
                });
                break;
            
            default:
                window.location.href = 'http://passport.4177.com/channel/common/pay/'+aiaiusdk.channel+'?'+aiaiusdk.formatParams(params);
                break;
        }
    };
    
    aiaiusdk.sdkLogout = function(params) {
        switch (aiaiusdk.channel) {
            case 915:
                parent.postMessage(JSON.stringify({
                    funcType: 'logout'
                }), '*');
                break;
            case 948:
                parent.postMessage({
                    eventType: 'logout'
                }, '*');
                break;
            default:
                window.location.reload();
                break;
        }
    };
    aiaiusdk.sdkGameRole = function(params) {
        switch (aiaiusdk.channel) {
            case 695:
                NewGameJuHe.init(params.channel);
                NewGameJuHe.ready(function () {
                    NewGameJuHe.report({
                        app_id: params.app_id,
                        open_id: params.open_id,
                        server: params.server,
                        action: 'create_role'
                    });
                });
                break;
            default:
                break;
        }
    };

    aiaiusdk.loadJs = function(src, callback) {
        var oHead = document.getElementsByTagName('HEAD').item(0);
        var oScript= document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = src;
        oHead.appendChild(oScript);
        oScript.onload=oScript.onreadystatechange=function(){
            if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                callback();
            }
            oScript.onload=oScript.onreadystatechange=null;
        };
    };

    aiaiusdk.jsonp = function(url, callback) {
        if (!url) {
            return;
        }
        var a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']; //定义一个数组以便产生随机函数名
        var r1 = Math.floor(Math.random() * 10);
        var r2 = Math.floor(Math.random() * 10);
        var r3 = Math.floor(Math.random() * 10);
        var name = 'getJSONP' + a[r1] + a[r2] + a[r3];
        var cbname = 'aiaiusdk.jsonp.' + name; //作为jsonp函数的属性
        if (url.indexOf('?') === -1) {
            url += '?callback=' + cbname;
        } else {
            url += '&callback=' + cbname;
        }
        var script = document.createElement('script');
        //定义被脚本执行的回调函数
        aiaiusdk.jsonp[name] = function (e) {
            try {
                callback && callback(e);
            }catch (e) {
                //
            }
            finally {
                //最后删除该函数与script元素
                delete aiaiusdk.jsonp[name];
                script.parentNode.removeChild(script);
            }
        };
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    aiaiusdk.formatParams = function(a) {
        var b, c = [];
        for (b in a) a.hasOwnProperty(b) && c.push(encodeURIComponent(b) + "=" + encodeURIComponent(a[b]));
        return c.join("&")
    };

    aiaiusdk.initEvent = function (source, data) {
    };

    aiaiusdk.payEvent = function (evt) {
        aiaiusdk.paying = false;
        if (evt == aiaiucode.Pay_CLOSE) {
            aiaiusdk.payListener(aiaiucode.Pay_CLOSE, "关闭支付");
        }
        else if (evt == aiaiucode.Pay_SUCCESS) {
            aiaiusdk.payListener(aiaiucode.Pay_SUCCESS, "支付成功");
        }
        else if (evt == aiaiucode.Pay_FAIL) {
            aiaiusdk.payListener(aiaiucode.Pay_FAIL, "支付失败");
        }
        else if (evt == aiaiucode.Pay_CANCEL) {
            aiaiusdk.payListener(aiaiucode.Pay_CANCEL, "取消支付");
        }
        else if (evt == aiaiucode.Pay_ERROR_DATA) {
            aiaiusdk.payListener(aiaiucode.Pay_ERROR_DATA, "支付参数错误");
        }
        else if (evt == aiaiucode.Pay_ERROR_PARAM_NUM) {
            aiaiusdk.payListener(aiaiucode.Pay_ERROR_PARAM_NUM, "支付参数数量错误");
        }
        else {
            aiaiusdk.payListener(aiaiucode.Pay_CLOSE, "关闭支付");
        }
    };
    aiaiusdk._bInit = false;
    aiaiusdk.channel = '';
    aiaiusdk.app_id = '';
    aiaiusdk.open_id = '';
    aiaiusdk.server_id = '';
    aiaiusdk.role_id = '';
    aiaiusdk.join = 1;
    aiaiusdk.paying = false;
    aiaiusdk.payListener = null;
    return aiaiusdk;
})();


