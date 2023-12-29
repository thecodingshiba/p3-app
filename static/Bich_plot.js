//Function for region selection
function region_option_changed(selectedValue) {
  // Perform actions based on the selected value
  //Plotly.purge('Bich_plot')
  const region_option = d3.select("#region_option").property("value");
  const type_option = d3.select("#type").property("value")
  console.log(region_option,type_option)
  const region_bubble_chart = d3.select("#bubble");
  
  region_bubble_chart.text("Loading...");

  d3.json("http://127.0.0.1:5000/api/region/"+region_option+"/"+type_option)
    .then(x => {
      const data = {
        "country": x.map(x => x.country),
        "year": x.map(x => x.year),
        "raw": x.map(x => x.raw)
      }

      // data.year.reduce((a, c) => { a.add(c); return a }, new Set()).forEach(s => year_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
      // data.country.reduce((a,c)=> { a.add(c); return a}, new Set()).forEach(s => region_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
      showBubble(data)
    })
}

function showBubble(data) {
  // Set the size of the plot
  let layout = {
    width: 780,
    height: 550,
    plot_bgcolor: 'rgb(238, 201, 197)',
    paper_bgcolor: 'smokewhite',
    showlegend: false,
  };
  let bubble = {
    y: data.raw,
    x: data.year,
    type: 'scatter',
    mode: "markers",
    marker: {
      size: data.raw,
      colour: data.raw,
      sizemode: 'area',
      color: 'crimson',
      sizeref: 2.0 * Math.max(...data.raw) / (40 ** 2)
    },
    hoverinfo: 'text',

  

  };
  document.querySelector("#bubble").innerHTML = '';
  Plotly.newPlot("bubble", [bubble], layout);
}
(() => {
  // Container and dropdown selection
  const year_option = d3.select("#year_option");

  // Add an initial loading option
  year_option.attr("value", "loading")
    .text("Loading...");

  region_option_changed("WORLD")
})();