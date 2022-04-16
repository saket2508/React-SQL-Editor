export default function parseCSV(
  csvBlob: string,
  delim = ","
): TableData {
  const lines = csvBlob.split("\n");
  const tableHead = lines[0].split(",");
  const tableBody = [];
  for (let i = 1; i < lines.length; i++) {
    const row: Record<string, any> = {};
    const line = lines[i];
    const values = line.split(",");
    for (let idx = 0; idx < values.length; idx++) {
      if (!isNaN(values[idx] as any)) {
        if (values[idx].includes(".")) {
          row[tableHead[idx]] = parseFloat(values[idx]);
        } else {
          row[tableHead[idx]] = parseInt(values[idx]);
        }
      } else {
        row[tableHead[idx]] = values[idx];
      }
    }
    tableBody.push(row);
  }
  return {
    cols: tableHead,
    rows: tableBody,
    length: lines.length - 1
  };
}
