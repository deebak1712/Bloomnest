with open('src/pages/AiAssistantPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the greeting text
old_greeting = 'Unlike ordinary chatbots, I coordinate specialized clinical agents:\\n• 👶 **Journey Agent** (Fetal milestones)\\n• 🥗 **Wellness Agent** (ICMR maternal diet & recipes)\\n• 🚨 **Safety Agent** (ACOG clinical guardrails & red flags)\\n• 📋 **Care Planner Agent** (Daily routines)\\n• 🩺 **Doctor Brief Agent** (SBAR handover summaries)'
new_greeting = 'Unlike ordinary chatbots, I am the **Bloom Orchestrator**, coordinating 3 specialized Postpartum Agents:\\n\\n• 🤱 **Mother & Recovery Agent** (Vitals, bleeding, sleep)\\n• 👶 **Baby Care Agent** (Diaper vision, feeding, sleep)\\n• 🚨 **Safety & Care Coordination Agent** (Clinical triage)'

content = content.replace(old_greeting, new_greeting)

# Fix the sub-header
old_sub = 'Multi-agent consensus architecture coordinating <strong>Journey, Wellness, Safety, Care Planner & Doctor Brief Agents</strong>'
new_sub = 'Multi-agent consensus architecture coordinating <strong>Mother & Recovery, Baby Care, and Safety Agents</strong>'
content = content.replace(old_sub, new_sub)

# Fix the simulated loading steps
content = content.replace('"🧠 Agent Orchestrator: Parsing intent & patient context graph...",', '"🧠 Orchestrator: Parsing intent to Mother, Baby & Safety Agents...",')
content = content.replace('"🚨 Safety Agent: Evaluating ACOG preeclampsia & vital thresholds...",', '"🚨 Safety Agent: Evaluating postpartum emergency protocols...",')
content = content.replace('"🥗 Wellness Agent: Cross-referencing ICMR maternal guidelines...",', '"🤱 Mother Agent: Cross-referencing recovery data...",')
content = content.replace('"👶 Journey Agent: Calculating fetal neuro-development...",', '"👶 Baby Agent: Analyzing newborn logs...",')

# Let's fix the preset prompts at the bottom to be postpartum relevant!
p1_old = 'What are the red flags for preeclampsia?'
p1_new = 'Enaku thala vali iruku, and baby romba azhura.'
content = content.replace(p1_old, p1_new)

p2_old = 'Suggest a vegetarian diet for Week 24'
p2_new = 'Diaper rash iruku, epdi sari pandradhu?'
content = content.replace(p2_old, p2_new)

p3_old = 'Is it safe to sleep on my back now?'
p3_new = 'C-section pain 7/10 iruku, breathing exercise venum'
content = content.replace(p3_old, p3_new)

with open('src/pages/AiAssistantPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated AiAssistantPage with Postpartum Agents')
