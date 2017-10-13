/**
 *
 * @author mervyn feimei.zhan@gmail.com
 *
 *
 * Request and response using JSON without any other library.
 *
 * Usage:
 *     TODO: spa_utils
 *
 * response data structure:
 * {
 *      html:string,
 *      priorityScripts:[],
 *      scripts:[],
 *      links:[]
 *  }
 *
 *
 *  TODO:request data struture:
 *  {
 *      ...
 *  }
 *
 *
 * @type {{changeUrl: spa_utils.changeUrl, ajaxRequest: spa_utils.ajaxRequest}}
 */
var spa_utils = {

    /**
     *
     * trigger when url is changed
     *
     * @param container
     */
    changeUrl: function (container) {
        var suffix = location.hash.replace("#", "");

        // home page
        if(!suffix) {
            window.location.reload(true);
            return;
        }

        var url = "/pages/" + suffix;

        spa_utils.ajaxRequest(url, "GET", "", function (statusCode, responseJson) {
            // add css dynamically
            insertLinks(responseJson.links);
            // add html dynamically
            container.innerHTML = responseJson.html;
            loadScripts(responseJson.priorityScripts, responseJson.scripts);
        }, function (statusCode, responseJson) {
            container.innerHTML = responseJson.html;
        }, function (err) {
            // TODO: error handler
            alert(err);
        });
    },

    /**
     *
     * ajax request
     *
     * @param url
     * @param method
     * @param data
     * @param successCallback prototype: function(statusCode:int, responseJson:jsonObject)
     * @param failCallback prototype: function(statusCode:int, responseJson:jsonObject)
     * @param errorCallback prototype: function(error)
     */
    ajaxRequest: function (url, method, data, successCallback, failCallback, errorCallback) {
        var xhr;

        // check whether support ajax
        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader("Accept", "application/json");
            if(method === "POST"){
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

                if(data !== null && data !== undefined && data !== ""){
                    data = JSON.stringify(data);
                    xhr.send(data);
                }else {
                    xhr.send();
                }
            }else {
                xhr.send();
            }

            xhr.onreadystatechange = function () {
                if(xhr.readyState === 4) {
                    if(xhr.status >= 200 && xhr.status < 400){
                        successCallback(xhr.status, JSON.parse(xhr.responseText));
                    }else if(xhr.status >= 400) {
                        failCallback(xhr.status, JSON.parse(xhr.responseText));
                    }else {
                        // TODO: when status code is less than 200
                    }
                }
            }
        } else {
            alert("Brower is too old, please try again using other browser.");
            errorCallback(new Error("Un-support browser"));
        }
    }
};

/**
 * add css dynamically
 *
 * @param links css file list
 */
function insertLinks(links) {
    var head = document.head || document.getElementsByTagName("head")[0];
    for(var j = 0; j < links.length; j++) {
        var linkElement = document.createElement("link");
        linkElement.type = "text/css";
        linkElement.rel = "stylesheet";
        linkElement.href = links[j];
        head.appendChild(linkElement);
    }
}

/**
 * add js dynamically
 *
 * @param priorityScripts first load js
 * @param scripts normal js
 * @param readyCallback
 */
function loadScripts(priorityScripts, scripts) {
    var body = document.body || document.getElementsByTagName("body")[0];

    // load parent of js recursively
    // download priority script first
    loadScript(body, priorityScripts.shift(), function lambda() {
        if(priorityScripts.length > 0) {
            loadScript(body, priorityScripts.shift(), lambda);
        }else{
            for(var i = 0; i < scripts.length; i++){
                loadScript(body, scripts[i]);
            }
        }
    });
}

/**
 * TODO: solve blocking download
 *
 * add js dynamically
 *
 * @param body
 * @param script
 * @param readyCallback  when download successfully to callback, to solve the problem of dependent js through blocking download.
 */
function loadScript(body, script, readyCallback){
    var scriptElement = document.createElement("script");
    scriptElement.src = script;

    // IE
    if(scriptElement.readyState){
        scriptElement.onreadystatechange = function(){
            if (script.readyState === "loaded" || script.readyState === "complete"){
                script.onreadystatechange = null;
                readyCallback();
            }
        };
    } else {
        scriptElement.onload = readyCallback;
    }

    body.appendChild(scriptElement);
}