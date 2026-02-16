// blocks/kpiTiles.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function kpiTiles(container, data) {

  const wrap = d3.select(container)
    .append("div")
    .style("display", "flex")
    .style("gap", "15px");

  wrap.selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .style("padding", "20px")
    .style("border", "2px solid #ccc")
    .style("border-radius", "6px")
    .style("cursor", "pointer")
    .text(d => `${d.name}: ${d.value}`)
    .on("click", function () {

      wrap.selectAll("div")
        .style("border-color", "#ccc");

      d3.select(this)
        .style("border-color", "#ef4444");
    });
}
