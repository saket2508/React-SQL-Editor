import React, { useEffect, useState } from "react";
import Editor from "./components/QueryInput";
import Records from "./components/Records";
import useCSV from "./helper/useCSV";

function App() {
  const data = useCSV();
  const [results, setResults] = useState<TableData | null>(null);

  useEffect(() => {
    setResults(data);
  }, [data]);

  return (
    <div className="container">
      <section className="editorContainer">
        <Editor />
        {results === null ? (
          <div className="mb-2">
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Fetching Data...</span>
            </div>
          </div>
        ) : (
          <Records results={results}/>
        )}
      </section>
    </div>
  );
}

export default App;
