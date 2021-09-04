// for deliverable 4, I have (1) added a background picture to the jumbotron
// I have (2) formatted the jumbotron text color, weight, and background for easier reading
// I have (3) formatted the hovertext for the bar and bubble charts to make info easier to read
// I have (4) modified the background color scale of the bubble chart to better align with the blue theme of page

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
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Initialize the dashboard
var researchJSON = "samples.json";
var washing = 0
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
    washing = result.wfreq;
    console.log("Wash Freq: " + washing);
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
// return washing;
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  console.log("sample = " + sample)
  const sampleFromInput = sample
  console.log("sampleFromInput: " + sampleFromInput)
  var tableTitle = "<b>Top 10 Bacteria Cultures Found</b>"
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(researchJSON).then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    console.log("sampleFromInput: " + sampleFromInput)
    var resultArray = sampleArray.filter(sampleObj => sampleObj.id == sampleFromInput);
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0]
    console.log(result);
    console.log(result.sample_values.length);

    if (result.sample_values.length <=10) {
      tableTitle = ("<b>" + (result.sample_values.length) + " Total Bacteria Cultures Found</b>"); 
    };

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    console.log("IDs: " + otu_ids);

    // format data labels
    var otu_labels = result.otu_labels;
    for(var i = 0; i < otu_labels.length; i++) {
      otu_labels[i] = otu_labels[i].replaceAll(';', '<br>');
      }
    console.log("Labels: " + otu_labels);

    var sample_values = result.sample_values;
    console.log("Values: " + sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(function(id) {
      return ("OTU " + id)
    });
    yticks = yticks.slice(0,10).reverse()
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      hovertext: otu_labels.slice(0,10).reverse(),
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
  
    // 1. Create the trace for the bubble chart.
    console.log("Bubble IDs: " + otu_ids);
    console.log("Bubble Vals: " + sample_values);
  
    var bubbleData = {
      type: "scatter",
      mode: "markers+text",
      hovertext: otu_labels,
      x: otu_ids,
      y: sample_values,
      marker: {
        color: otu_ids,
        cmin: 0,
        cmax: 4000,
        colorscale: "YlGnBu",
        opacity: 0.5,
        size: (sample_values),
        line: {
          color: "black",
          width: 2,
          opacity: 1
        },
        hovermode: 'closest',
      }
    }
    var data = [bubbleData];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      showlegend: false,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data, bubbleLayout); 
  
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washing,
        title: {text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week", font: {size: 24}},
        gauge: {
          axis: {range: [null, 10], tickwidth: 2, tickcolor: "black"},
          bar: {color: "black"},
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 30,
            value: washing
          }
        }
      }
    ];    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};
