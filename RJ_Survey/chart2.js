(function(){

  var tsvString = `group	date	value
1	2008-01	10
1	2008-04	8
1	2008-07	14
1	2008-10	9
1	2009-01	10
1	2009-04	8
1	2009-07	14
1	2009-10	9
2	2008-01	3
2	2008-04	3.5
2	2008-07	5
2	2008-10	11
2	2009-01	3
2	2009-04	3.5
2	2009-07	4.5
2	2009-10	10.5
3	2008-01	10
3	2008-04	8
3	2008-07	14
3	2008-10	9
3	2009-01	10
3	2009-04	8
3	2009-07	14
3	2009-10	9
4	2008-01	3
4	2008-04	3.5
4	2008-07	5
4	2008-10	11
4	2009-01	3
4	2009-04	3.5
4	2009-07	4.5
4	2009-10	10.5`;

console.log("initializing parseDate, formatYear, and formatDate")
var parseDate = d3.timeParse("%Y-%m"),
    formatYear = d3.format("02d"),
    formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); };

console.log("initializing margin, width, and height")
var margin = {top: 10, right: 20, bottom: 20, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

console.log("initializing y0")
var y0 = d3.scaleBand()
    .rangeRound([height, 0])
    .padding(.2);

console.log("initializing y1")
var y1 = d3.scaleLinear();

console.log("initializing x")
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(.1);

console.log("initializing xAxis")
var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(formatDate);

console.log("initializing nest")
var nest = d3.nest()
    .key(function(d) { return d.group; });

console.log("parsing data")
var data = d3.tsvParse(tsvString);

console.log("formating date and value variables")
data.forEach(function(d) {
  d.date = parseDate(d.date);
  d.value = +d.value;
});

console.log("nesting data; initializing dataByGroup")
var dataByGroup = nest.entries(data);

console.log("initializing keys variable")
var keys = data.columns.slice(1);

console.log("initializing color variable")
var color = d3.scaleOrdinal(d3.schemeCategory10);

console.log("initializing svg")
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(dataByGroup[0].values.map(function(d) {
  return d.date; }));

y0.domain(dataByGroup.map(function(d) {
  return d.key; }));

y1.domain([0, d3.max(data, function(d) { return d.value; })])
  .range([y0.bandwidth(), 0]);

console.log(y0.bandwidth())

var stack = d3.stack()
	.keys(keys)(data);

console.log("initializing group variable, appending g")

var group = svg.selectAll(".group")
.data(dataByGroup)
.enter().append("g")
.attr("class", "group")
.attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

group.append("text")
  .attr("class", "group-label")
  .attr("x", -6)
  .attr("y", function(d) {
    return y1(d.values[0].value / 2); 
  })
  .attr("dy", ".35em")
  .text(function(d) { return "Group " + d.key; });

group.selectAll("rect")
  .data(function(d) { return d.values; })
  .enter().append("rect")
  .style("fill", function(d) { return color(d.group); })
  .attr("x", function(d) { return x(d.date); })
  .attr("y", function(d) { return y1(d.value); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return y0.bandwidth() - y1(d.value); });

group.filter(function(d, i) { return !i; }).append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + y0.bandwidth() + ")")
  .call(xAxis);

d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "multiples") transitionMultiples();
  else transitionStacked()
}

function transitionMultiples() {
  var t = svg.transition().duration(750),
      g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
  g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
  g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
}

function transitionStacked() {
  var t = svg.transition().duration(750),
      g = t.selectAll(".group")
      .attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");

  g.selectAll("rect")
  .attr("y", function(d,i) {
    var dataSet = dataByGroup.map((dataItem) => { return dataItem.values[i].value });
    // console.log(dataSet)

    var transition = dataSet.splice(0, d.group).reduce((store, value) => { return store + value }, 0)

  	return y1(transition);
  });

  g.select(".group-label").attr("y", function(d,i) {
  	var dataSet = dataByGroup.map((dataItem) => { return dataItem.values[0].value });
    var transition = dataSet.splice(0, i).reduce((store, value) => { return store + value }, 0)

  	return y1(transition + d.values[0].value / 2);
  })
}

})()
