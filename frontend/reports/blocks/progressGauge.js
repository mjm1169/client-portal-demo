// blocks/progressGauge.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function progressGauge(container, value) {

  const width = 200;
  const height = 200;
  const radius = 80;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

  const arc = d3.arc()
    .innerRadius(60)
    .outerRadius(radius)
    .startAngle(0);

  const background = svg.append("path")
    .datum({ endAngle: 2 * Math.PI })
    .attr("fill", "#eee")
    .attr("d", arc);

  const foreground = svg.append("path")
    .datum({ endAngle: 0 })
    .attr("fill", "#16a34a")
    .attr("d", arc);

  foreground
    .transition()
    .duration(1200)
    .attrTween("d", d => {

      const i = d3.interpolate(
        0,
        value / 100 * 2 * Math.PI
      );

      return t => {
        d.endAngle = i(t);
        return arc(d);
      };
    });

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("font-size", "22px")
    .text(value + "%");
}
