with open('src/pages/AiAssistantPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the greeting text
new_greeting = 'Unlike ordinary chatbots, I am the **Bloom Orchestrator**, coordinating 3 specialized Postpartum Agents:\\n\\n• 🤱 **Mother & Recovery Agent** (Vitals, bleeding, sleep)\\n• 👶 **Baby Care Agent** (Diaper vision, feeding, sleep)\\n• 🚨 **Safety & Care Coordination Agent** (Clinical triage)'
old_greeting = 'Hello, Dear Mama ${user.fullName}! 🌸 I am **BloomNest 2.0 Agentic Copilot**.\\n\\nYou are in **Week ${user.currentWeek} (Trimester ${user.trimester})**. Unlike ordinary chatbots, I coordinate specialized clinical agents:\\n• 👶 **Journey Agent** (Fetal milestones)\\n• 🥗 **Wellness Agent** (ICMR maternal diet & recipes)\\n• 🚨 **Safety Agent** (ACOG clinical guardrails & red flags)\\n• 📋 **Care Planner Agent** (Daily routines)\\n• 🩺 **Doctor Brief Agent** (SBAR handover summaries)\\n\\nAsk me anything in English or Tamil / Tanglish!'
content = content.replace(new_greeting, old_greeting)

# Fix the sub-header
new_sub = 'Multi-agent consensus architecture coordinating <strong>Mother & Recovery, Baby Care, and Safety Agents</strong>'
old_sub = 'Multi-agent consensus architecture coordinating <strong>Journey, Wellness, Safety, Care Planner & Doctor Brief Agents</strong>'
content = content.replace(new_sub, old_sub)

# Fix the simulated loading steps
content = content.replace('"🧠 Orchestrator: Parsing intent to Mother, Baby & Safety Agents...",', '"🧠 Agent Orchestrator: Parsing intent & patient context graph...",')
content = content.replace('"🚨 Safety Agent: Evaluating postpartum emergency protocols...",', '"🚨 Safety Agent: Evaluating ACOG preeclampsia & vital thresholds...",')
content = content.replace('"🤱 Mother Agent: Cross-referencing recovery data...",', '"🥗 Wellness Agent: Cross-referencing ICMR maternal guidelines...",')
content = content.replace('"👶 Baby Agent: Analyzing newborn logs...",', '"👶 Journey Agent: Calculating fetal neuro-development...",')

# Let's fix the preset prompts at the bottom
p1_new = 'Enaku thala vali iruku, and baby romba azhura.'
p1_old = 'What are the red flags for preeclampsia?'
content = content.replace(p1_new, p1_old)

p2_new = 'Diaper rash iruku, epdi sari pandradhu?'
p2_old = 'Suggest a vegetarian diet for Week 24'
content = content.replace(p2_new, p2_old)

p3_new = 'C-section pain 7/10 iruku, breathing exercise venum'
p3_old = 'Is it safe to sleep on my back now?'
content = content.replace(p3_new, p3_old)

# Revert Tabs
content = content.replace('<span>Mother Recovery Agent</span>', '<span>Care Planner Agent</span>')
content = content.replace('<span>Safety & Care Coordination AI</span>', '<span>Doctor Brief Agent (SBAR)</span>')
content = content.replace('<span>Baby Care AI Agent</span>', '<span>Vector RAG Architecture</span>')

with open('src/pages/AiAssistantPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Reverted AiAssistantPage')
