gelato.addFonts({
    custom: {
        families: ['Kaisho', 'Muli', 'Roboto Slab', 'Simkai'],
        urls: ['styles/fonts.css']
    }
});

gelato.addPaths({
    'chart': 'libraries/chart-1.0.2.min',
    'createjs.easel': 'libraries/createjs.easel-NEXT.min',
    'createjs.tween': 'libraries/createjs.tween-NEXT.min',
    'd3': 'libraries/d3-3.5.5.min',
    'heatmap': 'libraries/heatmap-3.5.2.min',
    'raygun': 'libraries/raygun-1.18.2.min'
});

gelato.addShim({
    'heatmap': ['d3']
});