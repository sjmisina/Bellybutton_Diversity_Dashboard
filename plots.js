// followed text to bottom of 12.4.3 - skill challenege

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
//  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    var printID = ("ID:  " + String(result.id));
    var printEth = ("ETHNICITY:  " + String(result.ethnicity));
    var printGen = ("GENDER:  " + String(result.gender));
    var printAge = ("AGE:  " + String(result.age));
    var printLoc = ("LOCATION:  " + String(result.location));
    var printBbt = ("BBTYPE:  " + String(result.bbtype));
    var printWfreq = ("WFREQ:  " + String(result.wfreq));
    console.log(printID)
    PANEL.append("h6").text(printID);
    PANEL.append("h6").text(printEth);
    PANEL.append("h6").text(printGen);
    PANEL.append("h6").text(printAge);
    PANEL.append("h6").text(printLoc);
    PANEL.append("h6").text(printBbt);
    PANEL.append("h6").text(printWfreq);
  });
}