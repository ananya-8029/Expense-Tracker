import ExpenseModel from "../models/ExpenseSchema";

const addexpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const income = ExpenseModel({
    title,
    amount,
    category,
    description,
    date,
  });

  try {
    // validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (!amount === "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    await income.save();
    return res.status(200).json({ message: "Expense added Successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Expense failed to add." });
  }
};

const getexpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find().sort({ createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteexpense = async (req, res) => {
  const { id } = req.params;
  ExpenseModel.findByIdAndDelete(id)
    .then((expense) => {
      return res.status(200).json({ message: "Deletion Successfull" });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Server Error" });
    });
};

export { addexpense, getexpenses, deleteexpense };
