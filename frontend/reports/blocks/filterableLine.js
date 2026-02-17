import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export async function render(container, config) {
  console.log("🎬 Rendering filterable line chart");
   // Get data directly
   const data = config.data;

   console.log("Using data:", data);
 

  const width = 500;
  const height = 300;
  const margin = 40;


  const select = d3.select(container)
    .append("select");


  const series = [...new Set(data.map(d => d.group))];

  series.forEach(s => {
    select.append("option")
      .text(s)
      .attr("value", s);
  });


  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x))
    .range([margin, width - margin]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height - margin, margin]);


  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));


  function update(group) {

    const filtered = data.filter(d => d.group === group);

    svg.selectAll("*").remove();


    svg.append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(y));


    svg.append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "#e15759")
      .attr("stroke-width", 2)
      .attr("d", line);
  }


  update(series[0]);

  select.on("change", e => update(e.target.value));
}
