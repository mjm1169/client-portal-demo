export async function render(container, config) {
  console.log("🎬 Rendering process gauge")
   // Get data directly
   const data = config.data;

   console.log("Using data:", data);
 


  const value = data.value;


  const outer = document.createElement("div");

  outer.style.width = "200px";
  outer.style.height = "200px";
  outer.style.borderRadius = "50%";
  outer.style.border = "12px solid #ddd";
  outer.style.position = "relative";


  const inner = document.createElement("div");

  inner.style.width = "100%";
  inner.style.height = "100%";
  inner.style.borderRadius = "50%";
  inner.style.border = "12px solid #59a14f";
  inner.style.clipPath = `inset(${100 - value}% 0 0 0)`;


  const text = document.createElement("div");

  text.innerText = value + "%";

  text.style.position = "absolute";
  text.style.top = "50%";
  text.style.left = "50%";
  text.style.transform = "translate(-50%,-50%)";
  text.style.fontSize = "24px";


  outer.appendChild(inner);
  outer.appendChild(text);

  container.appendChild(outer);
}
