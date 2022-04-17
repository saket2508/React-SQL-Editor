import { useEffect, useState } from "react";
import { parseSQLQuery, readResult } from "../helper";

type Props = {
  colNames?: string[];
  records?: TableData;
};

export default function Editor({ colNames, records }: Props) {
  const [error, setError] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const handleSubmit = () => {
    let { isValid, result } = parseSQLQuery(query, colNames || []);
    if (isValid && result !== null) {
      if (error) {
        setError(false);
      }
      if (records) {
        let newRecords = readResult(result, records);
        console.log(newRecords);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="col-10 col-sm-6 mb-4">
      <textarea
        placeholder="SELECT * FROM Products;"
        className={`editorInput ${error && "editorError"}`}
        rows={4}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {error && (
        <small className="errorText">Please enter a valid SQL query.</small>
      )}
      <div className="text-end mt-1">
        <button className="queryBtn" onClick={() => handleSubmit()}>
          <span className="icon">
            <svg
              height={"17"}
              width={"17"}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </span>
          RUN QUERY
        </button>
      </div>
    </div>
  );
}
