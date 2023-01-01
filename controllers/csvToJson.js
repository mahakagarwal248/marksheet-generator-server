import excel from "exceljs";
import studentResultSchema from "../models/studentResult.js";
import { now } from "mongoose";
import studentResult from "../models/studentResult.js";
const csvToJson = async (req, res) => {
  const filePath = req.file.path;
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  let jsonData = [];

  try {
    let semester;
    let course;
    let branch;
    let maximumMarks = {};

    workbook.worksheets.forEach(function (sheet) {
      // read first row as data keys
      let firstRow = sheet.getRow(5);
      if (!firstRow.cellCount) return;
      let keys = firstRow.values;
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber == 2) {
          let value = row.values;
          course = value[1].split(" ")[2] + value[1].split(" ")[3];
          semester = value[1].split(" ")[6] + " " + value[1].split(" ")[8];
        }
        if (rowNumber == 4) {
          let value = row.values;
          branch = value[1].split(":")[1];
        }
        if (rowNumber == 7) {
          let values = row.values;
          for (let i = 0; i < keys.length; i++) {
            if (
              keys[i] === "S.N." ||
              !keys[i] ||
              keys[i] === "Roll No." ||
              keys[i] === "Student Name " ||
              keys[i] === "Father's Name" ||
              keys[i] === "Grand Total" ||
              keys[i] === "Percentage              Marks "
            ) {
              maximumMarks[keys[i]] = values[i];
            } else {
              maximumMarks[keys[i]] = {
                maxTheory: values[i++],
                maxSessional: values[i++],
                maxTotal: values[i],
              };
            }
          }
        }
        if (rowNumber <= 8) return;

        let values = row.values;
        let obj = {};
        for (let i = 0; i < keys.length; i++) {
          if (
            keys[i] === "S.N." ||
            !keys[i] ||
            keys[i] === "Roll No." ||
            keys[i] === "Student Name " ||
            keys[i] === "Father's Name" ||
            keys[i] === "Grand Total" ||
            keys[i] === "Percentage              Marks "
          ) {
            obj[keys[i]] = values[i];
          } else {
            obj[keys[i]] = {
              maxTheory: maximumMarks[keys[i]].maxTheory,
              maxSessional: maximumMarks[keys[i]].maxSessional,
              maxTotal: maximumMarks[keys[i]].maxTotal,
              theory: values[i++],
              sessional: values[i++],
              total: values[i],
            };
          }
          // obj[keys[i]] = values[i];
        }
        jsonData.push(obj);
      });
    });
    for (var obj of jsonData) {
      const {
        ["S.N."]: sNo,
        ["Roll No."]: rollNo,
        ["Father's Name"]: fatherName,
        ["Student Name "]: studentName,
        ["Percentage              Marks "]: percentage,
        ["Grand Total"]: grandTotal,
        ...data
      } = obj;

      let name;
      if (typeof studentName === typeof {}) {
        const { richText } = studentName;
        name = Object.values(richText)[0].text;
      }

      let dataObj = {
        SNo: sNo,
        rollNo: rollNo,
        name: name || studentName,
        fatherName: fatherName,
        Data: [{ ...data }],
        semester: semester,
        branch: branch,
        course: course,
        percentage: percentage?.result,
        grandTotal: grandTotal?.result,
      };
      const saveData = await studentResult.create(dataObj);
      saveData.save();
    }
    return res.status(200).json({ message: "Records saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

const getResult = async (req, res) => {
  const { semester, rollNo } = req.body;
  console.log(req.body)
  try {
    const foundResult = await studentResultSchema.findOne({
      $and: [{ rollNo }, { semester }],
    });
    if (!foundResult) {
      return res.status(404).json({ message: "No result found!" });
    }
    return res.status(200).json(foundResult);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export default {csvToJson, getResult};
