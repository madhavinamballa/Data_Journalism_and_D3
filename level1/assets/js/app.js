// @TODO: YOUR CODE HERE!

//==================
// Define SVG area dimensions
var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = svgWidth - svgWidth / 3.9;

// Define the chart's margins as an object
var margin = 20;
var labelArea=110;
  
//Healthcare vs. Poverty` or `Smokers vs. Age`
// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)
  .attr("class","chart");
  //======================================
// Load data from data.csv

  d3.csv("assets/data/data.csv")
  .then(function(stateData) {

    stateData.forEach(function(data) {
      console.log(data);
      
    });
//===============================================madhavi
  //domain xMax,xMin,yMin,yMax
  var xMin=d3.min(theData,function(d){
    return parseFloat(d.poverty)*0.90;
  });
  var xMax=d3.max(theData,function(d){
    return parseFloat(d.poverty)*1.10;
  });
  var yMax=d3.max(theData,function(d){
    return parseFloat(d.obesity)*1.10;
  });
  var YMin=d3.min(theData,function(d){
    return parseFloat(d.obesity)*0.90;
  });
//===============================
  // xscale and yscale
  var xScale = d3.scaleLinear()
      .domain([xMin,xMin])
      .range([0, width]);

  var yScale = d3.scaleLinear()
      .domain([yMin,yMax])
      .range([height, 0]);
  //====================================
  //passing scales to axis
  var xAxis=d3.axisBottom(xScale);
  var yAxis=d3.axisLeft(yScale);
  //=================================
  //append axis 
  svg.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg.append("g")
  .call(yAxis)
  .attr("transform", "translate(" + (margin + labelArea) + ", 0)");
  //========================
  var circlesGroup = svg.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black");
  var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
          return (`<strong>${dateFormatter(d.state)}<strong><hr>${d.poverty}`);
    });
  
  
    svg.call(toolTip);
  });