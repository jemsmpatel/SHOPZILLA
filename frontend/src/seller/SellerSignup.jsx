import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useSellerRegisterMutation,
  useUploadMediaMutation,
} from "../redux/api/seller";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

const SellerSignup = () => {
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
  const [register] = useSellerRegisterMutation();
  const navigate = useNavigate();
  const [uploadMedia] = useUploadMediaMutation();
  const [countries] = useState(Country.getAllCountries());
  const [isLoading, setIsLoading] = useState(false);
  const [homeStates, setHomeStates] = useState([]);
  const [homeCities, setHomeCities] = useState([]);
  const [shopStates, setShopStates] = useState([]);
  const [shopCities, setShopCities] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);

    try {
      let updatedData = { ...formData };

      // 🔥 Upload PAN Card
      if (formData.pan_card_copy) {
        const panForm = new FormData();
        panForm.append("image", formData.pan_card_copy);
        panForm.append("folder", "documents");

        const panRes = await uploadMedia(panForm).unwrap();
        updatedData.pan_card_copy = panRes.data.url;
      }

      // 🔥 Upload Aadhar
      if (formData.aadhar_card_copy) {
        const aadharForm = new FormData();
        aadharForm.append("image", formData.aadhar_card_copy);
        aadharForm.append("folder", "documents");

        const aadharRes = await uploadMedia(aadharForm).unwrap();
        updatedData.aadhar_card_copy = aadharRes.data.url;
      }

      // 🔥 Upload Bank Passbook
      if (formData.bank_passbook_copy) {
        const bankForm = new FormData();
        bankForm.append("image", formData.bank_passbook_copy);
        bankForm.append("folder", "documents");

        const bankRes = await uploadMedia(bankForm).unwrap();
        updatedData.bank_passbook_copy = bankRes.data.url;
      }

      // 🔥 Now Register Seller with Image URLs
      await register({
        fname: updatedData.fname,
        email: updatedData.email,
        aadhar: updatedData.aadhar,
        contact: updatedData.contact,
        password: updatedData.password,
        father_name: updatedData.father_name,
        gender: updatedData.gender,
        dob: updatedData.dob,
        religion: updatedData.religion,
        home_address: updatedData.home_address,
        home_country: updatedData.home_country,
        home_state: updatedData.home_state,
        home_city: updatedData.home_city,
        pan_no: updatedData.pan_no,
        shop_name: updatedData.shop_name,
        shop_address: updatedData.shop_address,
        shop_country: updatedData.shop_country,
        shop_state: updatedData.shop_state,
        shop_city: updatedData.shop_city,
        gst_no: updatedData.gst_no,
        bank_account_holder_name: updatedData.bank_account_holder_name,
        bank_name: updatedData.bank_name,
        bank_account_no: updatedData.bank_account_no,
        bank_IFSC_code: updatedData.bank_IFSC_code,
        pan_card_copy: updatedData.pan_card_copy,
        aadhar_card_copy: updatedData.aadhar_card_copy,
        bank_passbook_copy: updatedData.bank_passbook_copy,
      }).unwrap();

      toast.success("Seller successfully registered!");
      navigate("/seller/signin");
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err?.data?.error ||
        err?.data?.message ||
        "Registration failed. Please try again.";
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
          <h2 className="text-2xl font-bold">Seller Registration</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* PERSONAL DETAILS */}
          <SectionTitle title="Personal Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fname"
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              minLength={3}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Enter Your Email"
            />
            <Input
              label="Contact"
              name="contact"
              onChange={handleChange}
              placeholder="Enter Your Contact"
              pattern="[0-9]{10}"
              title="Enter 10 digit mobile number"
              maxLength={10}
            />
            <Input
              label="Aadhar Number"
              name="aadhar"
              onChange={handleChange}
              placeholder="Enter Your Aadhar Number"
              pattern="[0-9]{12}"
              title="Enter 12 digit Aadhar number"
              maxLength={12}
            />
            <Input
              label="PAN Number"
              name="pan_no"
              onChange={handleChange}
              placeholder="Enter Your PAN Number"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              title="Enter valid PAN Number"
            />
            <Input
              label="Father Name"
              name="father_name"
              onChange={handleChange}
              placeholder="Enter Your Father Name"
            />
            <Input
              label="Religion"
              name="religion"
              onChange={handleChange}
              placeholder="Enter Your Religion"
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              onChange={handleChange}
              placeholder="Select DOB"
            />

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
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
              onChange={handleChange}
              placeholder="Enter Your Address"
            />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="home_country"
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
              onChange={handleChange}
              placeholder="Enter Your Shop Name"
            />
            <Input
              label="Shop Address"
              name="shop_address"
              onChange={handleChange}
              placeholder="Enter Your Shop Address"
            />
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="shop_country"
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
              onChange={handleChange}
              placeholder="Enter Your GST Number"
            />
          </div>

          <SectionTitle title="Bank Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Account Holder Name"
              name="bank_account_holder_name"
              onChange={handleChange}
              placeholder="Enter Your Bank Account Holder Name"
            />
            <Input
              label="Bank Name"
              name="bank_name"
              onChange={handleChange}
              placeholder="Enter Your Bank Name"
            />
            <Input
              label="Account Number"
              name="bank_account_no"
              onChange={handleChange}
              placeholder="Enter Your Bank Account Number"
            />
            <Input
              label="IFSC Code"
              name="bank_IFSC_code"
              onChange={handleChange}
              placeholder="Enter IFSC Code"
              pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
              title="Enter valid IFSC code"
            />
          </div>

          <SectionTitle title="Documents Upload" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  required
                  placeholder="Enter Strong Password"
                  className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-xs cursor-pointer text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

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
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              placeholder="Enter Your Confirm Password"
            />
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
            {isLoading ? "Registering..." : "Register Seller"}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/seller/signin"
                className="text-orange-500 font-semibold hover:underline hover:text-orange-600 transition"
              >
                Sign In
              </Link>
            </p>
          </div>
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
  type = "text",
  onChange,
  placeholder,
  required = true,
  minLength,
  maxLength,
  pattern,
  title,
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      title={title}
      className="w-full mt-2 px-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
    />
  </div>
);

const FileInput = ({ label, name, onChange, required = true }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      name={name}
      onChange={onChange}
      required={required}
      className="w-full mt-2 text-sm"
    />
  </div>
);

export default SellerSignup;
