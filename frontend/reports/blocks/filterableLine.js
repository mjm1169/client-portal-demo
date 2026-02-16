// blocks/filterableLine.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function filterableLine(container, data) {

  const width = 500;
  const height = 300;

  const categories = [...new Set(data.map(d => d.group))];

  const select = d3.select(container)
    .append("select");

  select.selectAll("option")
    .data(categories)
    .enter()
    .append("option")
    .text(d => d);

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear().range([40, width - 20]);
  const y = d3.scaleLinear().range([height - 40, 20]);

  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  function render(group) {

    const filtered = data.filter(d => d.group === group);

    x.domain(d3.extent(filtered, d => d.x));
    y.domain([0, d3.max(filtered, d => d.y)]);

    svg.selectAll("*").remove();

    svg.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 3)
      .attr("d", line);
  }

  render(categories[0]);

  select.on("change", e => {
    render(e.target.value);
  });
}
