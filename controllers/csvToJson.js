import excel from 'exceljs'
const csvToJson = async (req, res) => {
  const filePath = req.file.path;
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  try {
    const book = [];
    workbook.eachSheet((sheet) => {
      const sheets = [];
      sheet.eachRow((row) => {
        sheets.push(row.values);
      });
      book.push(sheets);
    });
    return res.status(200).json({ headers: book[0][4], data: book[0][8] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

export default csvToJson;
