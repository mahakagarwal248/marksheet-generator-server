import excel from "exceljs";

const csvToJson = async (req, res) => {
  const filePath = req.file.path;
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  let jsonData = [];

  try {
    let semester;
    let course;
    let branch;
    let maximumMarks = {}

    workbook.worksheets.forEach(function (sheet) {
      // read first row as data keys
      let firstRow = sheet.getRow(5);
      if (!firstRow.cellCount) return;
      let keys = firstRow.values;
      sheet.eachRow((row, rowNumber) => {
        if(rowNumber == 2){
          let value = row.values
          course = value[1].split(' ')[2] + value[1].split(' ')[3]
          semester= value[1].split(' ')[6] + ' ' + value[1].split(' ')[8]
        }
        if(rowNumber == 4){
          let value = row.values;
          branch = value[1].split(':')[1]
        }
        if(rowNumber == 7){
          let value = row.values;
          for(let i = 0; i < keys.length; i++){
            maximumMarks[keys[i]+i] = value[i]
          }
          jsonData.push(maximumMarks)
        }
        if (rowNumber <= 8) return;

        let values = row.values;
        let obj = {};
        for (let i = 0; i < keys.length; i++) {
          obj[keys[i]+i] = values[i];
        }
        jsonData.push(obj);
      });
    });
    for(var obj of jsonData){
      obj.semester = semester;
      obj.branch = branch;
      obj.course = course;
      // console.log(obj);
    }
    return res.status(200).json(jsonData);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export default csvToJson;
