type Props = {
    startIdx: number;
    endIdx: number;
    pageLength: number;
    handleNextPage: () => void;
    handlePrevPage: () => void;
    handlePageSizeChange: (newSize: number) => void;
    dataLength: number;
};

export default function PaginationControl({
    startIdx,
    endIdx,
    pageLength,
    handleNextPage,
    handlePrevPage,
    handlePageSizeChange,
    dataLength,
}: Props) {
    return (
        <div className="container">
            <div className="mt-1 mb-2 d-flex justify-content-between align-items-center text-light">
            <div className="d-flex">
                <span onClick={() => handlePrevPage()}>
                    <svg
                        height={18}
                        width={18}
                        xmlns="http://www.w3.org/2000/svg"
                        className="pe-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </span>
                <p>
                    {startIdx + 1} - {endIdx} of {dataLength}
                </p>
                <span onClick={() => handleNextPage()}>
                    <svg
                        height={18}
                        width={18}
                        xmlns="http://www.w3.org/2000/svg"
                        className="ps-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
            <div className="d-flex">
                <p className="fw-semibold">Rows per page: </p>
                <span className="ms-2">
                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-outline-light dropdown-toggle rounded-pill"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {pageLength}
                        </button>
                        <ul
                            className="dropdown-menu customMenu"
                            aria-labelledby="dropdownMenuButton1"
                        >
                            {[5, 10, 25, 50].map((size, idx) => (
                                <li
                                    onClick={() => handlePageSizeChange(size)}
                                    className="dropdown-item"
                                    key={idx}
                                >
                                    <span>{size}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </span>
            </div>
        </div>
        </div>
    )
}
