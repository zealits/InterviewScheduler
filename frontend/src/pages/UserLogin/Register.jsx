import { registerUsers } from "../../utils/api";

const RegisterUser = () => {
  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      linkedinProfile: e.target.linkedinProfile.value,
      yearOfExperience: parseInt(e.target.yearOfExperience.value, 10),
      experienceAsInterviewer: e.target.experienceAsInterviewer.checked,
      specialization: e.target.specialization.value,
      candidatesInterviewed: parseInt(e.target.candidatesInterviewed.value, 10),
    };

    try {
      const response = await registerUsers(userData);
      alert("Registration successful!");
      console.log(response);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Error during registration.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        <form onSubmit={handleRegister} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedinProfile"
              placeholder="Enter your LinkedIn profile URL"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Years of Experience</label>
            <input
              type="number"
              name="yearOfExperience"
              placeholder="Enter years of experience"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Experience as Interviewer</label>
            <input
              type="checkbox"
              name="experienceAsInterviewer"
              className="w-4 h-4 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Yes</span>
          </div>
          <div>
            <label className="block text-sm font-medium">Candidates Interviewed</label>
            <input
              type="number"
              name="candidatesInterviewed"
              placeholder="Number of candidates interviewed"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <select
              name="specialization"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select specialization</option>
              <option value="Cloud">Cloud</option>
              <option value="AI">AI</option>
              <option value="Language">Language</option>
              <option value="Domain">Domain</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
