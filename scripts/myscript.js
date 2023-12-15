// add your JavaScript/D3 to this file
// Width and height
const w = 700;
const h = 300;
const margin = {top: 35, right: 100, bottom: 50, left: 100};
const innerHeight = h - margin.top - margin.bottom;
const innerWidth = w - margin.left - margin.right;

// create SVG element
const svg = d3.select("div#plot")
  .append("svg")
    .attr("width", w)
    .attr("height", h)

// create background rectangle
svg.append("rect")
.attr("width", w)
.attr("height", h)
.attr("fill", "rgb(230, 230, 230)");

// create plot group
svg.append("g")
  .attr("id", "plot")
  .attr("transform", `translate (${margin.left}, ${margin.top})`);

// loading dataset
const rowConverter = function (d) {
  return {
    country: d.Country,
    nineteen_inbound: +d.Nineteen_Inbound_Arrivals,
    twentyone_inbound: +d.TwentyOne_Inbound_Arrivals,
    nineteen_gdp: +d.Nineteen_Tourism_GDP_Cont,
    twentyone_gdp: +d.Twentyone_Tourism_GDP_Cont
  }
};

d3.csv("https://raw.githubusercontent.com/bchannavajjala/tourism/main/inbound_vs_gdp.csv", rowConverter).then(function(data) {

    const dataset = data;

    // Update xScale and yScale
    xScale = d3.scaleLinear()
    .domain([0,d3.max(dataset, d => d.nineteen_inbound)])
    .range([0, innerWidth]);

    yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, d => d.nineteen_gdp))
    .range([innerHeight, 0]);

    xAxis = d3.axisBottom()
    .scale(xScale);

    yAxis = d3.axisLeft()
    .scale(yScale);

  // Create horizontal gridlines
  svg.select("g#plot")
    .selectAll("line.horizontal")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("class", "horizontal")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#A9A9A9")
    .attr("stroke-width", 1);

  // Create vertical gridlines
  svg.select("g#plot")
    .selectAll("line.vertical")
    .data(xScale.ticks())
    .enter()
    .append("line")
    .attr("class", "vertical")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", "#A9A9A9")
    .attr("stroke-width", 1);

  // Create circles
  svg.select("g#plot")
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("cx", d => xScale(d.nineteen_inbound))
      .attr("cy", d => yScale(d.nineteen_gdp))
      .attr("r", 3)
      .on("mouseover", function(event,d) {
        const xcoord = +d3.select(event.currentTarget).attr("cx") + 5;
        const ycoord = +d3.select(event.currentTarget).attr("cy") - 5;
        console.log("Country:", d.country);
        svg.select("g#plot")
          .append("text")
          .attr("id", "tooltip")
          .attr("x", xcoord)
          .attr("y", ycoord)
          .attr("fill", "green")
          .text(d.country);
    })
    .on("mouseout", function () {
      // Remove the tooltip
      svg.select("#tooltip").remove();
      });

  // create x-axis
  svg.select("g#plot")
    .append("g")
    .attr("id", "xaxis")
    .attr("transform", `translate (0, ${innerHeight})`)
    .call(xAxis);

  // create x-axis label
  svg.select("g#plot")
    .append("text")
      .attr("id", "xlab")
      .attr("x", innerWidth/2)
      .attr("y", innerHeight + .75 * margin.bottom)
      .attr("text-anchor", "middle")
      .text("2019 Inbound Tourist Arrivals");

  // create y-axis
  svg.select("g#plot")
    .append("g")
    .call(yAxis)

  // create y-axis label
  svg.select("g#plot")
    .append("text")
      .attr("id", "ylab")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin.left)
      .attr("y", -margin.bottom)
      .attr("text-anchor", "middle")
      .text("2019 Tourism Contribution to GDP");



  // get value of radio button on click
  d3.selectAll("input")
  .on("click", function(event) {
      const year = event.currentTarget.value;
      if (year == "2021") {
      // update xScale and yScale
          xScale = d3.scaleLinear()
          .domain([0,d3.max(dataset, d => d.twentyone_inbound)])
          .range([0, innerWidth]);

          yScale = d3.scaleLinear()
          .domain(d3.extent(dataset, d => d.twentyone_gdp))
          .range([innerHeight, 0]);

          xAxis = d3.axisBottom()
          .scale(xScale);

          yAxis = d3.axisLeft()
          .scale(yScale);

          // Generate horizontal gridlines
          svg.select("g#plot")
            .selectAll("line.horizontal")
            .data(yScale.ticks())
            .enter()
            .append("line")
            .attr("class", "horizontal")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "#A9A9A9")
            .attr("stroke-width", 1);

            // Generate vertical gridlines
            svg.select("g#plot")
              .selectAll("line.vertical")
              .data(xScale.ticks())
              .enter()
              .append("line")
              .attr("class", "vertical")
              .attr("x1", d => xScale(d))
              .attr("x2", d => xScale(d))
              .attr("y1", 0)
              .attr("y2", innerHeight)
              .attr("stroke", "#A9A9A9")
              .attr("stroke-width", 1);

          svg.selectAll("circle")
            .attr("cx", d => xScale(d.twentyone_inbound))
            .attr("cy", d => yScale(d.twentyone_gdp))

      // update x-axis label
          svg.select("#xlab")
            .text("2021 Inbound Tourist Arrivals")

      // update y-axis label
          svg.select("#ylab")
            .text("2021 Tourism Contribution to GDP")

      } else {
        xScale = d3.scaleLinear()
          .domain([0,d3.max(dataset, d => d.nineteen_inbound)])
          .range([0, innerWidth]);

          yScale = d3.scaleLinear()
          .domain(d3.extent(dataset, d => d.nineteen_gdp))
          .range([innerHeight, 0]);

          xAxis = d3.axisBottom()
          .scale(xScale);

          yAxis = d3.axisLeft()
          .scale(yScale);

          // Create horizontal gridlines
          svg.select("g#plot")
            .selectAll("line.horizontal")
            .data(yScale.ticks())
            .enter()
            .append("line")
            .attr("class", "horizontal")
            .attr("x1", 0)
            .attr("x2", innerWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d))
            .attr("stroke", "#A9A9A9")
            .attr("stroke-width", 1);

            // Create vertical gridlines
            svg.select("g#plot")
              .selectAll("line.vertical")
              .data(xScale.ticks())
              .enter()
              .append("line")
              .attr("class", "vertical")
              .attr("x1", d => xScale(d))
              .attr("x2", d => xScale(d))
              .attr("y1", 0)
              .attr("y2", innerHeight)
              .attr("stroke", "#A9A9A9")
              .attr("stroke-width", 1);

            svg.selectAll("circle")
              .attr("cx", d => xScale(d.nineteen_inbound))
              .attr("cy", d => yScale(d.nineteen_gdp))

      // update x-axis label
          svg.select("#xlab")
            .text("2019 Inbound Tourist Arrivals")

      // update y-axis label
          svg.select("#ylab")
            .text("2019 Tourism Contribution to GDP")
      };

    // update x-axis
    svg.select("#xaxis")
      .call(xAxis);

    }) // end .on

  })

  .catch(function(error) {
    console.error("Error loading data:", error);
  });



