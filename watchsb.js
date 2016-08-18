/**
 * Created by WILL on 2016/8/18.
 */
var http = require('http');
var jsdom = require('jsdom');
var url = require('url');

var request = function (options, callback) {
    var host = options.host || '';
    var path = options.path || '';
    var method = options.method | 'GET';
    http.request({
        host: host,
        path: path,
        method: method
    }, function (res) {
        var html = '';
        res.on('data', function (data) {
            html += data;
        });
        res.on('end', function () {
            jsdom.env(html, [], function(error, window) {
                if(!error) {
                    var elementsA = window.document.getElementsByTagName('a');
                    var hrefs = [];
                    for(var i in elementsA) {
                        var elementA = elementsA[i];
                        var href = elementA.getAttribute('href');
                        var uri = url.parse(href);
                        if(uri.protocol === 'http:') {
                            hrefs.push({
                                host: uri.host,
                                path: uri.path
                            });
                        }
                    }
                    callback(hrefs);
                }
            });

        });
    }).on('error', function (err) {
        console.log(err);
    }).end();
};

request({
    host: 'www.cotlife.cn',
    path: '/'
}, function(hrefs){
    console.log(hrefs);
});