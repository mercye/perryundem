(function() {

var csvString = `group,answer,count
plan whether or when to have children ,positive effect,34
plan whether or when to have children ,negative effect,321
plan whether or when to have children ,no effect,246
plan whether or when to have children ,don't know,1
plan whether or when to have children ,skipped,4
raise children,positive effect,40
raise children,negative effect,365
raise children,no effect,196
raise children,don't know,2
raise children,skipped,3
keep children safe from over-policing ,positive effect,41
keep children safe from over-policing ,negative effect,412
keep children safe from over-policing ,no effect,150
keep children safe from over-policing ,don't know,1
keep children safe from over-policing ,skipped,2
keep children safe from incarceration ,positive effect,31
keep children safe from incarceration ,negative effect,432
keep children safe from incarceration ,no effect,137
keep children safe from incarceration ,don't know,3
keep children safe from incarceration ,skipped,3
have access to affordable housing,positive effect,39
have access to affordable housing,negative effect,461
have access to affordable housing,no effect,103
have access to affordable housing,don't know,1
have access to affordable housing,skipped,2
have access to clean water,positive effect,56
have access to clean water,negative effect,322
have access to clean water,no effect,219
have access to clean water,don't know,3
have access to clean water,skipped,6
have access to quality public schools ,positive effect,56
have access to quality public schools ,negative effect,417
have access to quality public schools ,no effect,123
have access to quality public schools ,don't know,3
have access to quality public schools ,skipped,7
have access to higher education,positive effect,58
have access to higher education,negative effect,418
have access to higher education,no effect,121
have access to higher education,don't know,1
have access to higher education,skipped,8
"have access to quality, affordable health care ",positive effect,52
"have access to quality, affordable health care ",negative effect,492
"have access to quality, affordable health care ",no effect,57
"have access to quality, affordable health care ",don't know,0
"have access to quality, affordable health care ",skipped,5
have acces to affordable birth control ,positive effect,43
have acces to affordable birth control ,negative effect,452
have acces to affordable birth control ,no effect,107
have acces to affordable birth control ,don't know,2
have acces to affordable birth control ,skipped,2
"have access to affordable, legal abortion care ",positive effect,51
"have access to affordable, legal abortion care ",negative effect,449
"have access to affordable, legal abortion care ",no effect,97
"have access to affordable, legal abortion care ",don't know,6
"have access to affordable, legal abortion care ",skipped,3
have access to affordable mental health care ,positive effect,46
have access to affordable mental health care ,negative effect,466
have access to affordable mental health care ,no effect,92
have access to affordable mental health care ,don't know,0
have access to affordable mental health care ,skipped,2
have access to affordable child care ,positive effect,42
have access to affordable child care ,negative effect,452
have access to affordable child care ,no effect,105
have access to affordable child care ,don't know,2
have access to affordable child care ,skipped,5
have access to healthy and affordable food options ,positive effect,51
have access to healthy and affordable food options ,negative effect,429
have access to healthy and affordable food options ,no effect,120
have access to healthy and affordable food options ,don't know,1
have access to healthy and affordable food options ,skipped,5
feel safe in their neighborhoods ,positive effect,54
feel safe in their neighborhoods ,negative effect,397
feel safe in their neighborhoods ,no effect,152
feel safe in their neighborhoods ,don't know,0
feel safe in their neighborhoods ,skipped,3
get help in situations of domestic violence ,positive effect,55
get help in situations of domestic violence ,negative effect,342
get help in situations of domestic violence ,no effect,204
get help in situations of domestic violence ,don't know,1
get help in situations of domestic violence ,skipped,4
get treatment for drug or alcohol addiction ,positive effect,53
get treatment for drug or alcohol addiction ,negative effect,394
get treatment for drug or alcohol addiction ,no effect,155
get treatment for drug or alcohol addiction ,don't know,2
get treatment for drug or alcohol addiction ,skipped,3
have equal pay in the workplace,positive effect,51
have equal pay in the workplace,negative effect,406
have equal pay in the workplace,no effect,145
have equal pay in the workplace,don't know,1
have equal pay in the workplace,skipped,3
have equal opportunities to move up in the workplace,positive effect,56
have equal opportunities to move up in the workplace,negative effect,401
have equal opportunities to move up in the workplace,no effect,147
have equal opportunities to move up in the workplace,skipped,1
have equal opportunities to move up in the workplace,refused ,1
have job opportunities that pay a livable wage,positive effect,74
have job opportunities that pay a livable wage,negative effect,426
have job opportunities that pay a livable wage,no effect,104
have job opportunities that pay a livable wage,don't know,1
have job opportunities that pay a livable wage,skipped,1
vote in future elections without barriers,positive effect,47
vote in future elections without barriers,negative effect,399
vote in future elections without barriers,no effect,156
vote in future elections without barriers,skipped,3
vote in future elections without barriers,refused,1`;

var margin = {top: 10, right: 20, bottom: 20, left: 300},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y0 = d3.scaleBand()
    .rangeRound([height, 0])
    .padding(.2);

var y1 = d3.scaleLinear();

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(.1);

var xAxis = d3.axisBottom()
    .scale(x);

var nest = d3.nest()
    .key(function(d) {
      return d.group
    });

var data = d3.csvParse(csvString);

data.forEach(function(d) {
  d.count = +d.count;
});

var dataByGroup = nest.entries(data);

var keys = data.columns.slice(1);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(dataByGroup[0].values.map(function(d) {
  return d.answer; }));
y0.domain(dataByGroup.map(function(d) {
  return d.key; }));
y1.domain([0, d3.max(data, function(d) {
  return d.count; })]).range([y0.bandwidth(), 0]);

var stack = d3.stack()
.keys(keys)(data);

var group = svg.selectAll(".group")
.data(dataByGroup)
.enter().append("g")
.attr("class", "group")
.attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

group.append("text")
  .attr("class", "group-label")
  .attr("x", -6)
  .attr("y", function(d) {
    return y1(d.values[0].count / 2);
  })
  .attr("dy", ".35em")
  .text(function(d) { return d.key; });

group.selectAll("rect")
  .data(function(d) { return d.values; })
  .enter().append("rect")
  .style("fill", function(d) { return color(d.group); })
  .attr("x", function(d) { return x(d.answer); })
  .attr("y", function(d) { return y1(d.count); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return y0.bandwidth() - y1(d.count); });

group.filter(function(d, i) { return !i; }).append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + y0.bandwidth() + ")")
  .call(xAxis);
//
// d3.selectAll("input").on("change", change);
//
// var timeout = setTimeout(function() {
//   d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
// }, 2000);
//
// function change() {
//   clearTimeout(timeout);
//   if (this.value === "multiples") transitionMultiples();
//   else transitionStacked()
// }
//
// function transitionMultiples() {
//
//   var t = svg.transition().duration(750),
//       g = t.selectAll(".group")
//       .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
//
//   g.selectAll("rect")
//   .attr("y", function(d) {
//     return y1(d.count);
//   });
//   g.select(".group-label")
//   .attr("y", function(d) {
//     return y1(d.values[0].count / .5);
//   });
//
// }
//
// function transitionStacked() {
//
//   console.log('enter')
//
//   var t = svg.transition()
//              .duration(750),
//       g = t.selectAll(".group")
//           .attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
//
//   g.selectAll("rect")
//   .attr("y", function(d,i) {
//     console.log('initializing and defining dataSet')
//     var dataSet = dataByGroup.map((dataItem) => { return dataItem.values[i].count });
//     console.log(dataSet, i)
//     var transition = dataSet.splice(0, d.count).reduce((store, value) => { return store + value }, 0)
//     return y1(transition);
//     });
//
//   g.select(".group-label").attr("y", function(d,i) {
//   	var dataSet = dataByGroup.map((dataItem) => { return dataItem.values[0].count });
//     var transition = dataSet.splice(0, i).reduce((store, count) => { return store + count }, 0)
//   	return y1(transition + d.values[0].count / 2);
//   })
//}

})()
