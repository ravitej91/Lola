'use strict';

angular.module('myApp.lolaComponent.lola-sunburst-directive', [])
    .directive('lolaSunBurst', ['$window', 'LOLA_COLOR_SCHEMES',
        function($window, lolacolorschemes) {
            function link(scope, element, attr) {
                // intialize d3 variable
                var d3 = $window.d3;
                // sun burst object
                var sunBurst = {};
                // graph object
                sunBurst.graph  = {};
                // legend object
                sunBurst.legend = {};
                function init() {
                    /**
                     * Caluculations and functions to draw chart
                     */
                    // intialize lola element
                    sunBurst.lolaElement = intializeLolaElement();
                    // create graph div
                    sunBurst.graphDiv = createGraphDiv();
                    // create legend div
                    sunBurst.legendDiv = createLegendDiv();
                    // get width and height for the graph
                    sunBurst.computedElemDimensions = getComputedElementDimensions();
                    // get data for the graph
                    sunBurst.data = getChartData();
                    // get dimensions of the element
                    sunBurst.dimensions = getElemDimensions();
                    // get range for the x and y
                    sunBurst.range = getChartRange();
                    // get color scheme
                    sunBurst.colorScheme = getColorScheme();
                    // append svg to the element
                    sunBurst.svg = appendSvg();
                    // get partition layout 
                    sunBurst.partition = createPartitionLayout();
                    // arc function for the sunchart
                    sunBurst.arc = drawArc();
                    // root data
                    sunBurst.root = sunBurst.data;
                    // suncahrt tooltip
                    sunBurst.tooltip = createTooltip();
                    /**
                     * Draw sunburst graph 
                     */
                    drawSunBurstGraph();
                    // create legend for the graph
                    sunBurst.legend.element = intiliazeLegend();
                    // add elements to legend
                    sunBurst.legend.parents = createParents();

                }
                /**
                 * intializes lola element
                 * @returns d3 lola element
                 */
                function intializeLolaElement() {
                    // select lola element
                    var lolaElement = d3.select(element[0])
                            .style('display', 'block')
                            .style('overflow', 'auto');
                    return lolaElement;
                }
                /**
                 * create graph div with width 50%
                 * @returns d3 element graphdiv
                 */
                function createGraphDiv() {
                    //append element with graph div
                    var graphDiv = sunBurst.lolaElement.append('div')
                            .attr('id', 'lola-sunburst-graph-container')
                            .style('float', 'left')
                            .style('width', '50%')
                            .style('position', 'relative')
                            .style('min-height', '1px')
                            .style('padding-right', '15px')
                            .style('padding-left', '15px');

                    return graphDiv;
                }
                /**
                 * creates legend div with width 50%
                 * @returns d3 element legend div
                 */
                function createLegendDiv() {
                    //append element with graph div
                    var legendDiv = sunBurst.lolaElement.append('div')
                            .attr('id', 'lola-sunburst-legend-container')
                            .style('float', 'left')
                            .style('width', '50%')
                            .style('position', 'relative')
                            .style('min-height', '1px')
                            .style('padding-right', '15px')
                            .style('padding-left', '15px');
                    return legendDiv;
                }
                /**
                 * get computed width and height for the lola sunburst graph
                 * @returns {_L5.link.getComputedElementDimensions.computed}
                 */
                function getComputedElementDimensions() {
                    var computed = {};
                    computed.width = (parseInt(sunBurst.graphDiv.style('width')) - 30);
                    computed.height = (parseInt(sunBurst.graphDiv.style('width')) - 30);
                    return computed;
                }
                /**
                 * to get chart data
                 * @returns data chartData
                 */
                function getChartData() {
                    var data = scope.data;

                    return data;
                }
                /**
                 * dimensions of the lola element
                 * @returns {_L4.link.getElemDimensions.elem}
                 */
                function getElemDimensions() {
                    var elem = {};
                    elem.width = sunBurst.computedElemDimensions.width;
                    elem.height = sunBurst.computedElemDimensions.height;
                    elem.radius = Math.min(elem.width, elem.height) / 2;

                    return elem;

                }
                /**
                 * chart range x, y
                 * @returns {_L4.link.getChartRange.range}
                 */
                function getChartRange() {
                    var range = {};
                    range.x = d3.scale.linear()
                            .range([0, 2 * Math.PI]);
                    range.y = d3.scale.sqrt()
                            .range([0, sunBurst.dimensions.radius]);

                    return range;
                }
                /**
                 * get color scheme to apply for the chart
                 * @returns color colorSchemeObject
                 */
                function getColorScheme() {

                    var color = d3.scale
                            .ordinal()
                            .range(getColorSchemeName());

                    return color;
                }
                /**
                 * get lola color scheme name for the input value
                 * @returns {_L5.lolacolorschemes}
                 */
                function getColorSchemeName() {
                    // take color value from the element
                    var color = scope.color;

                    if (!color) {
                        color = 'COLOR_ORANGE';
                    } else {
                        // construct color scheme name; convert the name to all caps
                        color = color.toUpperCase();
                        // concatenate with lola color preceder
                        color = 'COLOR_' + color;
                    }
                    // return color array
                    return lolacolorschemes[color] ? lolacolorschemes[color] : lolacolorschemes['COLOR_ORANGE'];
                }


                /**
                 * function to append svg element to LolaElement
                 * @returns svg svg element
                 */
                function appendSvg() {
                    var svg = sunBurst.graphDiv.append("svg")
                            .attr("width", sunBurst.dimensions.width)
                            .attr("height", sunBurst.dimensions.height)
                            // create a main group
                            .append("g")
                            // transform the svg to get padding
                            .attr("transform", "translate(" +
                                    sunBurst.dimensions.width / 2 +
                                    "," +
                                    (sunBurst.dimensions.height / 2) +
                                    ")");
                    return svg;
                }
                /**
                 * generates a d3 partition layout
                 * @returns partition D3partitionLayout
                 */
                function createPartitionLayout() {
                    var partition = d3.layout.partition()
                            // value for which the graph need to be generated
                            .value(function(d) {
                                return 1;
                            });

                    return partition;
                }
                /**
                 * Draws arc for the paths in svg
                 * @returns arc arcd
                 */
                function drawArc() {
                    var arc = d3.svg.arc()
                            // start angle for the arc
                            .startAngle(function(d) {
                                return Math.max(0, Math.min(2 * Math.PI, sunBurst.range.x(d.x)));
                            })
                            // end angle for the arc
                            .endAngle(function(d) {
                                return Math.max(0, Math.min(2 * Math.PI, sunBurst.range.x(d.x + d.dx)));
                            })
                            // inner radius 
                            .innerRadius(function(d) {
                                return Math.max(0, sunBurst.range.y(d.y));
                            })
                            // outer radius
                            .outerRadius(function(d) {
                                return Math.max(0, sunBurst.range.y(d.y + d.dy));
                            });

                    return arc;
                }
                /**
                 * Appends tooltip template to Lola element
                 * @returns tooltip tooltip template
                 */
                function createTooltip() {
                    var tooltip = d3.select("body")
                            .append("div")
                            .attr('id', 'lolaTooltip')
                            .text("a simple tooltip");

                    return tooltip;

                }
                /**
                 * Function to draw a sunburst graph for the given data
                 * @returns null
                 */
                function drawSunBurstGraph() {
                    // create a group for all the nodes in root data
                    sunBurst.graph.g = createGroupsForRoot();
                    // create and fill paths for all nodes
                    sunBurst.graph.path = drawPathForRoot();
                    // append texts for each node
                    sunBurst.graph.text = appendTextForRoot();
                }
                /**
                 * Creates groups for all the nodes in the graph
                 * @returns groups g
                 */
                function createGroupsForRoot() {
                    var groupNodes = sunBurst.svg.selectAll("g")
                            .data(sunBurst.partition.nodes(sunBurst.root))
                            .enter()
                            .append("g")
                            // on mouseover of group show tooltip [TODO]
                            .on("mouseover", sunBurst.graph.showTooltip)
                            .on("mousemove", sunBurst.graph.moveToolTip)
                            .on("mouseout", sunBurst.graph.hideToolTip);

                    return groupNodes;
                }
                /**
                 * draws path for each node in the data
                 * @returns path p
                 */
                function drawPathForRoot() {
                    var path = sunBurst.graph.g.append("path")
                            .attr("d", sunBurst.arc)
                            // generate ID for all paths
                            .attr("id", function(d, i) {
                                return "path-" + i;
                            })
                            // hide inner circle
                            .attr("display", function(d) {
                                // if it is first node; no depth
                                return d.depth ? null : "none";
                            })
                            // fill the path with color
                            .attr("fill-rule", "evenodd")
                            .style("fill", function(d) {
                                return sunBurst.colorScheme((d.children ? d : d.parent).name);
                            })
                            .on("click", sunBurst.graph.clickEvent);
                    return path;
                }
                /**
                 * Append text to g for root data
                 * @returns text
                 */
                function appendTextForRoot() {
                    var text = sunBurst.graph.g.append("text")
                            .attr("x", function(d) {
                                return sunBurst.range.y(d.y);
                            })
                            .attr("dx", "6") // margin
                            .attr("dy", ".35em") // vertical-align
                            .attr("display", function() {
                                return "none";
                            })
                            .text(function(d) {
                                return d.name;
                            });
                    return text;
                }
                /**
                 * Helper function to make tooltip visible
                 * @returns tooltip
                 */
                sunBurst.graph.showTooltip = function() {
                    // get the text of the element
                    var text = d3.select(this).select('text');

                    return sunBurst.tooltip.text(text.html())
                            .attr('class', 'active');
                };
                /**
                 * Helper function to move tooltip with mouse position
                 * @returns tooltip
                 */
                sunBurst.graph.moveToolTip = function() {
                    return sunBurst.tooltip
                            .style("top", (d3.event.pageY - 30) + "px")
                            .style("left", (d3.event.pageX - 10) + "px");
                };
                /**
                 * Helper function to hide tooltip
                 * @returns tooltip
                 */
                sunBurst.graph.hideToolTip = function() {
                    return sunBurst.tooltip.attr('class', '');
                };
                /**
                 * Helper function
                 * Makes animated transition when arc is clicked
                 * @param d3 d
                 * @returns 
                 */
                sunBurst.graph.clickEvent = function(d) {
                    // get the clicked element
                    var selectedElement = d3.select(this),
                            // check if the first element
                            isFirstElement = checkFirstElement(selectedElement);
                    return sunBurst.graph.path.transition()
                            .duration(750)
                            .attr("display", function(d) {
                                if (isFirstElement) {
                                    return d.depth ? null : "none";
                                } else {
                                    // if it is first node; no depth
                                    return d.depth ? null : "block";
                                }
                            })
                            // hide inner circle
                            .attrTween("d", arcTween(d));
                };
                function checkFirstElement(selectedElement) {
                    // get id of the element
                    var idString = selectedElement[0][0].id;
                    // splice the id to get number
                    var id = idString.substring(5);
                    if (id === "0") {

                        return true;
                    }

                    return false;
                }
                /**
                 * Helper function
                 * Zoomable effect by making parent nodes to invisible; Interpolate scale
                 * @param d
                 * @returns new sunchart
                 */
                function arcTween(d) {
                    var xd = d3.interpolate(sunBurst.range.x.domain(), [d.x, d.x + d.dx]),
                            yd = d3.interpolate(sunBurst.range.y.domain(), [d.y, 1]),
                            yr = d3.interpolate(sunBurst.range.y.range(), [d.y ? 20 : 0, sunBurst.dimensions.radius]);
                    return function(d, i) {
                        return i
                                ? function(t) {
                                    return sunBurst.arc(d);
                                }
                        : function(t) {
                            sunBurst.range.x.domain(xd(t));
                            sunBurst.range.y.domain(yd(t)).range(yr(t));
                            return sunBurst.arc(d);
                        };
                    };
                }
                // dynamically sets the height
                d3.select(self.frameElement).style("height", height + "px");

                /**
                 * Leged code
                 * [TODO] move all css to app.css
                 * [TODO] add progress bar
                 * [TODO] optimize the code and better solution
                 * intializing legend element
                 */
                function intiliazeLegend() {
                    // create a new element on legend div
                    var innerLegendContainer = sunBurst.legendDiv.append('div')
                            .attr('id', 'lola-legend-innerdiv')
                            .style('height', sunBurst.computedElemDimensions.height)
                            .style('padding-top', '20px')
                            .style('padding-bottom', '20px');

                    return innerLegendContainer;
                }
                /**
                 * function to create parent elements on legend
                 * [TODO] change implementation
                 * @returns null
                 */
                function createParents() {
                    // append ul element on inner legend
                    var ul = sunBurst.legend.element.append('ul');
                    var parentElement = ul.selectAll("li")
                            .data(sunBurst.root.children)
                            .enter()
                            .append("li")
                            .attr('class', 'lola-legend-li');
                    // add text to the div
                    parentElement.text(function(d) {
                        // construct the string with data
                        var count = d.children.length;
                        var text = d.name + '(' + count + ')';
                        return text;
                    });
                    // prepend legend box to the left
                    parentElement.append('span')
                            .attr('class', 'pull-left')
                            .style('padding','10px')
                            .style('margin-right','10px')
                            .style('box-shadow','0px 2px 2px 1px rgba(0,0,0,0.3)')
                            .style('background',function(d){
                                return sunBurst.colorScheme((d.children ? d : d.parent).name);
                            })
                            .on('click', showChildren);
                    // append view button at the end
                    parentElement.append('a')
                            .attr('href', 'javascript:void(0);')
                            .attr('class', 'pull-right')
                            .text('view')
                            .on('click', showChildren);   
                }
               /**
                * function to show children element
                * [TODO] need to change implementation
                */
                function showChildren(d) {
                    var childElement = d3.select(this.parentNode)
                            .append('ul')
                            .attr('class','inner-ul')
                            .selectAll('li')
                            .data(d.children)
                            .enter()
                            .append('li')
                            .attr('class', 'lola-legend-li')
                            .text(function(d) {
                                return d.name;
                            });

                    //add size details to child
                    childElement.append('span')
                            .attr('class', 'pull-right')
                            .text(function(d) {
                                // construt data
                                var string = "Size: "+ d.size;
                                return string;
                            });
                    // change the link to close
                    d3.select(this).text('close').on('click', function() {
                        // close the menu
                        d3.select(this.parentNode).select('ul').remove();
                        // change the name to view
                        d3.select(this).text('view').on('click', showChildren);
                    });
                }

                init();
            }
            return {
                link: link,
                restrict: 'E',
                scope: {
                    data: '=',
                    color: '@'
                }
            };
        }]);
