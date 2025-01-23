import { loginUser2 } from "../../utils/api";

const LoginUser = () => {
  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await loginUser2(userData);
      alert("Login successful!");
      console.log(response);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
