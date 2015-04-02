app.addFonts({
    custom: {
        families: ['Arial Unicode MS', 'Kaisho', 'Muli', 'Roboto Slab', 'Simkai'],
        urls: ['styles/fonts.css']
    }
});

app.addPaths({
    'createjs.easel': 'libraries/createjs.easel-NEXT.min',
    'createjs.tween': 'libraries/createjs.tween-NEXT.min',
    'd3': 'libraries/d3-3.5.5.min',
    'heatmap': 'libraries/heatmap-3.5.2.min'
});

app.addShim({
    'heatmap': ['d3']
});