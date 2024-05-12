import Plot from 'react-plotly.js';

export default function LineChartPlot() {
  var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'scatter',
  };

  var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter',
  };

  var data = [trace1, trace2];

  var layout = {
    height: 300,
    width: 350,
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: false,
  };

  return (
    <>
      <Plot data={data} layout={layout} />
    </>
  );
}
