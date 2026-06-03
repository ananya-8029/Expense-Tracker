import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import MenuBar from "../Menu_Bar/MenuBar";
import useAuthGuard from "../../utils/useAuthGuard";
import { setUser } from "../../Redux/Reducers/UsersSlice";
import defaultAvatar from "../../utils/defaultAvatar";

const CameraIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ProfilePage = () => {
  useAuthGuard();
  const [btnClick, setBtnClick] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer?.user);

  // Photo upload
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Name edit
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  // Phone edit
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Address edit
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  const handleMenuClick = (icon) => {
    setBtnClick(icon);
    if (userData?.role === "admin") { navigate("/admin/dashboard"); return; }
    const routes = {
      homeIcon: "/home_page/home",
      dashBoardIcon: "/home_page/dashboard",
      transactionIcon: "/home_page/transactions",
      viewIncomeIcon: "/home_page/incomes",
      viewExpensesIcon: "/home_page/expenses",
    };
    if (routes[icon]) navigate(routes[icon]);
  };

  // Photo handlers
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
      const res = await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/update-photo`, formData, {
        headers: { "auth-token": authToken },
      });
      dispatch(setUser({ ...userData, picture: res.data.picture }));
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch {
      setUploadError("Failed to upload. Try again.");
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

  // Name handlers
  const startEditName = () => {
    setNameInput(userData?.username || "");
    setNameError("");
    setEditingName(true);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) { setNameError("Name cannot be empty."); return; }
    setSavingName(true);
    setNameError("");
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/update-name`,
        { username: nameInput.trim() },
        { headers: { "auth-token": authToken } }
      );
      dispatch(setUser({ ...userData, username: res.data.username }));
      setEditingName(false);
    } catch {
      setNameError("Failed to save. Try again.");
    } finally {
      setSavingName(false);
    }
  };

  // Phone handlers
  const startEditPhone = () => {
    setPhoneInput(userData?.phone || "");
    setPhoneError("");
    setEditingPhone(true);
  };

  const handleSavePhone = async () => {
    setSavingPhone(true);
    setPhoneError("");
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/update-profile`,
        { phone: phoneInput },
        { headers: { "auth-token": authToken } }
      );
      dispatch(setUser({ ...userData, phone: res.data.phone }));
      setEditingPhone(false);
    } catch {
      setPhoneError("Failed to save. Try again.");
    } finally {
      setSavingPhone(false);
    }
  };

  // Address handlers
  const startEditAddress = () => {
    setAddressForm({
      street:  userData?.address?.street || "",
      city:    userData?.address?.city || "",
      state:   userData?.address?.state || "",
      country: userData?.address?.country || "",
      pincode: userData?.address?.pincode || "",
    });
    setAddressError("");
    setEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    setAddressError("");
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/update-profile`,
        { address: addressForm },
        { headers: { "auth-token": authToken } }
      );
      dispatch(setUser({ ...userData, address: res.data.address }));
      setEditingAddress(false);
    } catch {
      setAddressError("Failed to save. Try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  const af = (key) => ({
    value: addressForm[key] || "",
    onChange: (e) => setAddressForm((prev) => ({ ...prev, [key]: e.target.value })),
    className: "bg-[#f7f6f6] rounded-lg px-[0.8vmax] py-[0.4vmax] text-[0.82vmax] text-[#372b63] outline-none focus:ring-2 focus:ring-[#c4b8f0] w-full",
  });

  const isAdmin = userData?.role === "admin";

  return (
    <div className="bg-[#f7f6f6] min-h-screen h-screen w-full overflow-hidden">
      {!isAdmin && (
        <div className="flex justify-end">
          <NavBar btnClick={btnClick} pageTitle="Profile" />
        </div>
      )}
      {!isAdmin && <MenuBar setBtnClick={handleMenuClick} btnClick={btnClick} />}

      <div className="h-screen w-full flex items-end justify-end">
        <div className={`${isAdmin ? "h-full w-full pt-4 md:pt-[1.5vmax]" : "h-[calc(100%-3rem)] md:h-[89%] w-full md:w-[95%] pb-16 md:pb-0"} overflow-y-auto px-4 md:px-[2vmax] pb-4 md:pb-[1.5vmax]`}>

          {userData?.role === "admin" && (
            <div className="mb-[1.2vmax]">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-1 text-[#624FA4] hover:text-[#372b63] text-[0.78vmax] transition-colors"
              >
                ← Back to Admin Dashboard
              </button>
            </div>
          )}

          {/* Profile card — purple banner */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-[1.2vmax]">
            <div className="bg-gradient-to-r from-[#624FA4] to-[#372b63] px-4 md:px-[2vmax] py-4 md:py-[1.8vmax] flex flex-wrap items-center justify-between gap-3 md:gap-[1.5vmax]">
              <div className="flex items-center gap-3 md:gap-[1.5vmax]">
                <div className="relative flex-shrink-0">
                  <img
                    src={photoPreview || userData?.picture || defaultAvatar}
                    alt={userData?.username}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 md:h-[5vmax] md:w-[5vmax] rounded-full object-cover border-[3px] border-white border-opacity-50 shadow-md"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 h-6 w-6 md:h-[1.6vmax] md:w-[1.6vmax] bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full flex items-center justify-center text-white shadow transition-all"
                  >
                    <CameraIcon />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                </div>
                <div>
                  <h2 className="text-white text-base md:text-[1.3vmax] font-bold leading-tight">{userData?.username || "User"}</h2>
                  <p className="text-white text-opacity-70 text-xs md:text-[0.8vmax] mt-0.5">{userData?.email}</p>
                </div>
              </div>
              {photoFile && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {uploadError && <span className="text-red-300 text-xs md:text-[0.72vmax]">{uploadError}</span>}
                  <button onClick={handleCancelPhoto} className="text-xs md:text-[0.75vmax] px-3 py-1 md:px-[1vmax] md:py-[0.45vmax] rounded-lg border border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10 transition-colors">Cancel</button>
                  <button onClick={handlePhotoUpload} disabled={uploading} className="text-xs md:text-[0.75vmax] px-3 py-1 md:px-[1vmax] md:py-[0.45vmax] rounded-lg bg-white text-[#624FA4] font-medium hover:bg-opacity-90 disabled:opacity-60 transition-colors">
                    {uploading ? "Saving..." : "Save Photo"}
                  </button>
                </div>
              )}
            </div>

            {/* Basic info */}
            <div className="px-4 md:px-[2vmax] py-2 md:py-[0.8vmax] divide-y divide-[#f7f6f6]">
              {/* Display Name */}
              <div className="flex items-center gap-3 md:gap-[1.5vmax] py-3 md:py-[0.85vmax]">
                <span className="text-[#929090] text-xs md:text-[0.78vmax] w-24 md:w-[8vmax] flex-shrink-0">Display Name</span>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    {nameError && <span className="text-red-400 text-[0.72vmax]">{nameError}</span>}
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                      className="bg-[#f7f6f6] rounded-lg px-[0.8vmax] py-[0.4vmax] text-[0.82vmax] text-[#372b63] outline-none focus:ring-2 focus:ring-[#c4b8f0] w-[14vmax]"
                    />
                    <button onClick={() => setEditingName(false)} className="text-[0.75vmax] px-[0.8vmax] py-[0.4vmax] rounded-lg border border-[#e0dde8] text-[#929090] hover:bg-[#f7f6f6] transition-colors">Cancel</button>
                    <button onClick={handleSaveName} disabled={savingName} className="text-[0.75vmax] px-[0.8vmax] py-[0.4vmax] rounded-lg bg-[#624FA4] text-white hover:bg-[#372b63] disabled:opacity-60 transition-colors">
                      {savingName ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[#454242] text-[0.82vmax] font-medium">{userData?.username || "—"}</span>
                    <button onClick={startEditName} className="text-[#929090] hover:text-[#624FA4] transition-colors"><EditIcon /></button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 md:gap-[1.5vmax] py-3 md:py-[0.85vmax]">
                <span className="text-[#929090] text-xs md:text-[0.78vmax] w-24 md:w-[8vmax] flex-shrink-0">Email</span>
                <span className="text-[#454242] text-sm md:text-[0.82vmax] font-medium break-all">{userData?.email || "—"}</span>
              </div>
            </div>
          </div>

          {/* Phone Number card */}
          <div className="bg-white rounded-2xl shadow-sm px-4 md:px-[2vmax] py-4 md:py-[1.2vmax] mb-3 md:mb-[1.2vmax]">
            <div className="flex items-center justify-between mb-2 md:mb-[0.8vmax]">
              <h3 className="text-[#372b63] text-sm md:text-[0.9vmax] font-semibold">Phone Number</h3>
              {!editingPhone && (
                <button onClick={startEditPhone} className="flex items-center gap-1.5 text-[0.75vmax] text-[#624FA4] hover:text-[#372b63] transition-colors">
                  <EditIcon /> Edit
                </button>
              )}
            </div>
            {editingPhone ? (
              <div className="flex items-center gap-2">
                {phoneError && <span className="text-red-400 text-[0.72vmax]">{phoneError}</span>}
                <input
                  autoFocus
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSavePhone(); if (e.key === "Escape") setEditingPhone(false); }}
                  placeholder="e.g. +91 98765 43210"
                  className="bg-[#f7f6f6] rounded-lg px-[0.8vmax] py-[0.4vmax] text-[0.82vmax] text-[#372b63] outline-none focus:ring-2 focus:ring-[#c4b8f0] w-[16vmax]"
                />
                <button onClick={() => setEditingPhone(false)} className="text-[0.75vmax] px-[0.8vmax] py-[0.4vmax] rounded-lg border border-[#e0dde8] text-[#929090] hover:bg-[#f7f6f6] transition-colors">Cancel</button>
                <button onClick={handleSavePhone} disabled={savingPhone} className="text-[0.75vmax] px-[0.8vmax] py-[0.4vmax] rounded-lg bg-[#624FA4] text-white hover:bg-[#372b63] disabled:opacity-60 transition-colors">
                  {savingPhone ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[1.5vmax]">
                <span className="text-[#929090] text-[0.78vmax] flex-shrink-0">Phone</span>
                <span className="text-[#454242] text-[0.82vmax] font-medium">
                  {userData?.phone || <span className="text-[#c0bdbd] italic text-[0.78vmax]">Not set</span>}
                </span>
              </div>
            )}
          </div>

          {/* Address card */}
          <div className="bg-white rounded-2xl shadow-sm px-4 md:px-[2vmax] py-4 md:py-[1.2vmax]">
            <div className="flex items-center justify-between mb-2 md:mb-[0.8vmax]">
              <h3 className="text-[#372b63] text-sm md:text-[0.9vmax] font-semibold">Address Details</h3>
              {!editingAddress && (
                <button onClick={startEditAddress} className="flex items-center gap-1.5 text-[0.75vmax] text-[#624FA4] hover:text-[#372b63] transition-colors">
                  <EditIcon /> Edit
                </button>
              )}
            </div>
            {editingAddress ? (
              <div className="flex flex-col gap-[0.8vmax]">
                {addressError && <p className="text-red-400 text-[0.72vmax]">{addressError}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-[0.8vmax]">
                  {[
                    { key: "street",  label: "Street / Area", placeholder: "e.g. 12 MG Road" },
                    { key: "city",    label: "City",           placeholder: "e.g. Mumbai" },
                    { key: "state",   label: "State",          placeholder: "e.g. Maharashtra" },
                    { key: "country", label: "Country",        placeholder: "e.g. India" },
                    { key: "pincode", label: "Pincode / ZIP",  placeholder: "e.g. 400001" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <p className="text-[#929090] text-[0.72vmax] mb-1">{label}</p>
                      <input placeholder={placeholder} {...af(key)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-[0.2vmax]">
                  <button onClick={() => setEditingAddress(false)} className="text-[0.75vmax] px-[1vmax] py-[0.45vmax] rounded-lg border border-[#e0dde8] text-[#929090] hover:bg-[#f7f6f6] transition-colors">Cancel</button>
                  <button onClick={handleSaveAddress} disabled={savingAddress} className="text-[0.75vmax] px-[1vmax] py-[0.45vmax] rounded-lg bg-[#624FA4] text-white hover:bg-[#372b63] disabled:opacity-60 transition-colors">
                    {savingAddress ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#f7f6f6]">
                {[
                  { label: "Street / Area", value: userData?.address?.street },
                  { label: "City",          value: userData?.address?.city },
                  { label: "State",         value: userData?.address?.state },
                  { label: "Country",       value: userData?.address?.country },
                  { label: "Pincode / ZIP", value: userData?.address?.pincode },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-[1.5vmax] py-[0.75vmax]">
                    <span className="text-[#929090] text-[0.78vmax] w-[8vmax] flex-shrink-0">{label}</span>
                    <span className="text-[#454242] text-[0.82vmax] font-medium">
                      {value || <span className="text-[#c0bdbd] italic text-[0.78vmax]">Not set</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
