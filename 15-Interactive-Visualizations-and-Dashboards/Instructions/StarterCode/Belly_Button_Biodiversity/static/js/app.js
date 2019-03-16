function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var defaultURL = `/metadata/${sample}`;
  d3.json(defaultURL).then(data => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var selection = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    selection.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.  
      selection.append('p')
      .text(`${key}: ${value}`);
    });
  
  })
   // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
  d3.json(defaultURL).then(data => {

    var ids = data.otu_ids;
    var labels = data.otu_labels;
    var counts = data.sample_values;
    var dataObjectArray = [];

    // Combine the data sets into one array of objects (for sorting)
    for (var d = 0; d < labels.length; d++) {
      dataObjectArray.push({'count': counts[d], 
      'code': ids[d], 'label': labels[d]}
    )};
    
    // Sort the array in descending order according to the count key values
    dataObjectArray.sort(function(a, b) {return (b.count) - (a.count)});

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var sorted_slice = dataObjectArray.slice(0,10);

    // @TODO: Build a Pie Chart using the sample data

    var pieLayout = { title: "Relative Bacteria Type Percentages",
                      indexLabelPlacement: "outside",
                      "layout": "auto"
                    };

    var pieData = [{ 'values' : sorted_slice.map(data => data.count),
                    'labels' : sorted_slice.map(data => data.label),
                    'textinfo': 'percent',
                    'hoverinfo' :('text'+'labels'+'values'+'percent'),
                    'type' : 'pie'
                  }];
    
    // Plot the pie chart
    Plotly.newPlot("pie", pieData, pieLayout);

    // @TODO: Build a Bubble Chart

    var bubblelayout = {title: "Microbes Compared: (Displays All)",
                        hovermode:"closest",
                        xaxis: {title:"OTU ID (Microbe identification number)"},
                        yaxis: {title:"Counts of microbe"}
                      }; 
      
    var bubbledata=[{x:ids,
                    y:counts,
                    text: labels,
                    mode: "markers",
                    marker: {size:counts,
                            color:ids,
                            colorscale: "Earth"} 
                    }];
                    
    // Plot the bubble chart                
    Plotly.newPlot("bubble",bubbledata,bubblelayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
