import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  input: {type : String},
  output: {type : String},
});

testCaseSchema.index({ problemId: 1 });

export default mongoose.model("TestCase", testCaseSchema);