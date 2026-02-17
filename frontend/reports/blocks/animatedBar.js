/*// blocks/animatedBar.js
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
*/

// blocks/animatedBar.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function render(container, config) {

  console.log("🎬 Rendering animated bar chart");

  // Load data
  const res = await fetch(config.data);
  const data = await res.json();


  const width = 600;
  const height = 400;
  const margin = 50;


  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin, width - margin])
    .padding(0.2);


  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - margin, margin]);


  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(y));


  // Bars (start at zero height)
  const bars = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth())
    .attr("y", height - margin)
    .attr("height", 0)
    .attr("fill", "#4f46e5");


  // Animate
  bars.transition()
    .duration(1000)
    .delay((d, i) => i * 150)
    .attr("y", d => y(d.value))
    .attr("height", d => height - margin - y(d.value));

}
