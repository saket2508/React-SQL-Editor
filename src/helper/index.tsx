export function parseCSV(csvBlob: string, delim = ','): TableData {
    const lines = csvBlob.split('\n');
    const tableHead = lines[0].split(delim);
    const tableBody = [];
    for (let i = 1; i < lines.length; i++) {
        const row: Record<string, any> = {};
        const line = lines[i];
        const values = line.split(delim);
        for (let idx = 0; idx < values.length; idx++) {
            if (!isNaN(values[idx] as any)) {
                if (values[idx].includes('.')) {
                    row[tableHead[idx]] = parseFloat(values[idx]);
                } else {
                    row[tableHead[idx]] = parseInt(values[idx]);
                }
            } else {
                row[tableHead[idx]] = values[idx];
            }
        }
        tableBody.push(row);
    }
    return {
        cols: tableHead,
        rows: tableBody,
        length: lines.length - 1,
    };
}

export function parseSQLQuery(
    query: string,
    colNames: string[],
    tableName = 'Products'
): {
    result: Filter | null;
    isValid: boolean;
} {
    const keywords = ['select', '*', 'from', 'where', 'or', 'and', 'not', 'order', 'by', 'asc', 'desc'];
    const operators = ['>=', '<=', '>', '<', '='];

    const priorities: Record<string, string[]> = {
        1: ['select'],
        2: ['*', ...colNames],
        3: ['from'],
        4: [tableName],
        5: ['where', 'order', 'by'],
    };

    const result: Filter = {
        cols: [],
        filter: [],
    };

    const getPriority = (term: string) => {
        const keys = Object.keys(priorities);
        for (let key of keys) {
            if (priorities[key].includes(term)) {
                return parseInt(key);
            }
        }
        return 0;
    };

    const checkAfterOrderBy = (exp: string[]) => {
        if (!exp) {
            return { isValid: false, result: null };
        }
        let col = exp[0];
        let order = exp[1];
        if (!colNames.includes(col)) {
            return { isValid: false, result: null };
        }
        if (!order || exp.length === 1) {
            const sortOrder: any = {
                col: col,
                order: 1,
            };
            result.sort = sortOrder;
            return {
                isValid: true,
                result: result,
            };
        }
        if (order !== 'asc' && order !== 'desc') {
            return { isValid: false, result: null };
        }
        const sortOrder: any = {
            col: col,
            order: order === 'asc' ? 1 : -1,
        };
        result.sort = sortOrder;
        return {
            isValid: true,
            result: result,
        };
    };

    const checkAfterWhere = (expStr: string[]) => {
        if (!expStr) {
            return { isValid: false, result: null };
        }
        let exp;
        let sortKeyInc;
        if (expStr.includes('order')) {
            let i = expStr.indexOf('order');
            exp = expStr.slice(0, i);
            sortKeyInc = i;
        } else {
            exp = [...expStr];
        }
        let logicalExp = ['and', 'or', 'not'];
        const matchOp: any = {
            and: 1,
            or: 0,
            not: -1,
        };
        let cmp = 0;
        let op = 0;
        let i = 0;
        while (i < exp.length) {
            let _eval: any = {};
            if (logicalExp.includes(exp[i])) {
                if ((exp[i] === 'and' || exp[i] === 'or') && exp[i + 1] === 'not') {
                    cmp += 1;
                    _eval['match'] = -1;
                    _eval['inc'] = exp[i] === 'and' ? true : false;
                    i += 2;
                } else {
                    cmp += 1;
                    _eval['match'] = matchOp[exp[i]];
                    i += 1;
                }
            }
            if (
                colNames.includes(exp[i]) &&
                operators.includes(exp[i + 1]) &&
                exp[i + 2] !== undefined
            ) {
                if (i === 0) {
                    _eval['match'] = 1;
                }
                _eval['col'] = exp[i];
                _eval['value'] = exp[i + 2];
                if (colNames.includes(exp[i + 2])) {
                    _eval['valIsCol'] = true;
                }
                switch (exp[i + 1]) {
                    case '=':
                        _eval['cmp'] = '==';
                        break;
                    case '<':
                        _eval['cmp'] = '<';
                        break;
                    case '>':
                        _eval['cmp'] = '>';
                        break;
                    case '<=':
                        _eval['cmp'] = '<=';
                        break;
                    case '>=':
                        _eval['cmp'] = '>=';
                        break;
                }
                op += 1;
                i += 3;
            } else {
                return { isValid: false, result: null };
            }
            result.filter.push(_eval);
        }
        const valid = op === cmp || op === cmp + 1;
        if (!sortKeyInc) {
            return {
                isValid: valid,
                result: valid ? result : null,
            };
        }
        return checkAfterOrderBy(expStr.slice(sortKeyInc + 2));
    };

    let queryLC = query.trim().replaceAll("'", '').replaceAll(',', ' ').replaceAll(';', '');

    let sub = queryLC
        .split(' ')
        .map((term) => term.trim())
        .filter((term) => term !== '');

    // only convert keywords to lowercase
    for (let i = 0; i < sub.length; i++) {
        let term = sub[i];
        if (keywords.includes(term.toLowerCase())) {
            sub[i] = term.toLowerCase();
        }
    }
    if (sub[0] !== 'select' || sub.length < 4) {
        return { isValid: false, result: null };
    }

    if (sub.includes('order')) {
        let i = sub.indexOf('order');
        if (!sub[i + 1] || sub[i + 1] !== 'by') {
            return { isValid: false, result: null };
        }
    }

    for (let i = 1; i < sub.length; i++) {
        let currTerm = sub[i].trim();
        let prevTerm = sub[i - 1].trim();
        let prevPriority = getPriority(prevTerm);
        let currPriority = getPriority(currTerm);
        if (currPriority === 5 && prevPriority === 4) {
            if (currTerm === 'where') {
                return checkAfterWhere(sub.slice(i + 1));
            } else {
                return checkAfterOrderBy(sub.slice(i + 2));
            }
        }
        if (!currPriority || !prevPriority) {
            return { isValid: false, result: null };
        }
        if (currPriority === 2) {
            if (currTerm === '*') {
                result.cols = [...colNames];
            } else {
                result.cols = [...result.cols, currTerm];
            }
        }
        if (currPriority - prevPriority > 1) {
            return { isValid: false, result: null };
        }
    }
    return { isValid: true, result: result };
}

