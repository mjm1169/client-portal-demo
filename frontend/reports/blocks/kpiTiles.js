export async function render(container, config) {

  const res = await fetch(config.data);
  const data = await res.json();


  const grid = document.createElement("div");

  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3,1fr)";
  grid.style.gap = "20px";


  data.forEach(kpi => {

    const tile = document.createElement("div");

    tile.style.padding = "20px";
    tile.style.border = "1px solid #ddd";
    tile.style.textAlign = "center";


    tile.innerHTML = `
      <h3>${kpi.label}</h3>
      <div style="font-size:28px">${kpi.value}</div>
      <div>${kpi.change}</div>
    `;

    grid.appendChild(tile);
  });


  container.appendChild(grid);
}
