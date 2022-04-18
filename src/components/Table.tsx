type Props = {
  data: TableData;
  totalRecords: number;
  queryStatus: { status?: boolean; timeTaken?: number };
};

export default function Table({ data, totalRecords, queryStatus }: Props) {
  console.log(queryStatus);
  return (
    <div className="col-12 col-sm-10">
      {queryStatus.status !== undefined &&
        queryStatus.timeTaken !== undefined && (
          <p className="text-white fw-bold midsmall">
            {queryStatus.status === true
              ? `Done! (took ${queryStatus.timeTaken}ms 😅)`
              : `Error! (could not execute query 😔)`}
          </p>
        )}
      <p className="h6 text-light fw-bold">
        Selected Records (Showing {data.length} of {totalRecords})
      </p>
      <div className="table-responsive mt-4">
        <table className="table table-sm table-bordered text-light">
          <thead>
            <tr>
              {data.cols.map((colName: string, idx: number) => (
                <th scope="col" key={idx}>
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((rowData, i) => {
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
