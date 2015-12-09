//Resources.js - Loads all resources required then performs
//callbacks to functions that requested a callback once
//all resources are loaded


(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        //If already loaded (in cache), return it
        if(resourceCache[url]) {
            return resourceCache[url];
        } else { //Otherwise register an onload event then load it
            var img = new Image();
            
            //Register an 'onload' event (after image loads, place in cache,
            //then check if all resources are ready)
            img.onload = function() {
                resourceCache[url] = img; //Add resource to cache
                
                //This resource is ready, so lets check if all resources
                //are ready and if so perform all call backs registered
                //using 'forEach'
                if(isReady()) { //Call func for each registered callback
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };//End onload event details
            
            //Load the resource
            resourceCache[url] = false; //Resource not yet loaded
            img.src = url; //Load resource, 'onload' will be called when done
        }
    }

    //'get' is used to get a resource from the loaded resources
    function get(url) {
        return resourceCache[url];
    }

    //'isReady' checks to see if all resources have been loaded
    //It's called after each resource is loaded
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    //onReady is used to register a callback when resources are loaded
    function onReady(func) {
        //Push the function that should be called 
        //onto the array of registerd functions
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();