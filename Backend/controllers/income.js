import IncomeModel from "../models/IncomeSchema.js";

const addincome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number!" });
    }

    const income = new IncomeModel({
      user: req.user.id,
      title,
      amount,
      category,
      description,
      date: new Date(date),
    });

    await income.save();
    return res.status(200).json({ message: "Income added Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Income failed to add." });
  }
};

const getincomes = async (req, res) => {
  try {
    const incomes = await IncomeModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(incomes);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteincome = async (req, res) => {
  const { id } = req.params;
  try {
    await IncomeModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deletion Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export { addincome, getincomes, deleteincome };
