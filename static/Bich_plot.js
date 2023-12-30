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
    width: 800,
    height: 550,
    plot_bgcolor: 'rgb(238, 201, 197)',
    paper_bgcolor: 'smokewhite',
    showlegend: false,
    xaxis: {
      title: {
        text: `Year`  // Set the x-axis title
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
      //title: {
      //  text: `${raw}`  // Set the y-axis title
      //},
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