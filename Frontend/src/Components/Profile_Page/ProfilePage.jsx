import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import useAuthGuard from "../../utils/useAuthGuard";
import { setUser } from "../../Redux/Reducers/UsersSlice";

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ProfilePage = () => {
  useAuthGuard();
  const [btnClick, setBtnClick] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer?.user);

  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleMenuClick = (icon) => {
    setBtnClick(icon);
    const routes = {
      homeIcon: "/home_page/home",
      dashBoardIcon: "/home_page/dashboard",
      transactionIcon: "/home_page/transactions",
      viewIncomeIcon: "/home_page/incomes",
      viewExpensesIcon: "/home_page/expenses",
    };
    if (routes[icon]) navigate(routes[icon]);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setUploadError("");
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("photo", photoFile);
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await axios.put("http://localhost:8000/api/auth/update-photo", formData, {
        headers: { "auth-token": authToken },
      });
      dispatch(setUser({ ...userData, picture: res.data.picture }));
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch {
      setUploadError("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const joinedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full overflow-hidden">
      <div className="flex justify-end">
        <NavBar btnClick={btnClick} />
      </div>
      <MenuBar setBtnClick={handleMenuClick} btnClick={btnClick} />

      <div className="h-screen w-full flex items-end justify-end">
        <div className="h-[89%] w-[95%] overflow-y-auto px-[2vmax] pt-[1.5vmax] pb-[1.5vmax]">

          {/* Header */}
          <div className="mb-[1.2vmax]">
            <h1 className="text-[1.6vmax] font-bold text-[#372b63]">My Profile</h1>
            <p className="text-[#929090] text-[0.78vmax]">Your account information</p>
          </div>

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-[1.2vmax]">
            <div className="h-[6vmax] bg-gradient-to-r from-[#624FA4] to-[#372b63]" />
            <div className="px-[2vmax] pb-[1.5vmax] flex items-end justify-between -mt-[2.5vmax]">
              <div className="flex items-end gap-[1.2vmax]">
                {/* Avatar with upload overlay */}
                <div className="relative flex-shrink-0">
                  <img
                    src={photoPreview || userData?.picture || "https://picsum.photos/id/1/200/300"}
                    alt={userData?.username}
                    referrerPolicy="no-referrer"
                    className="h-[5vmax] w-[5vmax] rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 h-[1.6vmax] w-[1.6vmax] bg-[#624FA4] hover:bg-[#372b63] rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                  >
                    <CameraIcon />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>

                <div className="pb-1">
                  <h2 className="text-[#372b63] text-[1.2vmax] font-bold leading-tight">{userData?.username || "User"}</h2>
                  <p className="text-[#929090] text-[0.78vmax]">{userData?.email}</p>
                  <span className={`mt-1 inline-block text-[0.62vmax] px-2 py-0.5 rounded-full font-medium ${
                    userData?.role === "admin" ? "bg-[#ede9fb] text-[#624FA4]" : "bg-blue-50 text-blue-600"
                  }`}>
                    {userData?.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>

              {/* Save/cancel photo buttons */}
              {photoFile && (
                <div className="flex items-center gap-2 pb-1">
                  {uploadError && <span className="text-red-400 text-[0.72vmax]">{uploadError}</span>}
                  <button
                    onClick={handleCancelPhoto}
                    className="text-[0.75vmax] px-[1vmax] py-[0.45vmax] rounded-lg border border-[#e0dde8] text-[#929090] hover:bg-[#f7f6f6] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="text-[0.75vmax] px-[1vmax] py-[0.45vmax] rounded-lg bg-[#624FA4] hover:bg-[#372b63] disabled:bg-[#c4b8f0] text-white transition-colors"
                  >
                    {uploading ? "Saving..." : "Save Photo"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-[1vmax] mb-[1.2vmax]">
            {[
              { label: "Account Type", value: userData?.role === "admin" ? "Administrator" : "User" },
              { label: "Member Since", value: joinedDate },
              { label: "Login Method", value: "Google OAuth" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm px-[1.5vmax] py-[1.1vmax]">
                <p className="text-[#929090] text-[0.72vmax] mb-0.5">{label}</p>
                <p className="text-[#372b63] text-[0.88vmax] font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Account details */}
          <div className="bg-white rounded-2xl shadow-sm px-[2vmax] py-[1.2vmax]">
            <h3 className="text-[#372b63] text-[0.9vmax] font-semibold mb-[0.8vmax]">Account Details</h3>
            <div className="divide-y divide-[#f7f6f6]">
              {[
                { label: "Full Name", value: userData?.username },
                { label: "Email Address", value: userData?.email },
                { label: "Google ID", value: userData?.googleId ? `${userData.googleId.slice(0, 8)}••••••` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-[0.75vmax]">
                  <span className="text-[#929090] text-[0.78vmax]">{label}</span>
                  <span className="text-[#454242] text-[0.82vmax] font-medium">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
