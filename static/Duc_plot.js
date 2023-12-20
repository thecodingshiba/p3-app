// Define the URL for the JSON file
const jsonUrl = "http://127.0.0.1:5000/api/population";

//Functions
function optionChanged(selectedValue) {
    // Perform actions based on the selected value
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
    const dropdown2 = d3.select("#selDataset_year");

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
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdown.property("value");
    let dataset2=dropdown2.property("value")
})
  }
initiateDropdown()