// Define the URL for the JSON file
const jsonUrl = "http://127.0.0.1:5000/api/population";

const ducPlotContainer = d3.select("#Duc_plot");
ducPlotContainer.text("Loading...");
//Functions
function optionChanged(selectedValue) {
    // Perform actions based on the selected value
    Plotly.purge('Duc_plot')
    ducPlotContainer.text("Loading...");
    console.log("Selected country:", selectedValue);
  }

function initiateDropdown(){
        // Container and dropdown selection
        const container = d3.select("#well");
        const dropdown = d3.select("#selDataset");
    
        // Add an initial loading option
        dropdown.append("option")
        .attr("value", "loading")
        .text("Loading...");

        d3.json(jsonUrl)
.then(x=>{
    // Container and dropdown selection
    const container = d3.select("#well");
    const dropdown = d3.select("#selDataset");
    const dropdown2 = d3.select("#selDataset_from_year");
    const dropdown3 = d3.select("#selDataset_population_attribute");
    const dropdown4 = d3.select("#selDataset_to_year");
    // Remove the loading option
    dropdown.select("option[value='loading']").remove();

    // Create options for the dropdown
    const options = dropdown
    .selectAll("option")
    .data(x.country.sort())
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

      // Create options for the dropdown Year
      const options2 = dropdown2
      .selectAll("option")
      .data(x.year.sort())
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

        // Create options for the dropdown Year
        const options4 = dropdown4
        .selectAll("option")
        .data(x.year.sort())
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

      // Create options for the dropdown Population Attribute
      const options3 = dropdown3
      .selectAll("option")
      .data(x.population_attribute.sort())
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    loadData()
})
  }

function loadData(){
  console.log("Loading data")
    // Dropdown selection
    const dropdown = d3.select("#selDataset");
    const dropdown2 = d3.select("#selDataset_from_year");
    const dropdown3 = d3.select("#selDataset_population_attribute");
    const dropdown4 = d3.select("#selDataset_to_year");

    
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdown.property("value");
    let dataset2 = dropdown2.property("value");
    let dataset3 = dropdown3.property("value");
    let dataset4 = dropdown4.property("value");

    if (parseInt(dropdown2.property("value")) >= parseInt(dropdown4.property("value"))) {
        dropdown4.property("value", (parseInt(dropdown2.property("value")) + 1).toString());
  };
  d3.json(jsonUrl)
  .then(x=>{
    //Filter value:
    //Country
    let countryData=x.data.filter(y => y.Country.toString() === dataset &&
     y.Year >= parseInt(dropdown2.property("value")) &&
     y.Year <= parseInt(dropdown4.property("value"))
     );
    
     //Get value of y-axis
    let selectedKey = dropdown3.property("value");
    //Plot
    let lineGraph={
      x:countryData.map(x=>x.GDP),
      y:countryData.map(z=>z[selectedKey]),
      mode: 'markers',  // Set mode to 'markers' for a scatter plot,
      text: countryData.map(y => `${selectedKey}: ${y[selectedKey]}, Year: ${y.Year}`),
      hoverinfo: 'text',
    };
    // Set the size of the plot
    // Set the size of the plot
let layout = {
  width: 500,
  height: 500,
  showlegend: false,
  title: {
    text: `GDP vs ${selectedKey} from ${dropdown2.property("value")} to ${dropdown4.property("value")}`,  // Set the title text
    x: 0.5,  // Set the title position to the center
    font: {
      size: 18,  // Set the font size
      family: 'Arial, sans-serif',  // Use a modern sans-serif font
      color: 'black',  // Set the font color
      bold: 'bold'  // Make the title bold
    }
  },
  xaxis: {
    title: {
      text: 'GDP'  // Set the x-axis title
    },
    showline: true,  // Display x-axis line
    boxmode: 'group',  // Set boxmode to 'group' to draw the axis box around the entire plot
    zeroline: false,  // Do not display x-axis baseline
    linecolor: 'black',  // Set x-axis line color
    linewidth: 2  // Set x-axis line width
  },
  yaxis: {
    title: {
      text: selectedKey  // Set the y-axis title
    },
    showline: true,  // Display y-axis line
    boxmode: 'group',  // Set boxmode to 'group' to draw the axis box around the entire plot
    zeroline: false,  // Do not display y-axis baseline
    linecolor: 'black',  // Set y-axis line color
    linewidth: 2  // Set y-axis line width
  }
};
    ducPlotContainer.text("");
    Plotly.newPlot('Duc_plot',[lineGraph],layout,{displayModeBar : false});

  })

}
  
initiateDropdown()
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset, #selDataset_from_year, #selDataset_population_attribute, #selDataset_to_year").on("change", loadData);