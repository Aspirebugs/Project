import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {type : String,required : true},
  description: {type : String,required : true},
  statement : {type : String},
  example : {type : [String]},
  difficulty: {type : String},
  tags: {type : [String]}
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);