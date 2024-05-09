import "../NavBar/NavBar.css";
import { searchIcon } from "../../utils/Icons";
const NavBar = () => {
  return (
    <>
      <div className="h-[4vmax] w-full flex justify-center items-center">
        <div className="h-full w-[99%] bg-white mt-[1.5vmax] rounded-xl">
          <div className="h-[60%] flex items-center relative">
            <div
              className="absolute left-2"
            >
              {searchIcon}
            </div>
            <input
              className="search_bar h-full w-[22%] rounded-xl py-[1vmax]
              px-[2.5vmax] focus:outline-none focus:ring-1 focus:ring-[#ab9ce3] focus:border-transparent text-[0.9vmax] font-light"
              type="text"
              placeholder="Search for transactions, expenses etc."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
