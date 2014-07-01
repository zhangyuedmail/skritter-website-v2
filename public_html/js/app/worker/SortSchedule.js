self.addEventListener('message', function(event) {
    //declarations
    var data = event.data.schedule;
    var activeParts = event.data.activeParts;
    var activeStyles = event.data.activeStyles;
    var now = event.data.now;
    var spacedItems = event.data.spacedItems;
    //functions
    function findIndex(objectArray, id) {
        for (var i = 0, length = objectArray.length; i < length; i++) {
            if (objectArray[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    function randomDecimal(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randomInterval(value) {
        return Math.round(value * (0.925 + (Math.random() * 0.15)));
    }
    //process
    data = data.sort(function(item) {
        var seenAgo = now - item.last;
        var rtd = item.next - item.last;
        var readiness = seenAgo / rtd;
        //filter out inactive parts and styles
        if (activeParts.indexOf(item.part) === -1 ||
            activeStyles.indexOf(item.style) === -1) {
            item.readiness = 0;
            return -item.readiness;
        }
        //deprioritize items currently being spaced
        var spacedItemIndex = findIndex(spacedItems, item.id);
         if (spacedItemIndex !== -1) {
            var spacedItem = spacedItems[spacedItemIndex];
            if (spacedItem.until > now) {
                item.readiness = randomDecimal(0.1, 0.3);
                return -item.readiness;
            } else {
                spacedItems.splice(spacedItemIndex, 1);
            }
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
    self.postMessage({schedule: data, spacedItems: spacedItems});
}, false);