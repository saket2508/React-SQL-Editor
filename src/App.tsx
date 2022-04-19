import React, { useEffect, useState } from 'react';
import Editor from './components/Editor';
import Table from './components/Table';
import useCSV from './helper/useCSV';
import Drawer from './components/Drawer';

function App() {
    const [activeTable, setActiveTable] = useState('Products');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [startIdx, setStartIdx] = useState(0);
    const [endIdx, setEndIdx] = useState(10);
    const [pageLength, setPageLength] = useState(10);
    const [results, setResults] = useState<TableData | null>(null);
    const [records, setRecords] = useState<TableData | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [queryStatus, setQueryStatus] = useState<{ status?: boolean; timeTaken?: number }>({});

    const data = useCSV(activeTable);

    useEffect(() => {
        setResults(data);
        setRecords(data);
    }, [data]);

    const modifyTableData = (newRecords: TableData) => {
        setRecords(newRecords);
        setIsModified(true);
    };

    const restoreTable = () => {
        const data: TableData = {
            ...results!,
        };
        setRecords(data);
        setQueryStatus({});
        setIsModified(false);
    };

    const changeTable = (tableName: string) => {
        setActiveTable(tableName);
    }

    return (
        <div className="container">
            <div className="mt-3 ps-2 text-light">
                <a className='hamburgerIcon' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height={36}
                        width={36}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </a>
            </div>
            <Drawer activeTable={activeTable} changeTable={changeTable}/>
            <section className="editorContainer">
                {results === null || records === null ? (
                    <>
                        <Editor tableName={activeTable}/>
                        <div className="mb-2">
                            <div className="spinner-grow text-light" role="status">
                                <span className="visually-hidden">Fetching Data...</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Editor
                            tableName={activeTable}
                            colNames={results.cols}
                            initialRows={results.rows}
                            modifyTableData={modifyTableData}
                            setQueryStatus={setQueryStatus}
                        />
                        <Table
                            data={records}
                            totalRecords={results.length}
                            queryStatus={queryStatus}
                            isModified={isModified}
                            restoreTable={restoreTable}
                        />
                    </>
                )}
            </section>
        </div>
    );
}

export default App;
