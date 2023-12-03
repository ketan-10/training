import Plot from 'react-plotly.js';

export default function StackedChartPlot() {
  var trace1 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    name: 'SF Zoo',
    type: 'bar',
  };

  var trace2 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [12, 18, 29],
    name: 'LA Zoo',
    type: 'bar',
  };

  var layout = {
    height: 300,
    width: 300,
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: false,
    barmode: 'stack',
  };

  var data = [trace1, trace2];

  // var layout = {};
  return (
    <>
      <Plot data={data} layout={layout} />
    </>
  );
}
