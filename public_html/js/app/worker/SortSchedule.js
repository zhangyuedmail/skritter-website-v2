importScripts('../../lib/lodash.compat-2.4.1.min.js');

self.addEventListener('message', function(event) {
    //declarations
    var activeParts = event.data.activeParts;
    var activeStyles = event.data.activeStyles;
    var data = event.data.data;
    var held = event.data.held;
    var mergeInsert = JSON.parse(event.data.mergeInsert);
    var mergeRemove = JSON.parse(event.data.mergeRemove);
    var now = getUnixTime();
    //functions
    function getUnixTime() {
        return Math.round(new Date().getTime() / 1000);
    };
    function randomDecimal(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randomInterval(value) {
        return Math.round(value * (0.925 + (Math.random() * 0.15)));
    }
    //merge inserts
    for (var i = 0, length = mergeInsert.length; i < length; i++) {
        var item = mergeInsert[i];
        var itemPosition = _.findIndex(data, {id: item.id});
        if (item.vocabIds.length === 0) {
            continue;
        } else if (itemPosition === -1) {
            data.push({
                id: item.id,
                last: item.last ? item.last : 0,
                next: item.next ? item.next : 0,
                part: item.part,
                style: item.style
            });
        } else {
            data[itemPosition] = {
                id: item.id,
                last: item.last ? item.last : 0,
                next: item.next ? item.next : 0,
                part: item.part,
                style: item.style
            };
        }
    }
    //merge deletes
    for (var i = 0, length = mergeRemove.length; i < length; i++) {
        var item = mergeRemove[i];
        var itemPosition = _.findIndex(data, {id: item.id});
        if (itemPosition !== -1) {
            data.splice(itemPosition, 1);
        }
    }
    //sort data
    data = _.sortBy(data, function(item) {
        var seenAgo = now - item.last;
        var rtd = item.next - item.last;
        var readiness = seenAgo / rtd;
        //filter out inactive parts and styles
        if (activeParts.indexOf(item.part) === -1 ||
            activeStyles.indexOf(item.style) === -1) {
            item.readiness = 0;
            return -item.readiness;
        }
        //filter out items currently being held
        if (_.findIndex(held, {baseWriting: item.id.split('-')[2]}) !== -1) {
            item.readiness = 0;
            return -item.readiness;
        }
        //randomly deprioritize new spaced items
        if (!item.last && item.next - now > 600) {
            item.readiness = randomDecimal(0.1, 0.3);
            return -item.readiness;
        }
        //randomly prioritize new items
        if (!item.last || item.next - item.last === 1) {
            item.readiness = randomInterval(9999);
            return -item.readiness;
        }
        //deprioritize overdue items
        if (readiness > 9999) {
            item.readiness = randomInterval(9999);
            return -item.readiness;
        }
        item.readiness = readiness;
        return -item.readiness;
    });
    //results
    self.postMessage(data);
}, false);