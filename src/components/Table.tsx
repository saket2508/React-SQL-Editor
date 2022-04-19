type Props = {
    data: TableData;
    totalRecords: number;
    queryStatus: { status?: boolean; timeTaken?: number };
    isModified: boolean;
    restoreTable: () => void;
};

export default function Table({
    data,
    totalRecords,
    queryStatus,
    isModified,
    restoreTable,
}: Props) {
    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap">
                <div className="d-flex flex-column">
                    {queryStatus.status !== undefined && queryStatus.timeTaken !== undefined && (
                        <p className="text-white fw-bold midsmall">
                            {queryStatus.status === true
                                ? `Done! (took ${queryStatus.timeTaken}ms 😅)`
                                : `Error! (could not execute query 😔)`}
                        </p>
                    )}
                    <p className="h6 text-light fw-bold">
                        Selected Records (Showing {data.length} of {totalRecords})
                    </p>
                </div>
                {isModified && (
                    <div className="text-end">
                        <button
                            className="mt-1 mb-2 btnCustom restoreBtn"
                            onClick={() => restoreTable()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height={16}
                                width={16}
                                className="me-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            RESTORE TABLE
                        </button>
                    </div>
                )}
            </div>
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
