import UserModel from "../models/UserSchema.js";
import IncomeModel from "../models/IncomeSchema.js";
import ExpenseModel from "../models/ExpenseSchema.js";
import TransactionModel from "../models/TransactionSchema.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "username email role picture createdAt").lean();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [incomeStats, expenseStats, transactionCount] = await Promise.all([
          IncomeModel.aggregate([
            { $match: { user: user._id } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
          ]),
          ExpenseModel.aggregate([
            { $match: { user: user._id } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
          ]),
          TransactionModel.countDocuments({ user: user._id }),
        ]);

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          memberSince: user.createdAt,
          totalIncome: incomeStats[0]?.total || 0,
          incomeCount: incomeStats[0]?.count || 0,
          totalExpense: expenseStats[0]?.total || 0,
          expenseCount: expenseStats[0]?.count || 0,
          transactionCount,
        };
      })
    );

    return res.status(200).json(usersWithStats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [monthlyIncome, monthlyExpense, topIncomeCategories, topExpenseCategories] =
      await Promise.all([
        IncomeModel.aggregate([
          { $match: { date: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        ExpenseModel.aggregate([
          { $match: { date: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        IncomeModel.aggregate([
          { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 6 },
        ]),
        ExpenseModel.aggregate([
          { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 6 },
        ]),
      ]);

    return res.status(200).json({
      monthlyIncome,
      monthlyExpense,
      topIncomeCategories,
      topExpenseCategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { getAllUsers, getAnalytics };
