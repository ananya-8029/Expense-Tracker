const IncomeSchema = require("../models/IncomeSchema");

exports.addincome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const income = IncomeSchema({
    user: req.user.id,
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
    return res.status(200).json({ message: "Income added Successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Income failed to add." });
  }
};

exports.getincomes = async (req, res) => {
  try {
    const incomes = await IncomeSchema.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(incomes);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteincome = async (req, res) => {
  const { id } = req.params;
  IncomeSchema.findByIdAndDelete(id)
    .then((income) => {
      return res.status(200).json({ message: "Deletion Successfull" });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Server Error" });
    });
};
