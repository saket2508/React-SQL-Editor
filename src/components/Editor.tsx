import { useState } from 'react';
import { parseSQLQuery, readResult } from '../helper';

type Props = {
    colNames?: string[];
    initialRows?: Record<string, any>[];
    modifyTableData?: (filteredData: TableData) => void;
    setQueryStatus?: (newStatus: { status: boolean; timeTaken: number }) => void;
};

export default function Editor({ colNames, initialRows, modifyTableData, setQueryStatus }: Props) {
    const [error, setError] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');

    const handleSubmit = () => {
        let startTime = new Date().getTime();
        try {
            let { isValid, result } = parseSQLQuery(query, colNames || []);
            console.log(result);
            if (isValid && result !== null) {
                console.log(result);
                if (error) {
                    setError(false);
                }
                if (initialRows) {
                    let filteredData = readResult(result, initialRows);
                    modifyTableData!(filteredData);
                    let endTime = new Date().getTime();
                    let timeTaken = endTime - startTime;
                    setQueryStatus!({
                        status: true,
                        timeTaken: timeTaken,
                    });
                }
            } else {
                setError(true);
                setQueryStatus!({
                    status: false,
                    timeTaken: -1,
                });
            }
        } catch (error) {
            console.error(error);
            setError(true);
            setQueryStatus!({
                status: false,
                timeTaken: -1,
            });
        }
    };

    return (
        <div className="col-11 col-sm-7 mb-4">
            <textarea
                placeholder="SELECT * FROM Products;"
                className={`editorInput ${error && 'editorError'}`}
                rows={4}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
            {error ? (
                <small className="errorText">
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
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Please enter a valid SQL query.
                </small>
            ) : (
                <small className="text-light">
                    <svg
                        width={16}
                        height={16}
                        xmlns="http://www.w3.org/2000/svg"
                        className="me-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Try entering space seperated terms in your query
                </small>
            )}
            <div className="text-end mt-2 mt-sm-0">
                <button className="btnCustom queryBtn" onClick={() => handleSubmit()}>
                    <span className="icon">
                        <svg
                            height={'17'}
                            width={'17'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                            />
                        </svg>
                    </span>
                    RUN SQL QUERY
                </button>
            </div>
        </div>
    );
}
