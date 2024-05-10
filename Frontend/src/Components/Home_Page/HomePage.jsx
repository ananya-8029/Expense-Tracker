import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
const HomePage = () => {
  return (
    <>
      <div className="bg-[#f7f6f6] min-h-screen h-screen w-full">
        <div className="flex justify-end">
          <NavBar />
        </div>
        <MenuBar />
      </div>
    </>
  );
};

export default HomePage;
