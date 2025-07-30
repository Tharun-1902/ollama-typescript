import express, { Request, Response } from "express";
import { Ollama } from "ollama";

const app = express();
app.use(express.json());

const SESSION_CACHE: Record<string, any[]> = {};

const systemPrompt = `
You are an AI interviewer conducting a one-on-one mock college interview.
Ask the candidate only ONE question at a time.
Wait for their answer before you ask the next one.

You must NEVER ask more than one question per turn.
After the user responds, analyze their answer and ask a **relevant next question** based on it.
`;

app.post("/interview", async (req: Request, res: Response) => {
  const { messages, stream = false } = req.body;
  console.log("Received request body:", req.body);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array." });
  }

  const session_id = "default"; // Can be dynamic if needed

  if (!SESSION_CACHE[session_id]) {
    SESSION_CACHE[session_id] = [{ role: "system", content: systemPrompt }];
  }

  messages.forEach(msg => {
    if (msg.role === "user") {
      SESSION_CACHE[session_id].push(msg);
    }
  });

  const ollama = new Ollama();

  try {
    const response = await ollama.chat({
      model: "mistral:latest",
      messages: SESSION_CACHE[session_id],
      stream: false
    });

    console.log("Ollama API response:", response);

    const aiReply = response.message?.content;
    SESSION_CACHE[session_id].push({ role: "assistant", content: aiReply });
    console.log("AI reply:", aiReply);

    console.log("Content of AI reply:", aiReply);
    res.json({ reply: aiReply });
  } catch (err: any) {
  console.error("Ollama API call failed:", err);  // 👈 This helps debug
  res.status(500).json({ error: err?.message || "Internal server error" });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("Session cache initialized:", SESSION_CACHE);