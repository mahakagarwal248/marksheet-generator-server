import mongoose from "mongoose";

const studentResultSchema = mongoose.Schema({
  SNo: String,
  rollNo:String,

  name: String,
  fatherName: String,
  percentage: String,
  semester: String,
  branch: String,
  course: String,
  Data: [
    {
    //   subjectName: String,
    //   internalMarks: Number,
    //   sessionalMarks: Number,
    //   maxInternalMarks: Number,
    //   maxSessionalMarks: Number,
    },
  ],
  grandTotal:Number
});

export default mongoose.model("studentResult", studentResultSchema);
