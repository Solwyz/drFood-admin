import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@assets/Login/logo.png";
import LoginBg from "@assets/Login/drfoodloginpage.png";
import eyes from "@assets/Login/visibility.svg";
import eyesOff from "@assets/Login/visibility_off.svg";
import Api from "../Services/Api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    const savedRemember = localStorage.getItem("rememberMe");

    if (savedRemember === "true") {
      setEmail(savedEmail || "");
      setPassword(savedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      const response = await Api.post("auth/admin", {
        username: email,
        password: password,
      });

      if (response && response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);

      
        if (rememberMe) {
          localStorage.setItem("rememberEmail", email);
          localStorage.setItem("rememberPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberPassword");
          localStorage.removeItem("rememberMe");
        }

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
      {/* Left side with image */}
      <div className="w-1/2 relative">
        <img
          src={LoginBg}
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 py-12 pr-12 pl-20">
        <div className="justify-end flex items-end">
          <img src={Logo} alt="Logo" className="w-[88px] h-[86px]" />
        </div>

        <div className="w-full mt-[66px] max-w-sm">
          <h2 className="text-[32px] leading-10 font-semibold text-[#000000] mb-2 text-center">
            Log in
          </h2>
          <p className="text-[#888888] leading-6 text-sm font-normal text-center">
            Access your account. Anytime, anywhere.
          </p>

          <form onSubmit={handleLogin} className="mt-12">
            <div>
              <h1 className="mb-1 text-sm font-medium">Email</h1>
              <input
                type="text"
                placeholder="User name / email"
                className={`w-full p-3 border rounded-lg font-normal text-sm leading-6 placeholder:text-[#AFAFAF] focus:outline-none ${
                  error ? "border-[#D40000]" : "border-[#C3C3C3]"
                }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
              />
            </div>

            <div className="relative mt-[56px]">
              <h1 className="mb-1 text-sm font-medium">Password</h1>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className={`w-full p-3 pr-10 border rounded-lg font-normal text-sm leading-6 placeholder:text-[#AFAFAF] focus:outline-none ${
                  error ? "border-[#D40000]" : "border-[#C3C3C3]"
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
                className="absolute right-3 top-[41px] cursor-pointer w-5 h-5"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="flex items-end mt-[36px] justify-start">
              <label className="text-sm flex text-[#2B62ED] font-normal leading-6 items-center">
                <input
                  type="checkbox"
                  className="mr-2 w-3 h-3"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#BF6A02] mt-4 text-white py-3 rounded-lg hover:bg-[#965B13] duration-300 transition"
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
