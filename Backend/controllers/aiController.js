import { GoogleGenerativeAI } from "@google/generative-ai";
import IncomeModel from "../models/IncomeSchema.js";
import ExpenseModel from "../models/ExpenseSchema.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAI = async (req, res) => {
  const { prompt, history = [] } = req.body;
  if (!prompt) return res.status(400).json({ message: "Prompt is required." });

  try {
    const [incomes, expenses] = await Promise.all([
      IncomeModel.find({ user: req.user.id }).sort({ date: -1 }),
      ExpenseModel.find({ user: req.user.id }).sort({ date: -1 }),
    ]);

    const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
    const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
    const net = totalIncome - totalExpense;

    const fmt = (records) =>
      records
        .slice(0, 25)
        .map(
          (r) =>
            `• ${r.title}: ₹${r.amount} | Category: ${r.category} | Date: ${new Date(r.date).toLocaleDateString("en-IN")}`
        )
        .join("\n") || "None yet.";

    const systemInstruction = `You are BudgetBuddy AI, a friendly and concise personal finance assistant.

The user's financial data:
Total Income : ₹${totalIncome.toLocaleString("en-IN")}
Total Expenses: ₹${totalExpense.toLocaleString("en-IN")}
Net Balance  : ₹${net.toLocaleString("en-IN")} (${net >= 0 ? "Surplus" : "Deficit"})

Income records (latest first):
${fmt(incomes)}

Expense records (latest first):
${fmt(expenses)}

Rules:
- Always use ₹ for currency.
- Be concise — answer in 2–4 sentences unless the user asks for a breakdown.
- If data is missing, say so honestly.
- Be supportive and helpful.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction,
    });

    // Convert history from OpenAI format (role: "assistant") to Gemini format (role: "model")
    const geminiHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(prompt);

    return res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "AI request failed. Check your API key." });
  }
};

export { askAI };
