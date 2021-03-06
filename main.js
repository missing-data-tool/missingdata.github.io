

// remove index randomly
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    var removed_idx = [];
    var remove_num = parseInt(max * 0.2);
    console.log('how many',remove_num);

    for(var i = 0; i < remove_num; i++){
        var idx = Math.floor(Math.random() * (max - min + 1)) + min;
        removed_idx.push(idx);
        //in order to removed repeated index


    }
    console.log('removed_idx',removed_idx);
    return removed_idx;
    // return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Global functions called when select elements changed
function onXScaleChanged() {
    var select = d3.select('#xScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.x = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

function onYScaleChanged() {
    var select = d3.select('#yScaleSelect').node();
    // Get current value of select element, save to global chartScales
    chartScales.y = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

// Also, declare global variables for missing amount, total amount, and percentage
missing_count = 0;
total_count = 0;
per = 0;


// the work flow is like when click on a button it will remove the other one
//or this button is to remove
function drawBar() {
    // $('scatter_view').remove();
    document.getElementById('bar_view').style.display = "inline";
    document.getElementById('bar_radio').style.display = "inline";
    document.getElementById('scatter_radio').style.display = "none";
    document.getElementById('scatter_view').style.display = "none";
    // document.getElementById('bar_vis').style.display = "none";


}

//show scatter when after click button
function drawScatter() {
    // d3.select("#scatter_view").select("svg").remove();
    document.getElementById('scatter_view').style.display = "inline";
    document.getElementById('scatter_radio').style.display = "inline";
    document.getElementById('bar_radio').style.display = "none";
    document.getElementById('bar_view').style.display = "none";

    // document.getElementById('bar_vis').style.display = "none";

    // alert("Your data contains "+ per + " percentage of missing values exist in your data");
}

// this is for temporary imputation
function glob_avg(val,rand_idx){
    var sum = 0;
    var new_arr = [];

    for(var i = 0;i < val.length; i++){
        sum += parseFloat(val[i]);
    }

    var avg = sum/val.length;
    console.log('glob avg',avg);

    for(var i =0;i<val.length;i++){
        if(rand_idx.includes(i)){
            val[i] = avg;
            new_arr.push(val[i]);
        }else{
            new_arr.push(val[i]);
        }
    }
    return new_arr;
}



// var svg = d3.select('svg');
var svg = d3.select('svg');
// var svg = d3.select('scatter_canvas').append('svg');



// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 40, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var xAxisG = chartG.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate('+[0, chartHeight]+')');

var yAxisG = chartG.append('g')
    .attr('class', 'y axis');

var transitionScale = d3.transition()
    .duration(600)
    .ease(d3.easeLinear);



function updateChart() {
    // **** Draw and Update your chart here ****
    // Update the scales based on new data attributes
    yScale.domain(domainMap[chartScales.y]).nice();
    xScale.domain(domainMap[chartScales.x]).nice();

    // Update the axes here first
    xAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisBottom(xScale));
    yAxisG.transition()
        .duration(750) // Add transition
        .call(d3.axisLeft(yScale));

    // Create and position scatterplot circles
    // User Enter, Update (don't need exit)
    var dots = chartG.selectAll('.dot')
        .data(whiskey);

    var dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        // .attr("fill","steelblue")
        .on('mouseover', function(d){ // Add hover start event binding
            // Select the hovered g.dot
            var hovered = d3.select(this);
            // Show the text, otherwise hidden
            hovered.select('text')
                .style('visibility', 'visible');
            // Add stroke to circle to highlight it
            hovered.select('circle')
                .style('stroke-width', 2)
                .style('stroke', '#333');
        })
        .on('mouseout', function(d){ // Add hover end event binding
            // Select the hovered g.dot
            var hovered = d3.select(this);
            // Remove the highlighting we did in mouseover
            hovered.select('text')
                .style('visibility', 'hidden');
            hovered.select('circle')
                .style('stroke-width', 0)
                .style('stroke', 'none');
        });

    // Append a circle to the ENTER selection
    // dotsEnter.append('circle')
    //     .attr('r', 3);
    dotsEnter.append('circle')
        .style("fill","steelblue")
        // .attr("fill","steelblue")
        .attr('r', 3);


    // Append a text to the ENTER selection
    dotsEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.Name;
        });

    // ENTER + UPDATE selections - bindings that happen on all updateChart calls
    dots.merge(dotsEnter)
        .transition() // Add transition - this will interpolate the translate() on any changes
        .duration(750)
        .attr('transform', function(d) {
            // Transform the group based on x and y property
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx, ty]+')';
        });

    // if the radio button is clicked
    //color clicked
    d3.selectAll(("input[value='color']")).on("change", function() {
        console.log('onchange color');
        //work
        redraw_color();
    });

    d3.selectAll(("input[value='gradient']")).on("change", function() {
        console.log('onchange gradient');
        //work
        redraw_gradient();
    });

    d3.selectAll(("input[value='error']")).on("change", function() {
        console.log('onchange error');
        redraw_error();
    });

    d3.selectAll(("input[value='pattern']")).on("change", function() {
        console.log('onchange pattern count');
        //work
        redraw_pattern();
    });

    d3.selectAll(("input[value='local']")).on("change", function() {
        console.log('onchange local');
        redraw_local();
    });

    d3.selectAll(("input[value='sketch']")).on("change", function() {
        console.log('onchange sketch');
        redraw_sketch();
    });

    d3.selectAll(("input[value='shape']")).on("change", function() {
        console.log('onchange shape');
        //not work
        redraw_shape();
    });

    function redraw_local(){
        dotsEnter.append('circle')
            .style("fill", function(d,i) {
                if(removed_idx.includes(i)){
                    return 'white'; //lightskyblue
                }else{
                    return "steelblue";
                }})
            .attr('r', 3);

        // Append a text to the ENTER selection
        dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            });

        // ENTER + UPDATE selections - bindings that happen on all updateChart calls
        dots.merge(dotsEnter)
            .transition() // Add transition - this will interpolate the translate() on any changes
            .duration(750)
            .attr('transform', function(d) {
                // Transform the group based on x and y property
                var tx = xScale(d[chartScales.x]);
                var ty = yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });


    }// end of local


    function redraw_color(){
        dotsEnter.append('circle')
            .style("fill", function(d,i) {
                if(removed_idx.includes(i)){
                    return '#87CEFA'; //lightskyblue
                }else{
                    return "steelblue";
                }})
            .attr('r', 3);

        // Append a text to the ENTER selection
        dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            });

        // ENTER + UPDATE selections - bindings that happen on all updateChart calls
        dots.merge(dotsEnter)
            .transition() // Add transition - this will interpolate the translate() on any changes
            .duration(750)
            .attr('transform', function(d) {
                // Transform the group based on x and y property
                var tx = xScale(d[chartScales.x]);
                var ty = yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });

    }// end of color

    function redraw_gradient(){

        var radialGradient = svg.append("defs")
            .append("radialGradient")
            .attr("id", "radial-gradient");

        radialGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#fff");

        radialGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "steelblue");

        dotsEnter.append('circle')
            .style("fill", function(d,i) {
                if(removed_idx.includes(i)){
                    return 'url(#radial-gradient)'; //lightskyblue
                }else{
                    return "steelblue";
                }})
            .attr('r', 3);

        // Append a text to the ENTER selection
        dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            });

        // ENTER + UPDATE selections - bindings that happen on all updateChart calls
        dots.merge(dotsEnter)
            .transition() // Add transition - this will interpolate the translate() on any changes
            .duration(750)
            .attr('transform', function(d) {
                // Transform the group based on x and y property
                var tx = xScale(d[chartScales.x]);
                var ty = yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });

    }// end of gradient

    function redraw_pattern(){
        dotsEnter.append('circle')
            .style("fill", function(d,i) {
                if(removed_idx.includes(i)){
                    return 'url(#circles-9)'; //lightskyblue
                }else{
                    return "steelblue";
                }})
            .attr('r', 3);

        // Append a text to the ENTER selection
        dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            });

        // ENTER + UPDATE selections - bindings that happen on all updateChart calls
        dots.merge(dotsEnter)
            .transition() // Add transition - this will interpolate the translate() on any changes
            .duration(750)
            .attr('transform', function(d) {
                // Transform the group based on x and y property
                var tx = xScale(d[chartScales.x]);
                var ty = yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });

    }// end of pattern

    function redraw_shape(){

        var symbol = d3.symbol();

        // dotsEnter.append('circle')
        dotsEnter.append('.point')
        .style("fill","steelblue")
            .attr("d",symbol.type(function(d,i){
                if(removed_idx.includes(i)){
                    return d3.symbolDiamond;
                }
            }))
            .attr('r', 3);

        // Append a text to the ENTER selection
        dotsEnter.append('text')
            .attr('y', -10)
            .text(function(d) {
                return d.Name;
            });

        // ENTER + UPDATE selections - bindings that happen on all updateChart calls
        dots.merge(dotsEnter)
            .transition() // Add transition - this will interpolate the translate() on any changes
            .duration(750)
            .attr('transform', function(d) {
                // Transform the group based on x and y property
                var tx = xScale(d[chartScales.x]);
                var ty = yScale(d[chartScales.y]);
                return 'translate('+[tx, ty]+')';
            });

    }// end of shape


}


