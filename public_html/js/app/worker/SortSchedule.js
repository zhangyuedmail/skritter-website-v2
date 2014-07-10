importScripts('../../lib/lodash.compat-2.4.1.min.js');

self.addEventListener('message', function(event) {
    //declarations
    var activeParts = event.data.activeParts;
    var activeStyles = event.data.activeStyles;
    var data = event.data.data;
    var held = event.data.held;
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
    //actions
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