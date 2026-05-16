import TransactionSchema from "../models/TransactionSchema.js";

const addnewtransaction = async (req, res) => {
  const fileName = req.file;
  console.log(fileName);
  try {
    // const { date, amount, paymentMethod, transactionDetails, category, type } =
    //   req.body;
    // const transaction = new TransactionSchema({
    //   user: req.user.id,
    //   date,
    //   amount,
    //   paymentMethod,
    //   transactionDetails,
    //   category,
    //   type,
    // });

    // if (!date || !amount || !transactionDetails || !category) {
    //   return res.status(400).json({ message: "All fields are required!" });
    // }

    // await transaction.save();

    return res
      .status(200)
      .json({ message: "Transaction Log added Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Transaction failed to add." });
  }
};

export { addnewtransaction };