// Remember code outside of the data callback function will run before the data loads
var rowToHtml = function( row ) {
    var result = "";
    for (key in row) {
        result += key + ": " + row[key] + "<br/>"
    }
    return result;
};



var previewCsvUrl = function( csvUrl ) {

    //part that draws the scatter chart
    // Compute chart dimensions
    //         var	margin = {top: 30, right: 20, bottom: 30, left: 50},
    var	margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    //width =400, height 2230
    d3.csv(csvUrl,function(row) {
            if (row['Price'] === "null" || row['Price'] ===""){
                ++missing_count;
                ++total_count;
            }else{
                ++total_count;
            }
        return {
            'Name': row['Name'],
            'Rating': +row['Rating'],
            'Country': row['Country'],
            'Category': row['Category'],
            'Price': +row['Price'],
            'ABV': +row['ABV'],
            'Age': +row['Age'],
            'Brand': +row['Brand']
        };
    },
    function(error, dataset) {
        // Log and return from an error
        if(error) {
            console.error('Error while loading ./letter_freq.csv dataset.');
            console.error(error);
            return;
        }

        // **** Your JavaScript code goes here ****

        // Create global variables here
        whiskey = dataset;

        // removed_idx = getRandomInt(0,whiskey.length-1);
        removed_idx = [77, 32, 255, 174, 152, 226, 18, 100, 142, 267, 10, 191, 248, 40, 97, 34, 276, 163, 83, 203, 155, 261, 14, 194, 129, 71, 145, 62];


        // Create scales and other functions here
        xScale = d3.scaleLinear()
            .range([0, chartWidth]);
        yScale = d3.scaleLinear()
            .range([chartHeight, 0]);

        // Get min, max here for all dataset columns
        // Fun tip, dataset.columns includes an array of the columns
        domainMap = {};

        dataset.columns.forEach(function(column) {
            domainMap[column] = d3.extent(dataset, function(data_element){
                return data_element[column];
            });
        });

        //get the percentage of the two
        per = Math.floor(missing_count/total_count)*100;



        // Create global object called chartScales to keep state
        chartScales = {x: 'Price', y: 'Age'};
        //============this temporary commented
        // user preference message, make it work for other variables as well
        var attribute = "Price";
        alert("You have " + missing_count + " missing values in attribute " + attribute);

        var userPrefernce;
        if (confirm("Do you want to exclude missing values from computation and the representation?")){
            txt = "You pressed Ok!";
        }else{
            txt = "You pressed Cancel!";
        }
        updateChart();


    });

    //*********BAR CHART*******
    //this part is for bar chart


    // d3.csv("./whiskey-test.csv", function(error, data){
    d3.csv(csvUrl, function(error, data){

        make_bar(data);
        // d3.select("svg").remove();


    });

    //make the bar function
    function make_bar(data){

        var margin = {top: 80, right: 180, bottom: 80, left: 180},
            width = 960 - margin.left - margin.right,
            // height = 500 - margin.top - margin.bottom;
            height = 500 - margin.top - margin.bottom;

        // var svg = d3.select("body").append("svg")
        var canvas = d3.select("#bar_canvas")
            // .append("svg")
            // .attr("id","canvas")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // filter year
        console.log('data',data)
        // var data = data.filter(function(d){return d.Year == '2012';});
        // Get every column value
        var elements = Object.keys(data[0])
            .filter(function(d){
                return ((d != "Name") & (d != "Country") & (d != "Category") & (d != "Brand"));
            });
        var selection = elements[0];

        var avg = d3.nest()
            .key(function(d){ return d.Category;})
            .rollup(function(v){return d3.mean(v,function(d){
                // console.log('nest selection',selection)
                return +d[selection];});})
            .entries(data);


        var y = d3.scaleLinear()
            // .domain([0, d3.max(data, function(d){
            //     return +d[selection];
            .domain([0,d3.max(avg,function(d){
                return d.value;
            })])
            .range([height, 0]);


        var x = d3.scaleBand()
        // .domain(data.map(function(d){ return d.Name;}))
            .domain(avg.map(function(d){ return d.key;}))
            // .rangeBands([0, width]);
            .rangeRound([0, width])
            .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);


        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "8px")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)" );

        canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        canvas.selectAll("rectangle")
            // .data(data)
            .data(avg)
            .enter()
            .append("rect")
            .attr("class","rectangle")
            // .attr("width", width/data.length-5)
            .attr("width", x.bandwidth())
            .attr("height", function(d){
                // return height - y(+d[selection]);
                return height -y(d.value);
            })
            .attr("x", function(d, i){
                // return x(d.Category);
                return x(d.key);
            })
            .attr("y", function(d){
                // return y(+d[selection]);
                return y(d.value);
            })
            .attr("fill","steelblue")
            .append("title")
            // .style("margin-left", "10px")   //space between bars
            .text(function(d){
                // return d.Name + " : " + d[selection];
                // return d.Category + " : " + d[selection];
                // return d.key + " : " + d.key;

            });

        // removed_idx = getRandomInt(0,data.length-1);
        removed_idx = [77, 32, 255, 174, 152, 226, 18, 100, 142, 267, 10, 191, 248, 40, 97, 34, 276, 163, 83, 203, 155, 261, 14, 194, 129, 71, 145, 62];

        var f_data = data.filter(function(d,i){return removed_idx.includes(i);})

        var missingCount = d3.nest()
            .key(function(d){return d.Category})
            .rollup(function(v){return v.length;})
            // .filter(function(d,i){return removed_idx.includes(i);})
            .entries(f_data);

        console.log("missigCount",missingCount);

        d3.selectAll(("input[value='bar_color']")).on("change", function() {
            console.log('onchange bar color');
            redraw_bar_color(missingCount);
        });

        d3.selectAll(("input[value='bar_gradient']")).on("change", function() {
            console.log('onchange bar gradient');
            //work
            redraw_bar_gradient(missingCount);
        });

        d3.selectAll(("input[value='bar_error']")).on("change", function() {
            console.log('onchange bar error');
            redraw_bar_error(missingCount);
        });

        d3.selectAll(("input[value='bar_pattern']")).on("change", function() {
            console.log('onchange bar pattern count');
            //work
            redraw_bar_pattern(missingCount);
        });

        d3.selectAll(("input[value='bar_local']")).on("change", function() {
            console.log('onchange bar local');
            redraw_bar_local(missingCount);
        });

        d3.selectAll(("input[value='bar_sketch']")).on("change", function() {
            console.log('onchange bar sketch');
            redraw_bar_sketch(missingCount);
        });


        // var selector = d3.select("#drop")
        // var selector = d3.select("#bar_view")
        var selector = d3.selectAll("#bar_view")
            .append("select")
            .attr("id","dropdown")
            .on("change", function(d){
                selection = document.getElementById("dropdown");

                var selectAvg = d3.nest()
                    .key(function(d){ return d.Category;})
                    .rollup(function(v){return d3.mean(v,function(d){
                        console.log('inside selection',selection.value);
                        return +d[selection.value];});})
                    .entries(data);

                console.log('selection',selectAvg);


                y.domain([0, d3.max(selectAvg, function(d){
                // y.domain([0,d3.max(data,function(d){
                //     return +d[selection.value];
                    return +d.value;
                })]);

                // d3.selectAll("g.y.axis")
                //     .transition()
                //     .call(yAxis);

                yAxis.scale(y);

               // this part added for transition


                var bar = d3.selectAll(".rectangle").data(selectAvg);

                bar.enter().append('rect')
                    .attr('class','bar')
                    .attr("x",function(d){return x(d.key);})
                    .attr('y',function(d){return y(d.value);})
                    .attr('height',function(d){return height - y(d.value);})
                    .attr("width",x.bandwidth());

                //remove data
                bar.exit().remove();

                bar.attr("y", function(d){return y(d.value);})
                    .attr('height',function(d){return height -y(d.value);});

                d3.selectAll("g.y.axis")
                    .transition()
                    .call(yAxis);

                bar.transition().duration(600)
                    .attr("y",function(d){return y(d.value);})
                    .attr("fill","steelblue")
                    .attr("height",function(d){return height -y(d.value)});

            });


        selector.selectAll("option")
            .data(elements)
            .enter().append("option")
            .attr("value", function(d){
                return d;
            })
            .text(function(d){
                return d;
            });

        function redraw_bar_color(missingCount){

            canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                .attr("fill","#87CEFA")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){
                    // return d.Name + " : " + d[selection];
                    // return d.Category + " : " + d[selection];
                    // return d.key + " : " + d.key;
                });

        }// end of bar color

        function redraw_bar_gradient(missingCount){

            // var gradient_bar = svg.append("svg:defs")
            var gradient_bar = canvas.append("svg:defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");

            gradient_bar.append("svg:stop")
                .attr("offset", "0%")
                .attr("stop-color", "steelblue")
                .attr("stop-opacity", 1);

            gradient_bar.append("svg:stop")
                .attr("offset", "100%")
                .attr("stop-color", "white")
                .attr("stop-opacity", 1);

            canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                .attr("fill","url(#gradient_bar)")
                .append("title")
                .text(function(d){
                    // return d.Name + " : " + d[selection];
                    // return d.Category + " : " + d[selection];
                    // return d.key + " : " + d.key;
                });

        }// end of bar gradient

        function redraw_bar_pattern(missingCount){

            canvas.selectAll("rectangle")
            // .data(data)
                .data(missingCount)
                .enter()
                .append("rect")
                .attr("class","rectangle")
                // .attr("width", width/data.length-5)
                .attr("width", x.bandwidth()/2)
                .attr("height", function(d){
                    return height -y(d.value);
                })
                .attr("x", function(d, i){
                    return x(d.key);
                })
                .attr("y", function(d){
                    return y(d.value);
                })
                .attr("fill","url(#diagonal-stripe-2)")
                // .attr("fill","url(#gradient)")
                .append("title")
                .text(function(d){
                    // return d.Name + " : " + d[selection];
                    // return d.Category + " : " + d[selection];
                    // return d.key + " : " + d.key;
                });

        }// end of bar pattern

    }// end of the make_bar function

    // this is the preview part, that shows the preview of the data
    d3.csv( csvUrl, function( rows ) {
        d3.select("div#preview").html(
            "<b>First row:</b><br/>" + rowToHtml( rows[0] ));
    })
};



d3.select("html")
    .style("height","100%")

data = d3.select("#cLeft")
// data = d3.select("body")
    .style("height","100%")
    .style("font", "12px sans-serif")
    // .style("margin-top","50px")
    // .style("display", "block")
    .append("input")
    .attr("type", "file")
    .attr("accept", ".csv")
    .style("margin", "5px")
    .on("change", function() {
        var file = d3.event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var dataUrl = evt.target.result;
                // The following call results in an "Access denied" error in IE.
                previewCsvUrl(dataUrl);

            };
            reader.readAsDataURL(file);
            //reader.readAsText(file);
        }
    });

// d3.select("#cLeft")
d3.select("#cRight")
// d3.select("body")
    .append("div")
    .attr("id", "preview")
    .style("margin", "5px")



// Initialize with csv file from server, this is the deafult
// previewCsvUrl("./whiskey.csv");
previewCsvUrl("./whiskey_global.csv");