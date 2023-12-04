import Plot from 'react-plotly.js';

export default function PieChartPlot() {
  var data = [
    {
      type: 'pie',
      values: [2, 3, 4, 4],
      labels: ['Wages', 'Operating expenses', 'Cost of sales', 'Insurance'],
      textinfo: 'label+percent',
      textposition: 'outside',
      automargin: true,
    },
  ];

  var layout = {
    height: 380,
    width: 400,
    margin: { t: 0, b: 0, l: 0, r: 0 },
    showlegend: false,
  };

  return (
    <>
      <Plot data={data} layout={layout} />
    </>
  );
}
