import { Ollama } from "ollama";

async function main() {
  const ollama = new Ollama();
  
  // Define a system prompt
  const systemPrompt = `
You are an AI tutor reviewing code written by a student.
Your job is to evaluate their solution in a friendly and helpful way.

Steps:
1. First, check if the student's code is relevant to the problem.
2. Then provide feedback only in the following sections:
- Logic
- Formatting
- Variable Naming

End with a motivational message (>50 words) to encourage the student.

DO NOT include revised code or any code snippets in your response.
`;

  // Define a student prompt
  const studentPrompt = ``;

  // Chat with a system prompt
  const response = await ollama.chat({
    model: "app2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: studentPrompt }
    ]
  });
  
  console.log(response.message.content);
}

main().catch(console.error);