var http = require("http");
var cheerio = require("cheerio");
var fs = require("fs");

var url = "http://699pic.com/tupian/ribao.html";

function getData(url, search, attr) {
    var data = "";
    http.get(url, function(res) {
        res.on("data", function(chunk) {
            data += chunk;
        });
        res.on("end", function() {
            $ = cheerio.load(data);
            var $e = $(search);
            for(var i = 0; i < $e.length; i++) {
                download($e[i].attribs[attr]);
            }
        });
    });
}

function download(url) {
    var pattern = /.+\.[png|jpg|jpeg]/;

    if (!pattern.test(url)) {
        return;
    }

    console.log(url);

    var fileName = "./download/" + url.substr(url.lastIndexOf('/'));
    var imgData = "";
    if (url.indexOf("https") >= 0) {
        url = url.replace("https", "http");
    }

    fs.exists(fileName, function(result) {
        if (!result) {
            //文件不存在则进行下载
            http.get(url, function(res) {
                var imgData = "";
                //一定要设置response的编码为binary否则下载下来的图片会打不开
                res.setEncoding("binary");

                res.on("data", function(chunk) {
                    imgData += chunk;
                });

                res.on("end", function() {
                    fs.writeFile(fileName, imgData, "binary", function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("download successfully.");
                        }
                    });
                });
            });
        } else {
            console.log("the picture has been existed.");
        }
    });
}

function start() {
    console.log("start download...");
    getData(url, ".list img", "data-original");
}

start();
