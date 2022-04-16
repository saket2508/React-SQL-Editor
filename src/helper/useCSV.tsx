import { useState, useEffect } from "react";
import parseCSV from "./index";

export default function useCSV(filePath: string = "./products.csv") {
  const [parsedData, setParsedData] = useState<TableData>({
      rows: [],
      cols:[],
      length: 0
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(filePath);
      const csvBlob = await res.text();
      const { rows, cols, length } = parseCSV(csvBlob);
      setParsedData({
        rows: rows,
        cols: cols,
        length: length
      });
    })();
  }, []);

  return parsedData;
}
