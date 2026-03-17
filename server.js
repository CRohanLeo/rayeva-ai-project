import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});


// 🔥 STEP 7 API
app.post("/generate-tags", async (req, res) => {
  try {
    const { product_name, description } = req.body;

    const prompt = `
    Classify product and return JSON:
    product: ${product_name}
    description: ${description}

    Return:
    {
      category: "",
      sub_category: "",
      tags: [],
      sustainability_filters: []
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.send(response.choices[0].message.content);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});


// 🔥 STEP 8 API
app.post("/generate-proposal", async (req, res) => {
  try {
    const { budget, business_type } = req.body;

    const prompt = `
You are an AI system.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text

Generate a sustainable B2B proposal.

Budget: ${budget}
Business Type: ${business_type}

Return format:
{
  "products": [
    {
      "name": "",
      "quantity": 0,
      "cost": 0
    }
  ],
  "budget_used": 0,
  "impact_summary": "",
  "cost_breakdown": {}
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.send(response.choices[0].message.content);

  } catch (err) {
    res.status(500).send("Error");
  }
});


// 🚀 START SERVER (VERY IMPORTANT - ADD THIS IF NOT ADDED)
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});