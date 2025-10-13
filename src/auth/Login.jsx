import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/Login/logo.svg";
import LoginBg from "@assets/Login/loginBg.png";
import eyes from "@assets/Login/visibility.svg";
import eyesOff from "@assets/Login/visibility_off.svg";
import Api from "../services/Api";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('login click')

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const response = await Api.post("api/admin/login", {
        username: email,
        password: password,
      });

      console.log("Login response:", response);
      if (response && response.status === 200) {
        const token = response.data.jwt;
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side with image and text */}
      <div className="w-1/2 relative">
        <img src={LoginBg} alt="Login Background" className="w-full  h-full  " />
        <div className="absolute bottom-20 left-20 ">

          <h1 className="text-[40px] leading-[48px] text-[#EDEDED] font-bold">Manage,<br />Monitor, Master.</h1>

        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2  py-12 pr-12 pl-20">
        <div className="justify-end flex items-end"><img src={Logo} alt="Logo" className=" w-[115px] h-[54px]" /></div>

        <div className="w-full mt-[66px] max-w-sm">
          <h2 className="text-[40px] leading-10 font-bold text-[#304BA0] mb-2">Log in</h2>
          <p className="text-[#555555] leading-6 text-sm font-normal ">Access your account. Anytime, anywhere.</p>

          <form onSubmit={handleLogin} className=" mt-12">
            <div>
              <input
                type="text"
                placeholder="User name / email"
                className={`w-full p-3 border-b font-normal text-sm leading-6 placeholder:text-[#AFAFAF] focus:outline-none ${
                  error ? "border-[#D40000]" : "border-[#9C9C9C]"
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
              />
            </div>

            <div className="relative mt-[56px]">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 pr-10 border-b font-normal text-sm leading-6 placeholder:text-[#AFAFAF] focus:outline-none ${
                  error ? "border-[#D40000]" : "border-[#9C9C9C]"
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              <img
                src={showPassword ? eyesOff : eyes}
                alt="Toggle visibility"
                className="absolute right-3 top-3 cursor-pointer w-5 h-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="flex items-end  mt-4 justify-end">
              <label className="text-sm flex text-[#101010] font-normal leading-6 items-center">
                <input type="checkbox" className="mr-2 w-3 h-3 " /> Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-black mt-10 text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Login
            </button>

            {error && (
              <p className="text-[#D40000] font-normal text-xs mt-2">
                Incorrect password and username, Please try again
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
