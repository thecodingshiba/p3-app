//Function for region selection
function region_option_changed(selectedValue) {
  // Perform actions based on the selected value
  //Plotly.purge('Bich_plot')
  const region_option = d3.select("#region_option").property("value");
  const type_option = d3.select("#type").property("value")
  const region_bubble_chart = d3.select("#bubble");
  
  region_bubble_chart.text("Loading...");

  d3.json("http://127.0.0.1:5000/api/region/"+region_option+"/"+type_option)
    .then(x => {
      const data = {
        "country": x.map(x => x.country),
        "year": x.map(x => x.year),
        "raw": x.map(x => x.raw)
      }
    
      showBubble(data)
    })
}

function showBubble(data) {
  // Set title and lables 
  const region_label = d3.select("#region_option option:checked").text()
  const type_label = d3.select("#type option:checked").text()

    // Set the size of the plot
    let layout = {
    width: 780,
    height: 550,
    plot_bgcolor: 'rgb(238, 201, 197)',
    paper_bgcolor: 'smokewhite',
    showlegend: false,
    xaxis: {
      title: 'Year'
    },
    yaxis: {
      title: type_label
    },
    title: region_label +' '+ type_label+ ' vs Year'
  };
  let bubble = {
    y: data.raw,
    x: data.year,
    type: 'scatter',
    mode: 'markers'
  };
  document.querySelector("#bubble").innerHTML = '';
  Plotly.newPlot("bubble", [bubble], layout)
}
(() => {
  // Container and dropdown selection
  const year_option = d3.select("#year_option");

  // Add an initial loading option
  year_option.attr("value", "loading")
    .text("Loading...");

  region_option_changed("WORLD")
})();