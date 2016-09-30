//adjust the size and position of the SVG to ensure that it has margins around the edge of the screen.
var svg = d3.select(".plot"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

//set up the scaling for the x and y axes
//axes need both a range and a domain. Domain is set below, after the data has loaded.
//Range is the set of values that the data should be projected onto (here, up to the width of the svg)
//Domain is the set of values that will need to be projected (data min to data max).
var x = d3.scalePoint().rangeRound([0, width]).padding(0.1), //use for categorical axis - divides axis into discrete steps of the right width to fill the axis length
    y = d3.scaleLinear().rangeRound([height, 0]); //continuous scaling of y axis.

//add a new group to the svg canvas, and save it in a variable called g so that we can call it later
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //move the group to the right place

//load a csv file, then call the parse function to look at each row, then call the callback dataLoaded when all the rows are parsed
d3.csv('daylightChange.csv',parse, dataLoaded);
function parse(row) {  //receives each row of the csv, one at a time.
  return row;
}

//receives data variable, containing an object for each row in the table.
function dataLoaded(data) {

  //set the domain values for the x and y scale functions.
  //Map the values to the contents of the loaded data objects, so that each month name becomes a key
  x.domain(data.map(function(d) { return d.month; }));
  //use the array max function to find the biggest value in the delta attribute of the data, and use that to set the max for the x axis
  y.domain([0, d3.max(data, function(d) { return d.delta; })]);

  //add a group to the SVG canvas to contain the axis
  g.append("g")
      .attr("class", "axis axis--x")  //set the css class of the axis for styling/calling later
      .attr("transform", "translate(0," + height + ")") //move the group into place
      .call(d3.axisBottom(x)); //actually create the axis

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))  //set up the tick marks
      .append("text")                  //add an axis label
      .style('fill','gray')
      .style('font-size','12px')
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Minutes");

/* DATA BIND */
  g.selectAll(".dots")  //create an empty selection
      .data(data)       //bind the data to the selection
      .enter()          //create a set of placeholders in the DOM, one for each bound data object
      .append("circle") //append one circle to the selection for each bound data object
      .attr("class", "dots")
      .attr("cx", function(d) { return x(d.month); })  //set the circle x,y, and radius values, using the scale functions operating on the bound data
      .attr("cy", function(d) { return y(d.delta); })
      .attr("r", 5)
      /*.on('mouseover',function(){  //add mouseover behavior

        temp = d3.select(this);  //grab the element that the mouse is over, and store it in a temp variable

        temp                //for that node,
            .transition()   //make smooth transitions
            .attr("r",24)   //increase the radius to 24
            .attr('fill','orange');  //and change the fill color

        g.append('text')    //add a label to say what the y value is
            .attr('x', x(temp.data()[0].month))  //return the data attribute of temp, take the month attribute of the 0th element, and scale it using the x function
            .attr('y', y(temp.data()[0].delta))
            .attr('class','text-label')
            .style('font-size',24)               //use CSS styles to specify text props (can also do in CSS file)
            .style('text-anchor','middle')
            .transition()
            .delay(50)                          //wait 50 ms before adding
            .text(temp.data()[0].delta);        //set text to the value stored in the bound data object.
      })
      .on('mouseout',function(){
        d3.select(this)
            .transition()
            .attr("r",5)
            .attr('fill','black');
        d3.select('.text-label').remove();      //remove the label element from the DOM
      })*/;


}

/* UPDATE FUNCTION */
function buttonPress(){ //runs when user presses the button
  g.selectAll('.dots')  //select all elements of class dots from the DOM (these are the elements with data bound to them)
      .attr('cy',function(d){ return Math.random()*(y(d.delta));})  //reset their y coordinates using a random value
}
