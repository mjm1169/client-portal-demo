// blocks/animatedBar.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function animatedBar(container, data, options = {}) {

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", y(0))
    .attr("height", 0)
    .attr("fill", "#4f46e5")
    .transition()
    .duration(1000)
    .ease(d3.easeCubicOut)
    .attr("y", d => y(d.value))
    .attr("height", d => y(0) - y(d.value));
}
