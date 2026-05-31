const isMobile = window.matchMedia("(max-width: 980px)").matches;
const progress = document.querySelector(".scroll-progress span");

function updateProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress.style.setProperty("--scroll", `${value}%`);
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const cursorArrow = document.querySelector("#cursorArrow");
const cursorGlow = document.querySelector("#cursorGlow");

if (!isMobile && cursorArrow && cursorGlow) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorArrow.style.left = `${mouseX}px`;
    cursorArrow.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.16;
    glowY += (mouseY - glowY) * 0.16;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll("a, button, input, .glass-panel, .showcase-card").forEach((item) => {
    item.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    item.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

const avatarStage = document.querySelector("#avatarStage");
const avatarCard = document.querySelector("#avatarCard");

if (!isMobile && avatarStage && avatarCard) {
  avatarStage.addEventListener("mousemove", (event) => {
    const rect = avatarStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    avatarCard.style.transform = `translate3d(${x * 24}px, ${y * 18}px, 0) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  });

  avatarStage.addEventListener("mouseleave", () => {
    avatarCard.style.transform = "";
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((section) => revealObserver.observe(section));

const aboutAccordion = document.querySelector("#aboutAccordion");
if (aboutAccordion) {
  aboutAccordion.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const item = button.closest(".accordion-item");
    const wasOpen = item.classList.contains("open");
    aboutAccordion.querySelectorAll(".accordion-item").forEach((panel) => panel.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
}

document.querySelectorAll("[data-about-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.aboutOpen;
    aboutAccordion?.querySelectorAll(".accordion-item").forEach((panel) => {
      panel.classList.toggle("open", panel.dataset.panel === target);
    });
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const workflowDocs = [
  {
    title: "热点洞察 · GPT-5.5",
    context: "从平台趋势、对标账号和用户反馈中提取可转化的内容机会。",
    goal: "找到用户真正关心的问题，形成稳定选题来源。",
    work: "搜集小红书热点爆款话题，整理评论区高频问题，分析对标账号的标题、封面和内容结构，并用 GPT-5.5 归纳用户情绪和点击动机。",
    output: "热点库 / 用户需求库 / 关键词库 / 选题方向池",
  },
  {
    title: "内容策划 · Claude",
    context: "把热点变成符合账号定位、可批量生产的内容方案。",
    goal: "确定选题角度，完成标题、正文、分镜和系列化内容模板。",
    work: "根据对标账号确定选题，用 GPT-5.5 发散内容框架，用 Claude 优化表达和逻辑，再完成人工筛选，规避过度营销和引导性表达。",
    output: "选题池 / 标题库 / 内容模板 / 正文初稿 / Prompt Library",
  },
  {
    title: "生产与复盘 · Figma + Canva + Codex",
    context: "把策划内容转化为可发布素材，并沉淀为可复用的生产系统。",
    goal: "完成 IP 视觉、图文排版、批量生产、发布归档和数据复盘。",
    work: "用 Figma 设计 IP 形象与组件，用 Canva 完成图片生成和排版，用 Codex 固定制作流程、批量生产和保存，用 Excel 与 GPT-5.5 复盘互动数据。",
    output: "IP资产库 / Canva模板 / 发布图包 / 自动化归档 / 数据复盘表 / 下一轮优化方向",
  },
];

const workflowDocument = document.querySelector("#workflowDocument");
const workflowSources = document.querySelectorAll(".workflow-source");

function renderWorkflow(index) {
  const item = workflowDocs[index];
  workflowDocument.innerHTML = `
    <p class="kicker">Workflow Document</p>
    <h3>${item.title}</h3>
    <p class="doc-context">${item.context}</p>
    <div class="doc-row"><strong>Goal</strong><p>${item.goal}</p></div>
    <div class="doc-row"><strong>Work</strong><p>${item.work}</p></div>
    <div class="doc-row"><strong>Output</strong><p>${item.output}</p></div>
  `;
}

workflowSources.forEach((source, index) => {
  source.addEventListener("click", () => {
    workflowSources.forEach((item) => item.classList.remove("active"));
    source.classList.add("active");
    renderWorkflow(index);
  });
});

renderWorkflow(0);

document.querySelectorAll("[data-workflow-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.workflowOpen);
    workflowSources.forEach((item) => item.classList.remove("active"));
    workflowSources[index]?.classList.add("active");
    renderWorkflow(index);
    document.querySelector("#workflow")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const assistantMessages = document.querySelector("#assistantMessages");
const assistantInput = document.querySelector("#assistantInput");
const assistantSend = document.querySelector("#assistantSend");
const assistantWidget = document.querySelector("#assistantWidget");
const assistantHeader = document.querySelector("#assistantHeader");
const assistantNavOpen = document.querySelector("#assistantNavOpen");

const assistantKnowledge = [
  {
    keys: ["wanxiang", "万象", "有灵", "project"],
    answer: "Ethan participated in WanXiangYouLing's cold-start content operation and user growth, including Xiaohongshu account matrix setup, topic planning, AI-assisted content workflow design, visual production, feedback collection and data review.",
  },
  {
    keys: ["hyperknow", "learning", "education"],
    answer: "HyperKnow is a proactive learning agent. Ethan worked on education scenario content, user value communication and growth materials, focusing on study efficiency, exam anxiety and knowledge organization.",
  },
  {
    keys: ["ai background", "software", "minor", "人工智能", "辅修"],
    answer: "Ethan majors in Finance and minors in Software Engineering with an AI track, combining business understanding, data awareness and hands-on AI tool practice.",
  },
  {
    keys: ["why", "suitable", "strength", "优势", "product"],
    answer: "Ethan is suitable for AI product and product operation roles because he connects finance training, AI learning, real project operations, content growth and AI-native workflow building.",
  },
];

function addAssistantMessage(text, isUser = false) {
  const msg = document.createElement("div");
  msg.className = `assistant-msg${isUser ? " user" : ""}`;
  msg.textContent = text;
  assistantMessages.appendChild(msg);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function answerQuestion(question) {
  const clean = question.toLowerCase();
  const hit = assistantKnowledge.find((item) => item.keys.some((key) => clean.includes(key.toLowerCase())));
  return hit
    ? hit.answer
    : "Ethan is an AI Product Builder focused on AI Agent, AI Education, AI Workflow and User Growth, with hands-on experience in WanXiangYouLing and HyperKnow.";
}

function sendQuestion(question) {
  const clean = question.trim();
  if (!clean) return;
  addAssistantMessage(clean, true);
  assistantInput.value = "";
  setTimeout(() => addAssistantMessage(answerQuestion(clean)), 220);
}

assistantSend.addEventListener("click", () => sendQuestion(assistantInput.value));
assistantInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendQuestion(assistantInput.value);
});

document.querySelectorAll(".assistant-quick button").forEach((button) => {
  button.addEventListener("click", () => sendQuestion(button.dataset.question));
});

assistantHeader?.addEventListener("click", () => {
  assistantWidget?.classList.toggle("open");
});

assistantNavOpen?.addEventListener("click", () => {
  assistantWidget?.classList.add("open");
  assistantInput?.focus();
});
