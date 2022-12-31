import excel from "exceljs";
const csvToJson = async (req, res) => {
  const filePath = req.file.path;
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  let jsonData = [];

  try {
    // const book = [];
    // workbook.eachSheet((sheet) => {
    //   const sheets = [];
    //   sheet.eachRow((row) => {
    //     sheets.push(row.values);
    //   });
    //   book.push(sheets);
    // });
    // return res.status(200).json({ headers: book[0][4], data: book[0] });

    workbook.worksheets.forEach(function (sheet) {
      // read first row as data keys
      let firstRow = sheet.getRow(5);
      if (!firstRow.cellCount) return;
      let keys = firstRow.values;
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber == 5) return;
        let values = row.values;
        let obj = {};
        for (let i = 1; i < keys.length; i++) {
          obj[keys[i]] = values[i];
        }
        jsonData.push(obj);
      });
    });
    return res.status(200).json(jsonData)
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export default csvToJson;
