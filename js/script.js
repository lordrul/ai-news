document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  const page = document.body.dataset.page;

  if (page === "portfolio") {
    initPortfolioDemo();
  }

  if (page === "prompt-architect") {
    initPromptArchitect();
  }
});

function initPortfolioDemo() {
  const form = document.getElementById("demo-form");
  const input = document.getElementById("demo-input");
  const output = document.getElementById("demo-text");
  const btn = document.getElementById("demo-btn");

  if (!form || !input || !output || !btn) {
    return;
  }

  const demoResponses = {
    onboard: [
      "→ Trigger: New customer signup detected",
      "→ Step 1: Pull customer data from CRM",
      "→ Step 2: Generate personalized welcome email via GPT",
      "→ Step 3: Schedule drip sequence (Day 1, 3, 7)",
      "→ Step 4: Monitor open rates → adjust tone if < 30%",
      "✓ System running. Estimated time saved: 4.2 hrs/week"
    ],
    support: [
      "→ Trigger: Incoming support ticket received",
      "→ Step 1: Classify intent (billing / technical / general)",
      "→ Step 2: Search knowledge base for relevant articles",
      "→ Step 3: Draft response with context-aware GPT prompt",
      "→ Step 4: Route to human agent if confidence < 80%",
      "✓ System running. Resolution rate: 87% automated"
    ],
    content: [
      "→ Trigger: Weekly content brief submitted",
      "→ Step 1: Extract key topics and target audience",
      "→ Step 2: Generate blog draft with brand voice prompt",
      "→ Step 3: Create 5 social media variations",
      "→ Step 4: Queue for review → auto-publish on approval",
      "✓ System running. Output: 6 assets from 1 brief"
    ],
    default: [
      "→ Analyzing task requirements...",
      "→ Step 1: Map input data sources and triggers",
      "→ Step 2: Design decision logic and prompt chain",
      "→ Step 3: Build automation with error handling",
      "→ Step 4: Deploy with monitoring and feedback loop",
      "✓ System blueprint ready. Estimated build: 2-3 days"
    ]
  };

  function getResponse(value) {
    const lower = value.toLowerCase();
    if (lower.includes("onboard") || lower.includes("email") || lower.includes("welcome")) return demoResponses.onboard;
    if (lower.includes("support") || lower.includes("ticket") || lower.includes("help")) return demoResponses.support;
    if (lower.includes("content") || lower.includes("blog") || lower.includes("social")) return demoResponses.content;
    return demoResponses.default;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      return;
    }

    btn.disabled = true;
    btn.style.opacity = "0.5";
    output.innerHTML = '<span style="color:#00d4aa;">Processing...</span><span class="typing-cursor"></span>';

    const lines = getResponse(value);
    let index = 0;

    function typeLine() {
      if (index < lines.length) {
        output.innerHTML = lines.slice(0, index + 1).map((line) => {
          const color = line.startsWith("✓") ? "#00d4aa" : "rgba(255,255,255,0.55)";
          return `<span style="color:${color};">${line}</span>`;
        }).join("<br>") + (index < lines.length - 1 ? '<span class="typing-cursor"></span>' : "");
        index += 1;
        setTimeout(typeLine, 400 + Math.random() * 250);
      } else {
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    }

    setTimeout(typeLine, 450);
  });
}

function initPromptArchitect() {
  const generateBtn = document.getElementById("generate-prompt");
  const copyBtn = document.getElementById("copy-prompt");
  const output = document.getElementById("output");
  const status = document.getElementById("status");

  if (!generateBtn || !copyBtn || !output || !status) {
    return;
  }

  generateBtn.addEventListener("click", () => {
    const goal = getValue("goal");
    const context = getValue("context");
    const constraints = getValue("constraints");
    const style = getValue("style");

    const result = `[ROLE]
Act as an expert AI assistant.

[INTENT]
${goal || "Not provided."}

[SCENARIO]
${context || "Not provided."}

[EXPECTATION]
${constraints || "Not provided."}

[OUTPUT FORMAT]
${style || "Not provided."}`;

    output.textContent = result;
    output.classList.remove("is-empty");
    status.textContent = "Prompt generated.";
  });

  copyBtn.addEventListener("click", async () => {
    const text = output.textContent.trim();
    if (!text || output.classList.contains("is-empty")) {
      status.textContent = "Generate a prompt first.";
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Prompt copied to clipboard.";
    } catch (_error) {
      status.textContent = "Clipboard copy failed on this browser.";
    }
  });
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}
