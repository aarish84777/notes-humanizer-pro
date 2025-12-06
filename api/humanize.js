import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { preset, text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No input text provided" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Rewrite the following text in the style: ${preset}.
    Text: ${text}`;

    const completion = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userText },
  ],
  temperature: 0.7,
});


    const output = completion.choices[0].message.content.trim();

    return res.status(200).json({ output });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server crashed" });
  }
}
