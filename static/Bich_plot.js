//Function for region selection
function region_option_changed(selectedValue) {
  // Perform actions based on the selected value
  //Plotly.purge('Bich_plot')
  const region_option = d3.select("#region_option");
  const region_bubble_chart = d3.select("#bubble");
  
  region_bubble_chart.text("Loading...");

  d3.json("http://127.0.0.1:5000/api/region/"+selectedValue)
    .then(x => {
      const data = {
        "country": x.map(x => x.country),
        "medage_years": x.map(x => x.medage_years),
        "popannualdoublingtime_years": x.map(x => x.popannualdoublingtime_years),
        "popdensity_personssqkm": x.map(x => x.popdensity_personssqkm),
        "totpopjan_thousands": x.map(x => x.totpopjan_thousands),
        "year": x.map(x => x.year)
      }

      data.year.reduce((a, c) => { a.add(c); return a }, new Set()).forEach(s => year_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
      //data.country.reduce((a,c)=> { a.add(c); return a}, new Set()).forEach(s => region_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
      showBubble(data)
    })
}

function showBubble(data) {
  // Set the size of the plot
  let layout = {
    width: 500,
    height: 500,
    showlegend: false,
    title: {
      text: ``,  // Set the title text
      x: 0.5,  // Set the title position to the center
      font: {
        size: 18,  // Set the font size
        family: 'Arial, sans-serif',  // Use a modern sans-serif font
        color: 'black',  // Set the font color
        bold: 'bold'  // Make the title bold
      }
    }
  };
  let bubble = {
    x: data.medage_years,
    y: data.year,
    type: 'scatter',
    yaxis: [1950, 2022],
    mode: "markers",
    marker: {
      size: data.medage_years,
      colour: data.year,
      sizemode: 'area',

     // sizeref: 2.0 * Math.max(...data.medage_years) / (40 ** 2)
    }

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