import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const StudentModel = mongoose.model("Student", studentSchema);

export default StudentModel;
