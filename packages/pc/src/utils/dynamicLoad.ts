

const dynamicLoad = {

    loadCSS : function(path:any, callback?:any) {
        callback   = callback || function() {};
        let id     = path.replace(/[\./]+/g, "-");
        if (!document.getElementById(id)) {
            let css    = document.createElement("link");
            css.id     = id;
            css.type   = "text/css";
            css.rel    = "stylesheet";
            css.href = path;
            css.onload = css.onreadystatechange = function() {
                callback();
            };
            document.getElementsByTagName("head")[0].appendChild(css);
        } else {
            callback();
        }
    },

    loadScript : function(path:any, callback?:any) { 
        callback      = callback || function() {};
        let type          = "text/javascript";
        let id        = path.replace(/[\./]+/g, "-");
        if (!document.getElementById(id)) {
            let script        = document.createElement("script");
            script.id = id;
            script.type   = type;
            script.src    = path;
            script.onload = function() {
                callback();
            }
            document.body.appendChild(script);   
        } else {
            callback();
        }
    },
};


export default dynamicLoad;
