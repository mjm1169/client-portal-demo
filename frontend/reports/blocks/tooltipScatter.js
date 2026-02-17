import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function render(container, config) {
  console.log("🎬 Rendering tooltip scatter plot");
   // Get data directly
   const data = config.data;

   console.log("Using data:", data);
 

  const width = 500;
  const height = 300;
  const margin = 40;


  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#333")
    .style("color", "white")
    .style("padding", "6px")
    .style("border-radius", "4px")
    .style("opacity", 0);


  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([margin, width - margin]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height - margin, margin]);


  svg.append("g")
    .attr("transform", `translate(0,${height - margin})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(y));


  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 6)
    .attr("fill", "#edc948")

    .on("mouseover", (e,d) => {

      tooltip
        .style("opacity", 1)
        .html(d.label);
    })

    .on("mousemove", e => {

      tooltip
        .style("left", e.pageX + 10 + "px")
        .style("top", e.pageY + 10 + "px");
    })

    .on("mouseout", () => {

      tooltip.style("opacity", 0);
    });
}
