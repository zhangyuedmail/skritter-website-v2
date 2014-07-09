self.addEventListener('message', function(event) {
    //declarations
    var object1 = event.data.object1;
    var object2 = event.data.object2;
    //actions
    for (var key in object2) {
        if (object1[key]) {
            if (Array.isArray(object1[key])) {
                object1[key] = object1[key].concat(object2[key]);
            } else {
                object1[key] = object2[key];
            }
        } else {
            object1[key] = object2[key];
        }
    }
    //results
    self.postMessage(object1);
}, false);