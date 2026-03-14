import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetSellerByRetryTokenQuery,
  useSellerRegisterMutation,
  useUpdateRejectedSellerMutation,
  useUploadMediaMutation,
} from "../redux/api/seller";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

const RejectedSellerUpdate = () => {
  const [formData, setFormData] = useState({
    // Personal
    fname: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadhar: "",
    contact: "",
    father_name: "",
    gender: "",
    dob: "",
    religion: "",

    home_address: "",
    home_country: "",
    home_state: "",
    home_city: "",

    pan_no: "",

    // Shop
    shop_name: "",
    shop_address: "",
    shop_country: "",
    shop_state: "",
    shop_city: "",
    gst_no: "",

    // Bank
    bank_account_holder_name: "",
    bank_name: "",
    bank_account_no: "",
    bank_IFSC_code: "",

    // Documents
    pan_card_copy: null,
    aadhar_card_copy: null,
    bank_passbook_copy: null,
  });
  const { token } = useParams();
  const [updateSeller] = useUpdateRejectedSellerMutation();
  const navigate = useNavigate();
  const [uploadMedia] = useUploadMediaMutation();
  const [countries] = useState(Country.getAllCountries());
  const [isLoading, setIsLoading] = useState(false);
  const [homeStates, setHomeStates] = useState([]);
  const [homeCities, setHomeCities] = useState([]);
  const [shopStates, setShopStates] = useState([]);
  const [shopCities, setShopCities] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading: isLoadingData } =
    useGetSellerByRetryTokenQuery(token);

  useEffect(() => {
    if (data?.seller) {
      const seller = data.seller;
      setOriginalData(seller);
      setFormData((prev) => ({
        ...prev,
        fname: seller.fname || "",
        email: seller.email || "",
        contact: seller.contact || "",
        aadhar: seller.aadhar || "",
        pan_no: seller.pan_no || "",
        father_name: seller.father_name || "",
        gender: seller.gender || "",
        dob: seller.dob || "",
        religion: seller.religion || "",

        home_address: seller.home_address || "",
        home_country: seller.home_country || "",
        home_state: seller.home_state || "",
        home_city: seller.home_city || "",

        shop_name: seller.shop_name || "",
        shop_address: seller.shop_address || "",
        shop_country: seller.shop_country || "",
        shop_state: seller.shop_state || "",
        shop_city: seller.shop_city || "",
        gst_no: seller.gst_no || "",

        bank_name: seller.bank_name || "",
        bank_account_holder_name: seller.bank_account_holder_name || "",
        bank_account_no: seller.bank_account_no || "",
        bank_IFSC_code: seller.bank_IFSC_code || "",

        pan_card_copy: seller.pan_card_copy || null,
        aadhar_card_copy: seller.aadhar_card_copy || null,
        bank_passbook_copy: seller.bank_passbook_copy || null,
      }));

      // 🔥 HOME STATES LOAD
      if (seller.home_country) {
        const country = countries.find((c) => c.name === seller.home_country);
        if (country) {
          const states = State.getStatesOfCountry(country.isoCode);
          setHomeStates(states);

          const state = states.find((s) => s.name === seller.home_state);
          if (state) {
            const cities = City.getCitiesOfState(
              country.isoCode,
              state.isoCode,
            );
            setHomeCities(cities);
          }
        }
      }

      // 🔥 SHOP STATES LOAD
      if (seller.shop_country) {
        const country = countries.find((c) => c.name === seller.shop_country);
        if (country) {
          const states = State.getStatesOfCountry(country.isoCode);
          setShopStates(states);

          const state = states.find((s) => s.name === seller.shop_state);
          if (state) {
            const cities = City.getCitiesOfState(
              country.isoCode,
              state.isoCode,
            );
            setShopCities(cities);
          }
        }
      }
    }
  }, [data, countries]);

  if (isLoadingData) {
    return <div className="text-center mt-20">Loading seller data...</div>;
  }

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordRegex.test(password);
  };

  // HOME COUNTRY
  const handleHomeCountryChange = (e) => {
    const countryName = e.target.value;

    const selectedCountry = countries.find(
      (country) => country.name === countryName,
    );

    setFormData((prev) => ({
      ...prev,
      home_country: countryName,
      home_state: "",
      home_city: "",
    }));

    if (selectedCountry) {
      setHomeStates(State.getStatesOfCountry(selectedCountry.isoCode));
    }

    setHomeCities([]);
  };

  // HOME STATE
  const handleHomeStateChange = (e) => {
    const stateName = e.target.value;

    const selectedState = homeStates.find((state) => state.name === stateName);

    setFormData((prev) => ({
      ...prev,
      home_state: stateName,
      home_city: "",
    }));

    if (selectedState) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.home_country,
      );

      if (selectedCountry) {
        setHomeCities(
          City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode),
        );
      }
    }
  };

  // SHOP COUNTRY
  const handleShopCountryChange = (e) => {
    const countryName = e.target.value;

    const selectedCountry = countries.find(
      (country) => country.name === countryName,
    );

    setFormData((prev) => ({
      ...prev,
      shop_country: countryName,
      shop_state: "",
      shop_city: "",
    }));

    if (selectedCountry) {
      setShopStates(State.getStatesOfCountry(selectedCountry.isoCode));
    }

    setShopCities([]);
  };

  // SHOP STATE
  const handleShopStateChange = (e) => {
    const stateName = e.target.value;

    const selectedState = shopStates.find((state) => state.name === stateName);

    setFormData((prev) => ({
      ...prev,
      shop_state: stateName,
      shop_city: "",
    }));

    if (selectedState) {
      const selectedCountry = countries.find(
        (country) => country.name === formData.shop_country,
      );

      if (selectedCountry) {
        setShopCities(
          City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode),
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "password") {
      if (value.length < 6) {
        setPasswordStrength("Weak");
      } else if (validatePassword(value)) {
        setPasswordStrength("Strong");
      } else {
        setPasswordStrength("Medium");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must contain 8 characters, uppercase, lowercase, number and special character.",
      );
      return;
    }

    setIsLoading(true);

    try {
      let changedData = {};

      // 🔥 Detect changed fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key]) {
          changedData[key] = formData[key];
        }
      });

      // 🔥 Upload PAN Card only if new file selected
      if (formData.pan_card_copy instanceof File) {
        const panForm = new FormData();
        panForm.append("image", formData.pan_card_copy);
        panForm.append("folder", "documents");

        const panRes = await uploadMedia(panForm).unwrap();
        changedData.pan_card_copy = panRes.data.url;
      }

      // 🔥 Upload Aadhar only if new file selected
      if (formData.aadhar_card_copy instanceof File) {
        const aadharForm = new FormData();
        aadharForm.append("image", formData.aadhar_card_copy);
        aadharForm.append("folder", "documents");

        const aadharRes = await uploadMedia(aadharForm).unwrap();
        changedData.aadhar_card_copy = aadharRes.data.url;
      }

      // 🔥 Upload Bank Passbook only if new file selected
      if (formData.bank_passbook_copy instanceof File) {
        const bankForm = new FormData();
        bankForm.append("image", formData.bank_passbook_copy);
        bankForm.append("folder", "documents");

        const bankRes = await uploadMedia(bankForm).unwrap();
        changedData.bank_passbook_copy = bankRes.data.url;
      }

      // 🔥 Send only changed data
      await updateSeller({
        token,
        data: changedData,
      }).unwrap();

      toast.success("Seller successfully updated!");
      navigate("/seller/signin");
    } catch (err) {
      console.error("Update error:", err);

      const message =
        err?.data?.error ||
        err?.data?.message ||
        "Update failed. Please try again.";

      toast.error(message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl w-[92%] mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-2xl font-bold">Update & Resubmit</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PERSONAL DETAILS */}
          <SectionTitle title="Personal Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              minLength={3}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
            />
            <Input
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter Your Contact"
              pattern="[0-9]{10}"
              title="Enter 10 digit mobile number"
              maxLength={10}
            />
            <Input
              label="Aadhar Number"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              placeholder="Enter Your Aadhar Number"
              pattern="[0-9]{12}"
              title="Enter 12 digit Aadhar number"
              maxLength={12}
            />
            <Input
              label="PAN Number"
              name="pan_no"
              value={formData.pan_no}
              onChange={handleChange}
              placeholder="Enter Your PAN Number"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              title="Enter valid PAN Number"
            />
            <Input
              label="Father Name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Enter Your Father Name"
            />
            <Input
              label="Religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              placeholder="Enter Your Religion"
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Select DOB"
            />

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm appearance-none cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <SectionTitle title="Home Address" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Address"
              name="home_address"
              value={formData.home_address} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Address"
            />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="home_country"
                value={formData.home_country} // ✅ value add
                onChange={handleHomeCountryChange}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="home_state"
                value={formData.home_state} // ✅ value add
                onChange={handleHomeStateChange}
                disabled={!formData.home_country}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl disabled:bg-gray-200"
              >
                <option value="">Select State</option>
                {homeStates.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="home_city"
                value={formData.home_city} // ✅ value add
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    home_city: e.target.value,
                  }))
                }
                disabled={!formData.home_state}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl disabled:bg-gray-200"
              >
                <option value="">Select City</option>
                {homeCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SectionTitle title="Shop Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Shop Name"
              name="shop_name"
              value={formData.shop_name} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Shop Name"
            />
            <Input
              label="Shop Address"
              name="shop_address"
              value={formData.shop_address} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Shop Address"
            />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="shop_country"
                value={formData.shop_country} // ✅ value add
                onChange={handleShopCountryChange}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="shop_state"
                value={formData.shop_state} // ✅ value add
                onChange={handleShopStateChange}
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
              >
                <option value="">Select State</option>
                {shopStates.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="shop_city"
                value={formData.shop_city} // ✅ value add
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shop_city: e.target.value,
                  }))
                }
                required
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
              >
                <option value="">Select City</option>
                {shopCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="GST Number"
              name="gst_no"
              value={formData.gst_no} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your GST Number"
            />
          </div>

          <SectionTitle title="Bank Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Account Holder Name"
              name="bank_account_holder_name"
              value={formData.bank_account_holder_name} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Bank Account Holder Name"
            />
            <Input
              label="Bank Name"
              name="bank_name"
              value={formData.bank_name} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Bank Name"
            />
            <Input
              label="Account Number"
              name="bank_account_no"
              value={formData.bank_account_no} // ✅ value add
              onChange={handleChange}
              placeholder="Enter Your Bank Account Number"
            />
            <Input
              label="IFSC Code"
              name="bank_IFSC_code"
              value={formData.bank_IFSC_code} // ✅ value add
              onChange={handleChange}
              placeholder="Enter IFSC Code"
              pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
              title="Enter valid IFSC code"
            />
          </div>

          <SectionTitle title="Documents Upload" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Display existing image if available */}
            {formData.pan_card_copy && (
              <div className="mt-2 text-center">
                <img
                  src={formData.pan_card_copy}
                  alt="PAN Card"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <a
                  href={formData.pan_card_copy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 text-sm mt-1 inline-block hover:underline"
                >
                  View Fullscreen
                </a>
              </div>
            )}
            {formData.aadhar_card_copy && (
              <div className="mt-2 text-center">
                <img
                  src={formData.aadhar_card_copy}
                  alt="Aadhar Card"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <a
                  href={formData.aadhar_card_copy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 text-sm mt-1 inline-block hover:underline"
                >
                  View Fullscreen
                </a>
              </div>
            )}
            {formData.bank_passbook_copy && (
              <div className="mt-2 text-center">
                <img
                  src={formData.bank_passbook_copy}
                  alt="Bank Passbook"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <a
                  href={formData.bank_passbook_copy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 text-sm mt-1 inline-block hover:underline"
                >
                  View Fullscreen
                </a>
              </div>
            )}
            <FileInput
              label="PAN Card Copy"
              name="pan_card_copy"
              onChange={handleChange}
            />
            <FileInput
              label="Aadhar Copy"
              name="aadhar_card_copy"
              onChange={handleChange}
            />
            <FileInput
              label="Bank Passbook Copy"
              name="bank_passbook_copy"
              onChange={handleChange}
            />
          </div>

          <SectionTitle title="Security" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Password <span className="text-red-500">*</span>
              </label>

              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                placeholder="Enter Strong Password"
                className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />

              {passwordStrength && (
                <p
                  className={`text-sm mt-1 font-semibold ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
            {isLoading ? "Updating..." : "Update & Resubmit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <h3 className="text-lg font-bold text-gray-700 border-b pb-2">{title}</h3>
);

const Input = ({
  label,
  name,
  value,
  type = "text",
  onChange,
  placeholder,
  required = true,
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl"
    />
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">{label}</label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      className="w-full mt-2 text-sm"
    />
  </div>
);

export default RejectedSellerUpdate;
