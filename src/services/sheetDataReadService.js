const XLSX = require('xlsx');
const path = require('path');

module.exports = class SheetDataRead {
  constructor(sheetPath) {
    this.sheetPath = sheetPath;
  }

  readData() {
    const filePath = path.join(__dirname, '..', 'data', this.sheetPath);
    const workbook = XLSX.readFile(filePath);
    const sheetNameList = workbook.SheetNames;

    if (sheetNameList.length === 0) {
      throw new Error('No sheets found in the Excel file.');
    }

    const sheet = workbook.Sheets[sheetNameList[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
  }
};
