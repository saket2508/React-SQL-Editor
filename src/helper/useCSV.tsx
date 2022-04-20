import { useState, useRef, useEffect } from 'react';
import { parseCSV } from './index';

const csvPaths: Record<string, string> = {
    Categories:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/categories.csv',
    Customers:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv',
    Employees:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/employees.csv',
    Orders: 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/orders.csv',
    Products:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/products.csv',
    Regions:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/regions.csv',
    Shippers:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/shippers.csv',
    Suppliers:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/suppliers.csv',
    Territories:
        'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/territories.csv',
};

export default function useCSV(tableName: string): TableData {
    const [parsedData, setParsedData] = useState<TableData>({
        rows: [],
        cols: [],
        length: 0,
    });
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            (async () => {
                const urlPath = csvPaths[tableName];
                const res = await fetch(urlPath);
                const csvBlob = await res.text();
                const { rows, cols, length } = parseCSV(csvBlob);
                setParsedData({
                    rows: rows,
                    cols: cols,
                    length: length,
                });
            })();
        }
    }, [tableName]);

    return parsedData;
}
