// let deadlockDetected = false;
//   let edges = [];

//   function generateGraph(pCount, rCount) {
//     const graph = document.getElementById("graph");
//     graph.innerHTML = "";
//     edges = [];

//     const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svg.setAttribute("width", "100%");
//     svg.setAttribute("height", "100%");
//     graph.appendChild(svg);

//     const width = graph.clientWidth;
//     const height = graph.clientHeight;

//     const processNodes = [];
//     const resourceNodes = [];

//     for (let i = 0; i < pCount; i++) {
//       const node = document.createElement("div");
//       node.classList.add("node", "process");
//       node.textContent = "P" + (i + 1);
//       const x = 100 + (i * 120);
//       const y = 100 + Math.random() * 100;
//       node.style.left = x + "px";
//       node.style.top = y + "px";
//       graph.appendChild(node);
//       processNodes.push({ x, y, name: node.textContent });
//     }

//     for (let i = 0; i < rCount; i++) {
//       const node = document.createElement("div");
//       node.classList.add("node", "resource");
//       node.textContent = "R" + (i + 1);
//       const x = 150 + (i * 120);
//       const y = 250 + Math.random() * 80;
//       node.style.left = x + "px";
//       node.style.top = y + "px";
//       graph.appendChild(node);
//       resourceNodes.push({ x, y, name: node.textContent });
//     }

//     // Random connections between process and resource
//     processNodes.forEach(p => {
//       const r = resourceNodes[Math.floor(Math.random() * resourceNodes.length)];
//       drawLine(svg, p.x + 20, p.y + 20, r.x + 20, r.y + 20);
//       edges.push(`${p.name} -> ${r.name}`);
//     });

//     resourceNodes.forEach(r => {
//       const p = processNodes[Math.floor(Math.random() * processNodes.length)];
//       drawLine(svg, r.x + 20, r.y + 20, p.x + 20, p.y + 20);
//       edges.push(`${r.name} -> ${p.name}`);
//     });
//   }

//   function drawLine(svg, x1, y1, x2, y2) {
//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", x1);
//     line.setAttribute("y1", y1);
//     line.setAttribute("x2", x2);
//     line.setAttribute("y2", y2);
//     svg.appendChild(line);
//   }

//   function detectDeadlock() {
//     const p = parseInt(document.getElementById("numProcesses").value);
//     const r = parseInt(document.getElementById("numResources").value);

//     if (!p || !r || p <= 0 || r <= 0) {
//       document.getElementById("output").textContent = "⚠️ Please enter valid numbers.";
//       return;
//     }

//     generateGraph(p, r);

//     const result = Math.random() > 0.5;
//     const output = document.getElementById("output");

//     if (result) {
//       deadlockDetected = true;
//       output.textContent = `Initial Resource Allocation Graph created.\n` +
//         `Processes: ${p}, Resources: ${r}\n` +
//         `🔴 Deadlock detected!\nGraph edges:\n` + edges.join("\n");
//     } else {
//       deadlockDetected = false;
//       output.textContent = `Initial Resource Allocation Graph created.\n` +
//         `Processes: ${p}, Resources: ${r}\n` +
//         `✅ No deadlock detected.\nGraph edges:\n` + edges.join("\n");
//     }
//   }

//   function resolveDeadlock() {
//     const output = document.getElementById("output");

//     if (!deadlockDetected) {
//       output.textContent += `\n\nNo deadlock to resolve. All processes are running smoothly.`;
//       return;
//     }

//     const victim = "P" + (Math.floor(Math.random() * 5) + 1);
//     output.textContent += `\n\n⚙️ Resolving deadlock...\nVictim chosen for termination: ${victim}\n✅ Deadlock resolved.`;

//     const lines = document.querySelectorAll("line");
//     lines.forEach(line => line.setAttribute("stroke", "#22c55e"));
//     deadlockDetected = false;
//   }

//   function resetGraph() {
//     document.getElementById("numProcesses").value = "";
//     document.getElementById("numResources").value = "";
//     document.getElementById("graph").innerHTML = "";
//     document.getElementById("output").textContent = "Output will appear here...";
//     deadlockDetected = false;
//     edges = [];
//   }



let deadlockDetected = false;
let edges = [];
let graphAdj = {};   // adjacency list
let priorities = {}; // process priorities

