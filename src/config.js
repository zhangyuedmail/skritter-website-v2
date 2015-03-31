app.addFonts({
    custom: {
        families: ['Arial Unicode MS', 'Kaisho', 'Muli', 'Roboto Slab', 'Simkai'],
        urls: ['styles/fonts.css']
    }
});

app.addPaths({
    'createjs.easel': 'libraries/createjs.easel-NEXT.min',
    'createjs.tween': 'libraries/createjs.tween-NEXT.min'
});

app.addShim({});