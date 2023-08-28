import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/Happy-Thoughts-API";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hi!");
});

const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0

  },
  createdAt: {
    type: Date,
    default: new Date()
  },
});

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await HappyThoughts.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      response: thoughts,
      message: "Success"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error"
    });
  }
});


app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThoughts = await new HappyThoughts({ message }).save();
    res.status(201).json({
      success: true,
      response: newThoughts,
      message: "Success"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error"
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await HappyThoughts.findOneAndUpdate({ "_id": thoughtId }, { $inc: { "hearts": 1 } });
    res.status(201).json({
      success: true,
      response: updatedThought,
      message: "Success"
    });
  }
  catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error"
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
