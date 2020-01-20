//set the svg dimensions
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

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

var circRadius;
function crGet() {
  if (svgWidth <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

//******************/ The Labels for our Axes****************************************
//  Bottom Axis
// =====================================================
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

xText
  .append("text")
  .attr("y", -26)
  .attr("transform","translate(" + ((svgWidth - labelArea) / 2 + labelArea) + ", " +(svgHeight - margin - tPadBot) +")")
  .attr("data-axis", "x")
  .attr("data-name", "poverty")
  .attr("class", "aText active x")
  .text("Poverty (%)");
  //2.age
  xText
  .append("text")
  .attr("y", 0)
  .attr("transform","translate(" + ((svgWidth - labelArea) / 2 + labelArea) + ", " +(svgHeight - margin - tPadBot) +")")
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

// Left Axis
// ========================================================
// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + tPadLeft;
var leftTextY = (svgHeight + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");
yText.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("data-name", "healthcare")
    .attr("y", -26)
    .attr("transform", "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("Lacks Healthcare (%)");
yText.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("data-name", "smokes")
    .attr("transform", "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .attr("data-axis", "y")
    .attr("class", "aText inactive y")
    .text("smokes (%)");           

//********************Load data from .csv file******************************************
// ========================
d3.csv("assets/data/data.csv").then(function(data) {
  var curX = "poverty";
  var curY = "healthcare";
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  function xMinMax() {
    xMin = d3.min(data, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    xMax = d3.max(data, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  function yMinMax() {
    yMin = d3.min(data, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    yMax = d3.max(data, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }
  xMinMax();
  yMinMax();
  //ToolTip
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // Grab the state name.
      var State = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var Y = "<div>" + curY + ": " + d[curY] + "%</div>";
      var X = "<div>" + curX + ": " + d[curX] + "%</div>";
      
    
      // Display what we capture.
      return State + X + Y;
    });
    //============================
  // Call the toolTip function.
  svg.call(toolTip);
  //============================
  
  
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, svgWidth - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([svgHeight - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  

  // append x axis
  
  svg.append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (svgHeight - margin - labelArea) + ")");
  
    // append y axis
  
  svg.append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(data).enter();

  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });
    //=======
    theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
    d3.selectAll(".aText").on("click", function() {
      var self = d3.select(this);

      if (self.classed("inactive")) {
        // Grab the name and axis saved in label.
        var axis = self.attr("data-axis");
        var name = self.attr("data-name");
  
        // When x is the saved axis, execute this:
        if (axis === "x") {
          // Make curX the same as the data name.
          curX = name;
  
          // Change the min and max of the x-axis
          xMinMax();
  
          // Update the domain of x.
          xScale.domain([xMin, xMax]);
  
          // Now use a transition when we update the xAxis.
          svg.select(".xAxis").transition().duration(300).call(xAxis);
  
          // With the axis changed, let's update the location of the state circles.
          d3.selectAll("circle").each(function() {
            
            d3
              .select(this)
              .transition()
              .attr("cx", function(d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });
  
          // We need change the location of the state texts, too.
          d3.selectAll(".stateText").each(function() {
            // We give each state text the same motion tween as the matching circle.
            d3
              .select(this)
              .transition()
              .attr("dx", function(d) {
                return xScale(d[curX]);
              })
              .duration(300);
          });
  
          // Finally, change the classes of the last active label and the clicked label.
          labelChange(axis, self);
        }
        else {
          // When y is the saved axis, execute this:
          // Make curY the same as the data name.
          curY = name;
  
          // Change the min and max of the y-axis.
          yMinMax();
  
          // Update the domain of y.
          yScale.domain([yMin, yMax]);
  
          // Update Y Axis
          svg.select(".yAxis").transition().duration(300).call(yAxis);
  
          // With the axis changed, let's update the location of the state circles.
          d3.selectAll("circle").each(function() {
            
            d3
              .select(this)
              .transition()
              .attr("cy", function(d) {
                return yScale(d[curY]);
              })
              .duration(300);
          });
  
          // We need change the location of the state texts, too.
          d3.selectAll(".stateText").each(function() {
            // We give each state text the same motion tween as the matching circle.
            d3
              .select(this)
              .transition()
              .attr("dy", function(d) {
                return yScale(d[curY]) + circRadius / 3;
              })
              .duration(300);
          });
  
          // Finally, change the classes of the last active label and the clicked label.
          labelChange(axis, self);
        }
      }
    });



    });

