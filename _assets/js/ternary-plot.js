let originalProducts;
let filteredProducts;
let ternaryPlotElement;
let barChartElement;

const initializePlot = (data, title) => {
    const queryTextInput = document.getElementById('query-text-input');
    queryTextInput.oninput = (event) => {
        event.preventDefault();
        filterProducts(product => product.title.toLowerCase().includes(queryTextInput.value.toLowerCase()))
    };
    originalProducts = data;
    filteredProducts = originalProducts.map(product => product);
    const ternaryPlot = draw_ternary_plot(filteredProducts, "");
    const barChart = makeBarChart(filteredProducts[0], "");

    barChart.then(result => {
        barChartElement = result;
    });

    ternaryPlot.then(result => {
        ternaryPlotElement = result;

        result.on('plotly_click', function (data) {
            handleClickOnPoint(data.points[0].pointNumber, filteredProducts);
        });
        result.on('plotly_hover', function (data) {
            handleHoverOnPoint(filteredProducts[data.points[0].pointNumber], barChartElement);
        });
    });
};

const restyleChart = () => {
    const update = {
        a: [filteredProducts.map(product => product['supplemental_facts_proteins'])],
        b: [filteredProducts.map(product => product['supplemental_facts_total_carbs'])],
        c: [filteredProducts.map(product => product['supplemental_facts_fats'])]
    };
    Plotly.restyle(ternaryPlotElement, update);
};

const filterProducts = (filterFunction) => {
    filteredProducts = originalProducts.filter(filterFunction);
    restyleChart();
};

function draw_ternary_plot(data, title) {
    const layout = get_ternary_layout(title);

    data = [{
        'type': 'scatterternary',
        'mode': 'markers',
        'a': filteredProducts.map(function (entry) {
            return entry['supplemental_facts_proteins']
        }),
        'b': filteredProducts.map(function (entry) {
            return entry['supplemental_facts_total_carbs']
        }),
        'c': filteredProducts.map(function (entry) {
            return entry['supplemental_facts_fats']
        }),
        'text': '',
        'hoverinfo': 'none',
        'marker': {}
    }];

    const figure = {'data': data, 'layout': layout};
    return Plotly.plot('ternary', figure)
}

function make_axis(title, tickangle) {
    return {
        'title': "",
        'titlefont': {'size': 20},
        'tickangle': tickangle,
        'tickfont': {'size': 15},
        'tickcolor': 'rgba(0,0,0,1.0)',
        'ticklen': 5,
        'showline': true,
        'showgrid': true,
        'ticksuffix': '',
        'showticksuffix': 'last'
    }
}

function get_ternary_layout(title) {
    return {
        'ternary': {
            'sum': 100,
            'aaxis': make_axis('Proteins', 0),
            'baxis': make_axis('Carboydrates', 45),
            'caxis': make_axis('Fats', -45),
            'bgcolor': 'papayawhip',

        },
        'title': title,
        'paper_bgcolor': 'rgba(0, 0, 0, 0.0)',
        'bgcolor': 'papayawhip',
        'annotations': [
            {
                'x': 0.7,
                'y': 0.6,
                'text': '% fats',
                'showarrow': false,
                'font': {
                    'size': 20
                },
                'textangle': 55
            },
            {
                'x': 0.28,
                'y': 0.6,
                'text': '% proteins',
                'showarrow': false,
                'font': {
                    'size': 20
                },
                'textangle': -55
            },
            {
                'x': 0.5,
                'y': 0.1,
                'text': '% carbohydrates',
                'showarrow': false,
                'font': {
                    'size': 20
                }
            },
            {
                'x': 0,
                'y': 0,
                'text': 'Source and more info: <a href="http://www.herbvu.com/view/protein-bars/">HerbVu</a>',
                'showarrow': false
            }
        ]
    }
}

function handleClickOnPoint(pointNumber, data) {
    const product = data[pointNumber];
    window.open(product.url, '_blank');
}

function handleHoverOnPoint(product, barChartElement) {
    updateBarChart(product, barChartElement);
}

function normalizeVector(vector) {
    const sum = vector.reduce((sum, x) => sum + x);
    return vector.map(x => 100 * x / sum);
}

const updateBarChart = (product, barChartElement) => {
    const vector = getBarChartVector(product);
    barChartElement.data = getBarChartData(vector);
    barChartElement.layout = getBarChartLayout(product, vector);

    Plotly.redraw(barChartElement);
};

function makeBarChart(product) {
    const vector = getBarChartVector(product);

    const data = getBarChartData(vector);
    const layout = getBarChartLayout(product, vector);
    return Plotly.newPlot('bar-chart', data, layout)
}

const getBarChartVector = (product) => {
    return normalizeVector([
        product.supplemental_facts_proteins,
        product.supplemental_facts_fats,
        product.supplemental_facts_total_carbs
    ]);
};

function getBarChartTrace(x, y, name, color) {
    return {
        x: x,
        y: y,
        name: name,
        orientation: 'h',
        type: 'bar',
        marker: {
            color: color,
            width: 1
        }
    };
}

const getBarChartLayout = (product, vector) => {
    return {
        title: product.title,
        titlefont: {
            size: 14
        },
        barmode: 'stack',
        paper_bgcolor: 'rgba(0, 0, 0, 0.0)',
        plot_bgcolor: 'papayawhip',
        annotations: [
            {
                x: (vector[0]) / 2,
                y: 0.5,
                text: 'proteins',
                ax: 0,
                ay: -15,
            },
            {
                x: (vector[0] + vector[1] / 2),
                y: 0.5,
                text: 'fats',
                ax: 0,
                ay: -15,
            },
            {
                x: (vector[0] + vector[1] + vector[2] / 2),
                y: 0.5,
                text: 'carbs',
                ax: 0,
                ay: -15,
            },
            {
                x: (vector[0]) / 2,
                y: -0.2,
                text: `<b>${product.supplemental_facts_proteins} g</b>`,
                showarrow: false
            },
            {
                x: (vector[0] + vector[1] / 2),
                y: -0.2,
                text: `<b>${product.supplemental_facts_fats} g</b>`,
                showarrow: false
            },
            {
                x: (vector[0] + vector[1] + vector[2] / 2),
                y: -0.2,
                text: `<b>${product.supplemental_facts_total_carbs} g</b>`,
                showarrow: false
            },
            {
                yref: 'paper',
                xref: 'paper',
                x: 0,
                y: -0.2,
                text: `Calories per protein ${Math.round(product.supplemental_facts_calories / product.supplemental_facts_proteins)}`,
                showarrow: false
            },
        ],
        showlegend: false,
        hovermode: false,
        xaxis: {showline: false, zeroline: false, showgrid: false, showticklabels: false}
    };
};

const getBarChartData = (vector) => {
    return [
        getBarChartTrace([vector[0]], ['.'], 'proteins', 'lightgreen'),
        getBarChartTrace([vector[1]], ['.'], 'fats', 'lightyellow'),
        getBarChartTrace([vector[2]], ['.'], 'carbs', 'pink')
    ];
};