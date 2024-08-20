import TransactionSchema from "../models/TransactionSchema";

exports.addnewtransaction = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const parsedDate = new Date(date);
  const income = IncomeSchema({
    user: req.user.id,
    title,
    amount,
    category,
    description,
    date: parsedDate,
  });

  try {
    // validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (typeof !amount === "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    await income.save();

    return res.status(200).json({ message: "Income added Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Income failed to add." });
  }
};
