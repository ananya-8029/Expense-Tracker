import TransactionModel from "../models/TransactionSchema.js";

const addnewtransaction = async (req, res) => {
  const { date, amount, paymentMethod, transactionDetails, category, type } = req.body;

  try {
    if (!date || !amount || !transactionDetails || !category || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const transaction = new TransactionModel({
      user: req.user.id,
      date: new Date(date),
      amount: Number(amount),
      paymentMethod,
      transactionDetails,
      category,
      type: type || "Income",
      attachments: req.file ? req.file.path : null,
    });

    await transaction.save();
    return res.status(200).json({ message: "Transaction Log added Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Transaction failed to add." });
  }
};

const gettransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deletetransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await TransactionModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deletion Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export { addnewtransaction, gettransactions, deletetransaction };
