import { useSelector } from "react-redux";

const IncomePage = () => {
  const allIncomes = useSelector((state) => state.incomeReducer.incomes[0]);
  console.log(allIncomes);
  allIncomes.map((income) => {
    console.log(income);
  });
  return (
    <>
      <div className="h-screen w-full"></div>
    </>
  );
};

export default IncomePage;
