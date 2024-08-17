import { addTransaction } from "./Icons";

const AddTansactionButton = () => {
  return (
    <>
      <button className="group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-[6rem] hover:rounded-lg active:translate-x-1 active:translate-y-1">
        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
          {addTransaction}
        </div>
        <div className="absolute text-[1.1vmax] right-4 transform translate-x-full opacity-0 text-black transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 font-poppins">
          add
        </div>
      </button>
    </>
  );
};

export default AddTansactionButton;
