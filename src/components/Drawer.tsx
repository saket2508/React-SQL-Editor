export default function Drawer({ activeTable, changeTable }: { 
    activeTable: string;
    changeTable: (tableName: string) => void;
}) {
    const tables = [
        'Categories',
        'Customers',
        'Employees',
        'Orders',
        'Products',
        'Regions',
        'Shippers',
        'Suppliers',
        'Territories',
    ];
    return (
        <div
            className="offcanvas offcanvas-start drawerMenu"
            tabIndex={-1}
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
        >
            <div className="offcanvas-header">
                <a
                    className="text-light"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    role={'button'}
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </a>
            </div>
            <div className="offcanvas-body pt-4">
                {tables.map((item, idx) => (
                    <div
                        className={`mt-3 d-flex align-items-start drawerItem ${
                            activeTable === item && 'text-primary'
                        }`}
                        key={idx}
                        onClick={() => changeTable(item)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mt-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            height={18}
                            width={18}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="ps-1 h5">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
