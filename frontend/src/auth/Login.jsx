import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const { showSuccess, showError } = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Redux action updates state AND sets localStorage in authSlice
      dispatch(
        login({
          user: data.user,
          token: data.token,
        })
      );

      showSuccess("Welcome back, " + (data.user?.name || "User") + "!");
      navigate("/dashboard");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to login";
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-text-primary">
          Welcome Back
        </h1>

        <p className="text-center text-text-secondary mt-2 mb-6">
          Login to your account
        </p>

        {/* Error notification if any */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-danger-light text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email
            </label>

            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-4
                py-3
                border
                border-border
                rounded-lg
                bg-surface
                text-text-primary
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2
                focus:ring-border-focus
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password
            </label>

            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  px-4
                  py-3
                  pr-12
                  border
                  border-border
                  rounded-lg
                  bg-surface
                  text-text-primary
                  placeholder:text-text-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-border-focus
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary">
              <input type="checkbox" />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="
                text-primary
                font-semibold
                hover:text-primary-hover
                hover:underline
              "
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-primary
              hover:bg-primary-hover
              disabled:opacity-60
              text-text-inverse
              font-semibold
              py-3
              rounded-lg
              transition
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
              text-primary
              font-semibold
              hover:text-primary-hover
              hover:underline
            "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
