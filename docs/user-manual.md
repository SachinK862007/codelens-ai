# CodeLens AI — User Manual

## What is CodeLens AI?

CodeLens AI is an **AI-powered coding tutor** that helps you learn programming through visual execution tracing, intelligent debugging, project planning, and structured practice exercises. It supports Python, C, C++, and JavaScript.

---

## Getting Started

### Demo Account
Use the built-in demo account to explore immediately:
- **Username:** `demo`
- **Password:** `demo123`

### Create Your Account
1. Navigate to `http://localhost:3000`
2. Click **Register**
3. Fill in your email, username, and password
4. Click **Submit** to create your account
5. Log in with your new credentials

---

## Features

### 🧪 Try Me — Visual Code Execution

Execute code and **see it come alive** with step-by-step visualization.

**How to use:**
1. Click **Try Me** in the sidebar
2. Type or paste your Python code in the editor
3. Click **Run Code**
4. Watch the execution trace — see variables change in real-time
5. View the AI-generated explanation of each line
6. See the Mermaid flowchart of your code's logic

**What you get:**
- Console output
- Line-by-line execution trace with variable snapshots
- AI explanation of what each line does and why
- Visual flowchart of program structure

---

### 🐛 Debug — Error Analysis

Paste broken code and let AI find and fix the errors.

**How to use:**
1. Click **Debug** in the sidebar
2. Paste your code that has an error
3. Optionally paste the error message
4. Click **Analyze**
5. View the root cause analysis, corrected code, and explanation

**What you get:**
- Clear explanation of what went wrong
- Corrected code with highlighted changes
- Mermaid flowchart showing the fixed logic
- Suggestions for preventing similar errors

---

### 💡 Ideas — Project Planning

Describe a project idea and get a complete development roadmap.

**How to use:**
1. Click **Ideas** in the sidebar
2. Describe your project idea in detail
3. Set your skill level and preferred language
4. Click **Generate Plan**
5. Browse the step-by-step implementation plan

**What you get:**
- Implementation roadmap (7–10 steps)
- Algorithm pseudocode
- Recommended file structure
- Free learning resources with URLs
- Common pitfalls and how to avoid them
- Architecture diagram

---

### 🏋️ Practice — Structured Exercises

Follow a structured learning path with progressive coding challenges.

**How to use:**
1. Click **Practice** in the sidebar
2. Choose your language and difficulty level
3. Read the exercise description and hints
4. Write your solution in the editor
5. Click **Submit** for AI-powered feedback

**What you get:**
- Progressive difficulty exercises
- AI-generated feedback on your code
- Points and achievement tracking
- Progress percentage and streaks

---

### 🎤 Voice — Hands-Free Coding

Use voice commands to interact with CodeLens AI.

**Supported commands:**
| Voice Command     | Action                  |
|-------------------|-------------------------|
| "Run code"        | Execute current code    |
| "Explain"         | Get code explanation    |
| "Debug"           | Analyze errors          |
| "Next step"       | Go to next trace step   |
| "Previous step"   | Go back one trace step  |

---

## Dashboard

The dashboard provides an overview of your learning journey:
- **Completed exercises** and total points
- **Current streak** (consecutive days of practice)
- **Achievement badges** earned
- **Recent activity** log

---

## Tips for Best Results

1. **Start simple** — Begin with small code snippets in Try Me
2. **Read the explanations** — AI explanations use real-world analogies
3. **Practice daily** — Maintain your streak for bonus achievements
4. **Use Debug first** — Before asking classmates, try the Debug feature
5. **Plan before coding** — Use Ideas to break down complex projects

---

## Keyboard Shortcuts

| Shortcut           | Action                |
|--------------------|-----------------------|
| `Ctrl + Enter`     | Run code              |
| `Ctrl + S`         | Save current work     |
| `Ctrl + Z`         | Undo                  |
| `Ctrl + Shift + Z` | Redo                  |
| `Tab`              | Indent                |
| `Shift + Tab`      | Outdent               |

---

## Troubleshooting

| Issue                        | Solution                                           |
|------------------------------|-----------------------------------------------------|
| AI not responding            | Ensure Ollama is running: `ollama serve`            |
| Code execution timeout       | Reduce code complexity or check for infinite loops  |
| Login not working            | Clear browser cache and try again                   |
| Flowchart not rendering       | Refresh the page — Mermaid needs a re-render        |
| Voice commands not working   | Check microphone permissions in browser settings    |
