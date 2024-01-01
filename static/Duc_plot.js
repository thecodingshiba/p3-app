// Define the URL for the JSON file
const jsonUrl    = "http://127.0.0.1:5000/api/population";
let loopInterval;
let currentIndex = 0;

// Container and dropdown selection
const container  = d3.select("#well");
const dropdown   = d3.select("#selDataset");
const dropdown2  = d3.select("#selDataset_from_year");
const dropdown3  = d3.select("#selDataset_population_attribute");
const dropdown4  = d3.select("#selDataset_to_year");
const dropdown5  = d3.select("#selDataset_2");
const dropdown6  = d3.select("#selDataset_against");
const dropdown7  = d3.select("#selDataset_gdp_bar");
const dropdown8  = d3.select("#selDataset_year_bar");

const ducPlotContainer1 = d3.select("#Duc_plot");
const ducPlotContainer2 = d3.select("#Duc_plot_2");
const ducPlotContainer3 = d3.select("#Duc_plot_top_gdp");

const button = document.getElementById('loopButton');
button.textContent = 'Run Timeline'

ducPlotContainer1.text("Loading...");
ducPlotContainer2.text("Loading...");

function startStopLoop() {
  const options = dropdown8.node().options; // Use .node() to get the DOM element
  console.log(button.textContent)
  if (button.textContent === 'Run Timeline') {
    button.textContent = 'Timeline running';

    loopInterval = setInterval(() => {
      // Increment the index or reset to 0 if at the end
      currentIndex = (currentIndex + 1) % options.length;

      // Select the option at the updated index
      dropdown8.node().selectedIndex = currentIndex;

      // Trigger the 'change' event on the dropdown to make sure associated actions are performed
      const event = new Event('change');
      dropdown8.node().dispatchEvent(event);
    }, 3000);
  } else {
    button.textContent = 'Run Timeline';
    dropdown8.node().selectedIndex =options.length-1;
    clearInterval(loopInterval);
  }
}

function load_bar_chart(){
      // Assign the value of the dropdown menu option to a variable
  let att_Pop = dropdown7.property("value");
  let year= dropdown8.property("value");

  jsonUrl_bar='http://127.0.0.1:5000/api/population/GDP' + '/' +year +'&' +att_Pop
  d3.json(jsonUrl_bar)
    .then(x => {
      // Get value

        let top5gdp= x.data.sort((a, b) => b['GDP']- a['GDP']).slice(0, 5); //Exclude those have value<=0

        let bot5gdp = x.data.sort((a, b) => a['GDP']- b['GDP']).slice(0, 5);

      // Use the sorted and sliced data as needed

      createBarChart(top5gdp,'Duc_plot_top_gdp',attribute="GDP",chart_title="The top 5 countries <br> by GDP" + " in "+year)
      createBarChart(top5gdp,'Duc_plot_top_attribute',attribute=att_Pop,chart_title="The top 5 countries <br> by " + att_Pop + " in "+year)
      createBarChart(bot5gdp,'Duc_plot_bot_gdp',attribute="GDP",chart_title="The bottom 5 countries <br> by GDP" + " in "+year)
      createBarChart(bot5gdp,'Duc_plot_bot_attribute',attribute=att_Pop,chart_title="The bottom 5 countries <br> by " + att_Pop + " in "+year)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

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

      const options8 = dropdown8
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

      // Create options for the dropdown Y-axis
      const options3 = dropdown3
      .selectAll("option")
      .data(x.population_attribute.sort())
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

      // Create options for the dropdown Population Attribute
      const options7 = dropdown7
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
    load_bar_chart()
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
        color: '#ef6e04',
        size: 10,},
      text: data.map(y => `${selectedKey}: ${y[selectedKey]}, ${subText}: ${y[subText]}`),
      hoverinfo: 'text',
    };
    // Set the size of the plot
    // Set the size of the plot
let layout = {
  width: 550,
  height: 500,
  plot_bgcolor: 'rgb(238, 206, 173)',
  paper_bgcolor: 'smokewhite',
  showlegend: false,
  title: {
    text: `<span style="font-size: larger;">${country}</span><br> ${selectedKey} by ${selectedKey_x} from ${dropdown2.property("value")} to ${dropdown4.property("value")}`,  // Set the title text
    x: 0.5,  // Set the title position to the center
    font: {
      size: 28,  // Set the font size
      family: 'Time New Roman',  // Use a modern sans-serif font
      color: '#ef6e04',  // Set the font color
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
      color: '#ef6e04'
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
      color: '#ef6e04'
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

function formatGDP(value) {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return `${value.toFixed(2)}`;
  }
}

function createBarChart(data,containner_chart,attribute="GDP",chart_title="") {
   // Extract x and y data
   const xData = data.map(x => x["Country"]);
   const yData = data.map(z => z[attribute]);
 
   // Create Plotly bar graph object
   const barGraph = {
     x: xData,
     y: yData,
     type: 'bar',
     
     marker: {
      //color: data.map(x=> getColor(x)),
      color: '#ef6e04',},
     text: data.map(y => `${attribute}: ${formatGDP(y[attribute])}`),
     hoverinfo: 'text',
   };
 
   // Set up layout
   const layout = {
     
     title: {text:chart_title,
      font: {
        size: 28,  // Set the font size
        family: 'Time New Roman',  // Use a modern sans-serif font
        color: '#ef6e04',  // Set the font color
        bold: 'bold'  // Make the title bold
      }, },
     width: 700,
     height: 550,
     plot_bgcolor: 'rgb(238, 206, 173)',
     paper_bgcolor: 'smokewhite',
     showlegend: false,
     xaxis: {
      title: {
        text: 'Countries',
        standoff: 30, // Adjust the standoff value for the desired gap
      },
      tickangle: 45,
    
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
      color: '#ef6e04'
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
    },    
     },
     margin: {
      l: 100, // Increase left margin
      r: 20,
      b: 200, // Increase bottom margin
      t: 100,
      pad: 10,
    },
     yaxis: {
       title: attribute,
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
      color: '#ef6e04'
    },
    tickfont: {
      family: 'Time New Roman',
      size: 20,
      color: 'black'
    },
    linecolor: '#636363',
    linewidth: 6
     },
   };
 
   // Plot using Plotly
   Plotly.newPlot(containner_chart, [barGraph], layout);
 }

initiateDropdown()
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset, #selDataset_2, #selDataset_from_year, #selDataset_population_attribute, #selDataset_to_year, #selDataset_against").on("change", loadData);
d3.selectAll("#selDataset_gdp_bar,#selDataset_year_bar").on('change',load_bar_chart)