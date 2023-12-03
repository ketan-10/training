import Plot from 'react-plotly.js';

export default function BarChartPlot() {
  var data = [
    {
      x: ['giraffes', 'orangutans', 'monkeys'],
      y: [20, 14, 23],
      type: 'bar',
    },
  ];

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
