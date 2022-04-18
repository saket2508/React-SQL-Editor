import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Table from "./components/Table";
import useCSV from "./helper/useCSV";

function App() {
  const data = useCSV();
  const [results, setResults] = useState<TableData | null>(null);
  const [records, setRecords] = useState<TableData | null>(null);
  const [queryStatus, setQueryStatus] = useState<{status?: boolean; timeTaken?: number}>({})

  useEffect(() => {
    setResults(data);
    setRecords(data);
  }, [data]);

  const modifyTableData = (newRecords: TableData) => {
    setRecords(newRecords);
  };

  const restoreTable = () => {
    const data: TableData = {
      ...results!
    };
    setRecords(data);
  }

  return (
    <div className="container">
      <section className="editorContainer">
        {results === null || records === null ? (
          <>
            <Editor/>
            <div className="mb-2">
              <div className="spinner-grow text-light" role="status">
                <span className="visually-hidden">Fetching Data...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <Editor
              colNames={results.cols}
              initialRows={results.rows}
              modifyTableData={modifyTableData}
              setQueryStatus={setQueryStatus}
            />
            <Table data={records} totalRecords={results.length} queryStatus={queryStatus}/>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
