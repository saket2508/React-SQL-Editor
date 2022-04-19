import { useState, useEffect } from 'react';
import { parseCSV } from './index';

const csvPaths: Record<string, string> = {
    'Categories': 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/categories.csv',
    'Customers': 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv',
    'Employees': 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/employees.csv',
    'Orders': 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/orders.csv',
    'Products': 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/products.csv',
    'Regions':'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/regions.csv',
    'Territories':'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/territories.csv'
}

export default function useCSV(tableName: string): TableData {
    const [parsedData, setParsedData] = useState<TableData>({
        rows: [],
        cols: [],
        length: 0,
    });

    useEffect(() => {
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
    }, [tableName]);

    return parsedData;
}