export function readResult(result: Filter, initialRecords: Record<string, any>[]): TableData {
    let newRecords = [...initialRecords];
    let toSort = result.sort;
    let sortExp = '';
    if (toSort) {
        let colName = toSort.col;
        let order = toSort.order;
        if (order === 1) {
            sortExp = `a['${colName}'] < b['${colName}'] ? -1 : 0`;
        } else {
            sortExp = `b['${colName}'] < a['${colName}'] ? -1 : 0`;
        }
    }

    if (result.filter.length === 0) {
        if(sortExp) {
            newRecords = newRecords.sort((a, b) => eval(sortExp));
        }
        let includedCols = result.cols;
        const allRows = [];
        for (let i = 0; i < newRecords.length; i++) {
            const newRow: Record<string, any> = {};
            for (let col of includedCols) {
                newRow[col] = newRecords[i][col];
            }
            allRows.push(newRow);
        }
        return {
            cols: includedCols,
            rows: allRows,
            length: allRows.length,
        };
    }

    // generate sort and filter expressions from result

    // Type insensitive comparison of values
    let filterExp = '';
    for (let i = 0; i < result.filter.length; i++) {
        let cmp = result.filter[i].cmp;
        let column = result.filter[i].col;
        let value = result.filter[i].value;
        let match = result.filter[i].match;
        let inc = result.filter[i].inc;
        let valIsColumn = result.filter[i].valIsCol;
        const leftHandExp = `row['${column}']`;
        const rightHandExp = valIsColumn ? `row['${value}']` : `'${value}'`;
        if (i === 0) {
            if (match === 1) {
                filterExp += `${leftHandExp} ${cmp} ${rightHandExp}`;
            } else {
                filterExp += `!(${leftHandExp} ${cmp} ${rightHandExp})`;
            }
        } else {
            if (match === 1) {
                filterExp += ` && ${leftHandExp} ${cmp} ${rightHandExp}`;
            } else if (match === 0) {
                filterExp += ` || ${leftHandExp} ${cmp} ${rightHandExp}`;
            } else {
                filterExp +=
                    inc === true
                        ? ` && !(${leftHandExp} ${cmp} ${rightHandExp})`
                        : ` || !(${leftHandExp} ${cmp} ${rightHandExp})`;
            }
        }
    }
    if(filterExp) {
        newRecords = newRecords.filter((row) => eval(filterExp));
    }
    if(sortExp) {
        newRecords = newRecords.sort((a, b) => eval(sortExp));
    }
    let includedCols = result.cols;
    const allRows = [];
    for (let i = 0; i < newRecords.length; i++) {
        const newRow: Record<string, any> = {};
        for (let col of includedCols) {
            newRow[col] = newRecords[i][col];
        }
        allRows.push(newRow);
    }

    return {
        rows: allRows,
        cols: result.cols,
        length: allRows.length,
    };
}