function generateGraph(pCount, rCount) {
  const graph = document.getElementById("graph");
  graph.innerHTML = "";
  edges = [];
  graphAdj = {};
  priorities = {};

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  graph.appendChild(svg);

  const width = graph.clientWidth;
  const height = graph.clientHeight;

  const processNodes = [];
  const resourceNodes = [];

  // Assign random priorities to processes P1..Pn
  for (let i = 1; i <= pCount; i++) {
    priorities["P" + i] = Math.floor(Math.random() * 10) + 1;
  }

  // Create Process Nodes
  for (let i = 0; i < pCount; i++) {
    const node = document.createElement("div");
    node.classList.add("node", "process");
    node.textContent = "P" + (i + 1);
    const x = 100 + (i * 120);
    const y = 100 + Math.random() * 100;
    node.style.left = x + "px";
    node.style.top = y + "px";
    graph.appendChild(node);
    processNodes.push({ x, y, name: node.textContent });
  }

  // Create Resource Nodes
  for (let i = 0; i < rCount; i++) {
    const node = document.createElement("div");
    node.classList.add("node", "resource");
    node.textContent = "R" + (i + 1);
    const x = 150 + (i * 120);
    const y = 250 + Math.random() * 80;
    node.style.left = x + "px";
    node.style.top = y + "px";
    graph.appendChild(node);
    resourceNodes.push({ x, y, name: node.textContent });
  }

  // Helper to build adjacency list
  function addEdge(u, v) {
    if (!graphAdj[u]) graphAdj[u] = [];
    graphAdj[u].push(v);
    edges.push(`${u} -> ${v}`);
  }

  // Request edges: P -> R
  processNodes.forEach(p => {
    const r = resourceNodes[Math.floor(Math.random() * resourceNodes.length)];
    drawLine(svg, p.x + 20, p.y + 20, r.x + 20, r.y + 20);
    addEdge(p.name, r.name);
  });

  // Allocation edges: R -> P
  resourceNodes.forEach(r => {
    const p = processNodes[Math.floor(Math.random() * processNodes.length)];
    drawLine(svg, r.x + 20, r.y + 20, p.x + 20, p.y + 20);
    addEdge(r.name, p.name);
  });
}

function drawLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  svg.appendChild(line);
}

// ---------- CYCLE DETECTION (DFS) ----------
function hasCycle() {
  const visited = {};
  const stack = {};

  function dfs(node) {
    if (!graphAdj[node]) return false;
    visited[node] = true;
    stack[node] = true;

    for (let nxt of graphAdj[node]) {
      if (!visited[nxt] && dfs(nxt)) return true;
      else if (stack[nxt]) return true;
    }

    stack[node] = false;
    return false;
  }

  for (let node in graphAdj) {
    if (!visited[node]) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

//deadlock backend

async function detectDeadlockFromBackend() {
  const output = document.getElementById("output");
  output.textContent = "Running simulation on server...";

  try {
    const response = await fetch("https://YOUR_RAILWAY_URL/simulate");
    const data = await response.json();

    edges = [];
    graphAdj = {};
    priorities = {};

    generateGraphFromJSON(data); // You will need to write this function

    if (hasCycle()) {
      deadlockDetected = true;
      output.textContent = "🔴 Deadlock detected!\nGraph edges:\n" + edges.join("\n");
    } else {
      deadlockDetected = false;
      output.textContent = "✅ No deadlock detected.\nGraph edges:\n" + edges.join("\n");
    }

  } catch (err) {
    output.textContent = "Error fetching simulation: " + err;
  }
}


// ---------- MAIN DEADLOCK DETECTION ----------
function detectDeadlock() {
  const p = parseInt(document.getElementById("numProcesses").value);
  const r = parseInt(document.getElementById("numResources").value);

  if (!p || !r || p <= 0 || r <= 0) {
    document.getElementById("output").textContent = "⚠️ Please enter valid numbers.";
    return;
  }

  generateGraph(p, r);

  const output = document.getElementById("output");

  if (hasCycle()) {
    deadlockDetected = true;

    output.textContent =
      `Initial Resource Allocation Graph created.\nProcesses: ${p}, Resources: ${r}\n` +
      `🔴 Deadlock detected! (Cycle found)\nGraph edges:\n` +
      edges.join("\n");

  } else {
    deadlockDetected = false;
    output.textContent =
      `Initial Resource Allocation Graph created.\nProcesses: ${p}, Resources: ${r}\n` +
      `✅ No deadlock detected.\nGraph edges:\n` +
      edges.join("\n");
  }
}

// ---------- RESOLVE WITH LOWEST PRIORITY ----------
function resolveDeadlock() {
  const output = document.getElementById("output");

  if (!deadlockDetected) {
    output.textContent += `\n\nNo deadlock to resolve. All processes are running smoothly.`;
    return;
  }

  // Find process with lowest priority (victim)
  let victim = null;
  let minPriority = Infinity;

  for (let p in priorities) {
    if (priorities[p] < minPriority) {
      minPriority = priorities[p];
      victim = p;
    }
  }

  output.textContent +=
    `\n\n⚙️ Resolving deadlock...\nLowest priority process selected: ${victim} (Priority = ${minPriority})\n` +
    `✅ Deadlock resolved by terminating ${victim}.`;

  const lines = document.querySelectorAll("line");
  lines.forEach(line => line.setAttribute("stroke", "#22c55e"));

  deadlockDetected = false;
}

// ---------- RESET ----------
function resetGraph() {
  document.getElementById("numProcesses").value = "";
  document.getElementById("numResources").value = "";
  document.getElementById("graph").innerHTML = "";
  document.getElementById("output").textContent = "Output will appear here...";
  deadlockDetected = false;
  edges = [];
  graphAdj = {};
  priorities = {};
}
