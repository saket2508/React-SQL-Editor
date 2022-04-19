import { useEffect, useState } from 'react';
import Editor from './components/Editor';
import Table from './components/Table';
import useCSV from './helper/useCSV';
import Drawer from './components/Drawer';
import PaginationControl from './components/PaginationControl';

function App() {
    const [activeTable, setActiveTable] = useState('Products');
    const [hidePagination, setHidePagination] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [startIdx, setStartIdx] = useState(0);
    const [endIdx, setEndIdx] = useState(5);
    const [pageLength, setPageLength] = useState(5);
    const [records, setRecords] = useState<TableData | null>(null);
    const [isModified, setIsModified] = useState(false);
    const [queryStatus, setQueryStatus] = useState<{ status?: boolean; timeTaken?: number }>({});

    const data = useCSV(activeTable);

    useEffect(() => {
        const dataLength = data.length;
        if(dataLength <= 10) {
            setHidePagination(true);
            setRecords({
                cols: data.cols,
                rows: data.rows,
                length: data.length,
            });
            return;
        }
        if(hidePagination) {
            setHidePagination(false);
        }
        setStartIdx(0);
        setEndIdx(5);
        setCurrPage(1);
        setPageLength(5);
        const pageRecords = data.rows.slice(0, 5);
        setRecords({
            rows: pageRecords,
            cols: data.cols,
            length: data.length,
        });
    }, [data]);

    const modifyTableData = (newRecords: TableData) => {
        setIsModified(true);
        if (newRecords.length <= 10) {
            setHidePagination(true);
            setRecords({
                rows: newRecords.rows,
                cols: newRecords.cols,
                length: newRecords.length,
            });
            return;
        }
        if(hidePagination) {
            setHidePagination(false);
        }
        setStartIdx(0);
        setEndIdx(5);
        setCurrPage(1);
        setPageLength(5);
        const pageRecords = newRecords.rows.slice(0, 5);
        setRecords({
            rows: pageRecords,
            cols: newRecords.cols,
            length: newRecords.length,
        });
    };

    const restoreTable = () => {
        setCurrPage(1);
        setStartIdx(0);
        setEndIdx(5);
        setPageLength(5);
        let pageRecords = data.rows.slice(0, 5);
        setRecords({
            cols: data.cols,
            rows: pageRecords,
            length: data.length,
        });
        setQueryStatus({});
        setIsModified(false);
        if (hidePagination) {
            setHidePagination(false);
        }
    };

    const changeTable = (tableName: string) => {
        setPageLength(5);
        setStartIdx(0);
        setEndIdx(5);
        setCurrPage(1);
        setActiveTable(tableName);
        setIsModified(false);
        setQueryStatus({});
    };

    const handleNextPage = () => {
        let nextPage = currPage + 1;
        let newStartIdx = pageLength * currPage;
        let newEndIdx = pageLength * nextPage;
        if (newEndIdx > data.rows.length) {
            if (newStartIdx < data.rows.length) {
                newEndIdx = data.rows.length;
                const pageRecords = data.rows.slice(newStartIdx, newEndIdx);
                setRecords({
                    cols: data.cols,
                    rows: pageRecords,
                    length: data.length,
                });
                setCurrPage(nextPage);
                setStartIdx(newStartIdx);
                setEndIdx(newEndIdx);
            }
            return;
        }
        let pageRecords = data.rows.slice(newStartIdx, newEndIdx);
        setRecords({
            cols: data.cols,
            rows: pageRecords,
            length: data.length,
        });
        setCurrPage(nextPage);
        setStartIdx(newStartIdx);
        setEndIdx(newEndIdx);
    };

    const handlePrevPage = () => {
        if (currPage === 1) {
            return;
        }
        let prevPage = currPage - 1;
        let newStartIdx = pageLength * (prevPage - 1);
        let newEndIdx = pageLength * prevPage;
        let pageRecords = data.rows.slice(newStartIdx, newEndIdx);
        setRecords({
            cols: data.cols,
            rows: pageRecords,
            length: data.length,
        });
        setCurrPage(prevPage);
        setStartIdx(newStartIdx);
        setEndIdx(newEndIdx);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        let newStartIdx = (currPage - 1) * newPageSize;
        let newEndIdx = currPage * newPageSize;
        if (newEndIdx > data.rows.length) {
            let nearestMultiple = Math.floor(data.rows.length / newPageSize);
            const pageRecords = data.rows.slice(nearestMultiple * newPageSize, data.rows.length);
            setPageLength(newPageSize);
            setStartIdx(nearestMultiple * newPageSize);
            setEndIdx(data.rows.length);
            setCurrPage(nearestMultiple);
            setRecords({
                cols: data.cols,
                rows: pageRecords,
                length: data.rows.length,
            });
        } else {
            const pageRecords = data.rows.slice(newStartIdx, newEndIdx);
            setRecords({
                cols: data.cols,
                rows: pageRecords,
                length: data.rows.length,
            });
            setPageLength(newPageSize);
            setStartIdx(newStartIdx);
            setEndIdx(newEndIdx);
        }
    };

    return (
        <div className="container">
            <div className="mt-3 ps-2 text-light">
                <a
                    className="hamburgerIcon"
                    data-bs-toggle="offcanvas"
                    href="#offcanvasExample"
                    role="button"
                    aria-controls="offcanvasExample"
                >
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
            <Drawer activeTable={activeTable} changeTable={changeTable} />
            <section className="editorContainer">
                {data === null || records === null ? (
                    <>
                        <Editor tableName={activeTable} />
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
                            colNames={data.cols}
                            initialRows={data.rows}
                            modifyTableData={modifyTableData}
                            setQueryStatus={setQueryStatus}
                        />
                        <div className="col-12 col-sm-10">
                            <Table
                                data={records}
                                totalRecords={data.length}
                                queryStatus={queryStatus}
                                isModified={isModified}
                                restoreTable={restoreTable}
                            />
                            {hidePagination ? (
                                <div></div>
                            ) : (
                                <PaginationControl
                                    startIdx={startIdx}
                                    endIdx={endIdx}
                                    pageLength={pageLength}
                                    handleNextPage={handleNextPage}
                                    handlePrevPage={handlePrevPage}
                                    handlePageSizeChange={handlePageSizeChange}
                                    dataLength={records.length}
                                />
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default App;
