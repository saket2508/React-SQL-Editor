type Props = {
  results: TableData;
};

export default function Records({ results }: Props) {
  return (
    <div className="col-12 col-sm-10">
      <p className="h6 text-light fw-bold mb-2">
        Selected Records (Showing {results.length} of {results.length})
      </p>
      <div className="table-responsive mt-4">
        <table className="table table-sm table-bordered text-light">
          <thead>
            <tr>
              {results.cols.map((colName: string, idx: number) => (
                <th scope="col" key={idx}>
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.rows.map((rowData, i) => {
              let rowVals = Object.values(rowData);
              return (
                <tr key={i}>
                  {rowVals.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
