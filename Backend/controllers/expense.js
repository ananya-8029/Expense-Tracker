import ExpenseModel from "../models/ExpenseSchema.js";

const addexpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    const expense = new ExpenseModel({
      user: req.user.id,
      title,
      amount,
      category,
      description,
      date: new Date(date),
    });

    await expense.save();
    return res.status(200).json({ message: "Expense added Successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Expense failed to add." });
  }
};

const getexpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteexpense = async (req, res) => {
  const { id } = req.params;
  try {
    await ExpenseModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deletion Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export { addexpense, getexpenses, deleteexpense };
