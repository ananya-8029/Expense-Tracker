import { useSelector } from "react-redux";
import "../Income_Page/IncomePage.css";

const IncomePage = () => {
  const allIncomes = useSelector((state) => state.incomeReducer.incomes[0]);
  return (
    <>
      <div className="h-screen w-full">
        <div className="h-[60%] w-full  flex pt-[5vmax] pl-[5vmax]">
          {allIncomes &&
            allIncomes.map((income) => (
              <>
                <div
                  className="income-content bg-white flex flex-col justify-between items-start m-[1vmax] w-[15vmax] h-[15vmax] rounded-xl px-[1vmax] py-[2vmax] gap-5"
                  key={income._id}
                >
                  <div className="flex flex-col gap-5">
                    <div className="text-[1.5vmax] font-medium">
                      {income.title}
                    </div>
                    <div className="text-[1vmax] font-light">
                      {income.description}
                    </div>
                  </div>
                  <button className="bg-[#F7F6F6] w-[7vmax] h-[2vmax] rounded-lg font-extralight text-[0.8vmax] transition-all hover:transition-all hover:scale-[0.9]">Know More</button>
                </div>
              </>
            ))}
        </div>
        <div className=" h-[40%] w-full"></div>
      </div>
    </>
  );
};

export default IncomePage;
