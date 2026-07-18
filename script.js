const KNOWN_TOOLS = [
  "claude code", "claude", "cursor", "aider", "copilot", "windsurf",
  "codeium", "gpt-4", "gpt-5", "o1", "o3", "gemini", "langgraph",
  "langchain", "pydanticai", "fastapi", "docker", "git", "github",
  "npm", "pip", "pytest", "jest"
];

const DECISION_MARKERS = [
  "decided to", "decision:", "chose", "went with", "opted for",
  "switched to", "instead of", "because", "the reason", "trade-off",
  "tradeoff", "rather than"
];

function extractToolsAndCommands(text) {
  const found = new Set();

  // code blocks -> likely commands
  const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
  codeBlocks.forEach((block) => {
    const firstLine = block.replace(/```/g, "").trim().split("\n")[0];
    if (firstLine && firstLine.length < 80) found.add(firstLine.trim());
  });

  // inline commands like `npm install x`
  const inlineCode = text.match(/`([^`]+)`/g) || [];
  inlineCode.forEach((c) => {
    const clean = c.replace(/`/g, "").trim();
    if (clean.length > 2 && clean.length < 60) found.add(clean);
  });

  // known tool names mentioned anywhere
  const lower = text.toLowerCase();
  KNOWN_TOOLS.forEach((tool) => {
    if (lower.includes(tool)) found.add(tool);
  });

  return Array.from(found).slice(0, 12);
}

function extractDecisions(text) {
  const sentences = text
    .replace(/```[\s\S]*?```/g, " ")
    .split(/(?<=[.!?])\s+/);

  const decisions = sentences.filter((s) => {
    const lower = s.toLowerCase();
    return DECISION_MARKERS.some((marker) => lower.includes(marker));
  });

  return decisions.slice(0, 8).map((s) => s.trim());
}

function buildTLDR(text) {
  const clean = text.replace(/```[\s\S]*?```/g, " ").replace(/\s+/g, " ").trim();
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);

  if (sentences.length === 0) return "No readable content found.";

  const first = sentences[0];
  const last = sentences[sentences.length - 1];
  const wordCount = clean.split(/\s+/).length;

  if (sentences.length === 1) return first;

  return `${first} ... ${last} (${wordCount} words, ${sentences.length} sentences total in the session)`;
}

function digest() {
  const text = document.getElementById("input").value.trim();
  const output = document.getElementById("output");

  if (!text) {
    alert("Paste a session transcript first.");
    return;
  }

  document.getElementById("tldr").textContent = buildTLDR(text);

  const decisionsList = document.getElementById("decisions");
  decisionsList.innerHTML = "";
  const decisions = extractDecisions(text);
  if (decisions.length === 0) {
    decisionsList.innerHTML = "<li>No explicit decision language detected.</li>";
  } else {
    decisions.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d;
      decisionsList.appendChild(li);
    });
  }

  const toolsList = document.getElementById("tools");
  toolsList.innerHTML = "";
  const tools = extractToolsAndCommands(text);
  if (tools.length === 0) {
    toolsList.innerHTML = "<li>No tools or commands detected.</li>";
  } else {
    tools.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      toolsList.appendChild(li);
    });
  }

  output.classList.remove("hidden");
}

document.getElementById("digestBtn").addEventListener("click", digest);
