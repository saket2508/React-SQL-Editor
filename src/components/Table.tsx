type Props = {
    data: TableData;
    totalRecords: number;
    queryStatus: { status?: boolean; timeTaken?: number };
    isModified: boolean;
    restoreTable: () => void;
    tableName: string;
};

export default function Table({
    data,
    totalRecords,
    queryStatus,
    isModified,
    restoreTable,
    tableName,
}: Props) {
    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-end flex-wrap">
                <div className="d-flex flex-column">
                    <p className="h6 text-light fw-bold">{tableName}</p>
                    <p className="text-light fw-semibold mt-0 mb-1">
                        Selected Records (Showing {data.length} of {totalRecords})
                    </p>
                    {queryStatus.status !== undefined && queryStatus.timeTaken !== undefined && (
                        <p className="text-white fw-semibold midsmall m-0">
                            {queryStatus.status === true
                                ? `Done! (took ${queryStatus.timeTaken}ms 😅)`
                                : `Error! (could not execute query 😔)`}
                        </p>
                    )}
                </div>
                {isModified && (
                    <div className="text-end">
                        <button
                            className="mt-2 mb-1 mb-sm-0 mt-sm-0 btnCustom restoreBtn"
                            onClick={() => restoreTable()}
                        >
                            <svg
                                height={16}
                                width={16}
                                xmlns="http://www.w3.org/2000/svg"
                                className="me-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Restore Table
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
