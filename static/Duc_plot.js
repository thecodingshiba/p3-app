// Define the URL for the JSON file
const jsonUrl = "http://127.0.0.1:5000/api/population";

// Container and dropdown selection
const container = d3.select("#well");
const dropdown = d3.select("#selDataset");
const dropdown2 = d3.select("#selDataset_from_year");
const dropdown3 = d3.select("#selDataset_population_attribute");
const dropdown4 = d3.select("#selDataset_to_year");
const dropdown5 = d3.select("#selDataset_2");
const dropdown6 = d3.select("#selDataset_against");

const ducPlotContainer1 = d3.select("#Duc_plot");
const ducPlotContainer2 = d3.select("#Duc_plot_2");

ducPlotContainer1.text("Loading...");
ducPlotContainer2.text("Loading...");

//Functions
function optionChanged_duc(selectedValue) {
    // Perform actions based on the selected value
    Plotly.purge('Duc_plot')
    ducPlotContainer1.text("Loading...");
    ducPlotContainer2.text("Loading...");
    console.log("Selected country:", selectedValue);
  }

function initiateDropdown(){
        // Add an initial loading option
        dropdown.append("option")
        .attr("value", "loading")
        .text("Loading...");

        d3.json(jsonUrl)
.then(x=>{
    // Remove the loading option
    dropdown.select("option[value='loading']").remove();

    // Create options for the dropdown Country
    const options = dropdown
    .selectAll("option")
    .data(x.country.sort())
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);
    

    // Create options for the dropdown vs Country
    const options5 = dropdown5
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

      // Create options for the dropdown
    const options6 = dropdown6
    .selectAll("option")
    .data(['GDP',"Year"])
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

    loadData()
})
  }

function loadData(){
  console.log("Loading data")  
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdown.property("value");
    let dataset5 = dropdown5.property("value");
    let dataset3=dropdown3.property("value")

    if (parseInt(dropdown2.property("value")) >= parseInt(dropdown4.property("value"))) {
        dropdown4.property("value", (parseInt(dropdown2.property("value")) + 1).toString());
  };

  let amended_jsonUrl=jsonUrl+'/'+ dataset3+'/'+dataset.replace(/ /g, '+')+'&'+dataset5.replace(/ /g, '+')
  d3.json(amended_jsonUrl)
  .then(x=>{
    //Filter value:
    //Country
    let countryData=x.data.filter(y => y.Country.toString() === dataset &&
     y.Year >= parseInt(dropdown2.property("value")) &&
     y.Year <= parseInt(dropdown4.property("value"))
     );
    
     let vscountryData=x.data.filter(y => y.Country.toString() === dataset5 &&
     y.Year >= parseInt(dropdown2.property("value")) &&
     y.Year <= parseInt(dropdown4.property("value"))
     );

     plot_scatter_plot(countryData,'Duc_plot',dataset)
     plot_scatter_plot(vscountryData,'Duc_plot_2',dataset5)
  })
}

function getColor(data) {
  // enter your conditional coloring code here
  if (data > 1975) {
    return 'pink'
  }
  return 'blue';
}

function plot_scatter_plot(data,location,country){
    //Get value of y-axis
    let selectedKey = dropdown3.property("value");
    //Get value of x-axis
    let selectedKey_x=dropdown6.property("value");
    let subText="Year"
    if(subText===selectedKey_x){
      subText="GDP"
    };

    //Plot
    let lineGraph={
      x:data.map(x=>x[selectedKey_x]),
      y:data.map(z=>z[selectedKey]),
      type: 'scatter',
      mode: 'markers',  // Set mode to 'markers' for a scatter plot,
      marker: {
        //color: data.map(x=> getColor(x)),
        color: 'crimson',
        size: 10,},
      text: data.map(y => `${selectedKey}: ${y[selectedKey]}, ${subText}: ${y[subText]}`),
      hoverinfo: 'text',
    };
    // Set the size of the plot
    // Set the size of the plot
let layout = {
  width: 550,
  height: 500,
  plot_bgcolor: 'rgb(238, 201, 197)',
  paper_bgcolor: 'smokewhite',
  showlegend: false,
  title: {
    text: `<span style="font-size: larger;">${country}</span><br> ${selectedKey} by ${selectedKey_x} from ${dropdown2.property("value")} to ${dropdown4.property("value")}`,  // Set the title text
    x: 0.5,  // Set the title position to the center
    font: {
      size: 28,  // Set the font size
      family: 'Time New Roman',  // Use a modern sans-serif font
      color: 'crimson',  // Set the font color
      bold: 'bold'  // Make the title bold
    }
  },
  xaxis: {
    title: {
      text: `${selectedKey_x}`  // Set the x-axis title
    },
    tickangle: 26,
    showline: true,  // Display x-axis line
    boxmode: 'group',  // Set boxmode to 'group' to draw the axis box around the entire plot
    zeroline: false,  // Do not display x-axis baseline
    linecolor: 'black',  // Set x-axis line color
    linewidth: 3, // Set x-axis line width
    ticklen: 10,
    tickwidth: 3,
    tickcolor: 'black',
    showgrid: false,
    titlefont: {
      family: 'Time New Roman',
      size: 25,
      color: 'crimson'
    },
    tickfont: {
      family: 'Time New Roman',
      size: 20,
      color: 'black'
    },
    linecolor: '#636363',
    linewidth: 6,
    minor: {
      ticks: 'inside',
      ticklen: 50,
      tickcolor: 'black',
      tickwidth: 3,
    }
  },
  yaxis: {
    title: {
      text: selectedKey  // Set the y-axis title
    },
    showline: true,  // Display x-axis line
    boxmode: 'group',  // Set boxmode to 'group' to draw the axis box around the entire plot
    zeroline: false,  // Do not display x-axis baseline
    linecolor: 'black',  // Set x-axis line color
    linewidth: 3, // Set x-axis line width
    ticklen: 10,
    tickwidth: 3,
    tickcolor: 'black',
    titlefont: {
      family: 'Time New Roman',
      size: 25,
      color: 'crimson'
    },
    tickfont: {
      family: 'Time New Roman',
      size: 20,
      color: 'black'
    },
    linecolor: '#636363',
    linewidth: 6
  }
};
let plotContainer;
  if (location === 'Duc_plot') {
    plotContainer = ducPlotContainer1;
  } else if (location === 'Duc_plot_2') {
    plotContainer = ducPlotContainer2;
  }

  plotContainer.text("");
  Plotly.newPlot(location, [lineGraph], layout, { displayModeBar: false });

}
initiateDropdown()
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset, #selDataset_2, #selDataset_from_year, #selDataset_population_attribute, #selDataset_to_year, #selDataset_against").on("change", loadData);