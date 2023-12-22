(() => {
  // Container and dropdown selection
  const year_option = d3.select("#year_option");
  const region_option = d3.select("#region_option");

  const region_bubble_chart = d3.select("#bubble");

  region_bubble_chart.text("Loading...");

  //Functions
  function optionChanged(selectedValue) {
    // Perform actions based on the selected value
    Plotly.purge('Bich_plot')
    region_bubble_chart.text("Loading...");
  }

  function initiateDropdown() {
    // Add an initial loading option
    year_option.attr("value", "loading")
      .text("Loading...");

    d3.json("http://127.0.0.1:5000/api/region")
      .then(x => {
        const data = {
            "country":x.map(x=>x.country),
            "medage_years": x.map(x=>x.medage_years),
            "popannualdoublingtime_years": x.map(x=>x.popannualdoublingtime_years),
            "popdensity_personssqkm": x.map(x=>x.popdensity_personssqkm),
            "totpopjan_thousands": x.map(x=>x.totpopjan_thousands),
            "year": x.map(x=>x.year)
        }


        console.log(data)
        // Remove the loading option
        
        console.log(year_option)
        console.log(region_option)
        
        data.year.reduce((a,c)=> { a.add(c); return a}, new Set()).forEach(s => year_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
        data.country.reduce((a,c)=> { a.add(c); return a}, new Set()).forEach(s => region_option.append(() => { const o = document.createElement('option'); o.innerText = s; return o; }));
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
        x: data.popannualdoublingtime_years,
        y: data.year,
        yaxis: [1950, 2022],
        mode: "markers",

    };
    Plotly.newPlot("bubble", [bubble], layout);
  }
  
  // plotContainer.text("");
  // Plotly.newPlot(location, [lineGraph], layout, { displayModeBar: false });

  // Call updatePlotly() when a change takes place to the DOM
  initiateDropdown()
  // d3.selectAll().on("change", loadData);
})();