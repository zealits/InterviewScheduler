const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const morgan = require("morgan");
app.use(morgan('dev'));  // 'dev' format gives concise colored output
dotenv.config({ path: "config/config.env" }); 

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
