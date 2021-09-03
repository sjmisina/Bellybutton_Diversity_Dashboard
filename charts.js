function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json(researchJSON).then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
var researchJSON = "samples.json";
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json(researchJSON).then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  var tableTitle = "Top 10 Bacteria Culture Results"
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(researchJSON).then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0]
    console.log(result);
    console.log(result.sample_values.length);

    if (result.sample_values.length <9) {
      tableTitle = ((result.sample_values.length) + " Total Bacteria Culture Result(s) Found"); 
    };

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids.slice(0,10).reverse();
    console.log("IDs: " + otu_ids);
    var otu_labels = result.otu_labels.slice(0,10).reverse();
    console.log("Labels: " + otu_labels);
    var sample_values = result.sample_values.slice(0,10).reverse();
    console.log("Values: " + sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(function(id) {
      return ("OTU " + id)
    });
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values,
      y: yticks,
      hovertext: otu_labels,
      type: "bar",
      orientation: "h",
    };
    var data = [barData]
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: (tableTitle),
      xaxis: {title: "Sample Value"},
      yaxis: {title: "Bacterial ID"},
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout);
  });
  
  // 1. Create the trace for the bubble chart
  d3.json(researchJSON).then((data1) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data1.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    console.log("Result Array" + resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("result: " + result);
  
  var bubbleData = {
    x: result.otu_ids,
    y: result.sample_values,
    hovertext: result.otu_labels,
    mode: 'markers',
    marker: {
      size: result.sample_values,
      color: "blue",
      opacity: .35,
    }
  };

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: "Bacteria Cultures Per Sample",
    showlegend: false,
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
};
