export function parseCSV(csvBlob: string, delim = ","): TableData {
  const lines = csvBlob.split("\n");
  const tableHead = lines[0].split(delim);
  const tableBody = [];
  for (let i = 1; i < lines.length; i++) {
    const row: Record<string, any> = {};
    const line = lines[i];
    const values = line.split(delim);
    for (let idx = 0; idx < values.length; idx++) {
      if (!isNaN(values[idx] as any)) {
        if (values[idx].includes(".")) {
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
  tableName = "products"
): {
  result: Filter | null;
  isValid: boolean;
} {

  const keywords = ['select', '*', 'from', 'where', 'or', 'and', 'not'];

  const priorities: Record<string, string[]> = {
    1: ["select"],
    2: ["*", ...colNames],
    3: ["from"],
    4: [tableName],
    5: ["where"],
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

  const checkAfterWhere = (exp: string[]) => {
    if (!exp) {
      return { isValid: false, result: null };
    }
    let logicalExp = ["and", "or", "not"];
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
        if ((exp[i] === "and" || exp[i] === "or") && exp[i + 1] === "not") {
          cmp += 1;
          _eval["match"] = -1;
          _eval['inc'] = exp[i] === 'and' ? true : false;
          i += 2;
        } else {
          cmp += 1;
          _eval["match"] = matchOp[exp[i]];
          i += 1;
        }
      }
      if (
        colNames.includes(exp[i]) &&
        exp[i + 1] === "=" &&
        exp[i + 2] !== undefined
      ) {
        if (i === 0) {
          _eval["match"] = 1;
        }
        _eval["col"] = exp[i];
        _eval["value"] = exp[i + 2];
        op += 1;
        i += 3;
      } else {
        return { isValid: false, result: null };
      }
      result.filter.push(_eval);
    }
    const valid = op === cmp || op === cmp + 1;
    return {
      isValid: valid,
      result: valid ? result : null,
    };
  };

  let queryLC = query
    .trim()
    .replaceAll("'", "")
    .replaceAll(",", " ")
    .replaceAll(";", "");
  let sub = queryLC
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => term !== "");
  
  // only convert keywords to lowercase
  sub.forEach((term, i) => {
    if(keywords.includes(term.toLowerCase())) {
      sub[i] = term.toLowerCase();
    }
  });

  if (sub[0] !== "select") {
    return { isValid: false, result: null };
  }

  for (let i = 1; i < sub.length; i++) {
    let currTerm = sub[i].trim();
    let prevTerm = sub[i - 1].trim();
    let prevPriority = getPriority(prevTerm);
    let currPriority = getPriority(currTerm);
    if (currPriority === 5 && prevPriority === 4) {
      return checkAfterWhere(sub.slice(i + 1));
    }
    if (!currPriority || !prevPriority) {
      return { isValid: false, result: null };
    }
    if (currPriority === 2) {
      if (currTerm === "*") {
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


export function readResult(result: Filter, intialRecords: TableData) {
  // Type insensitive comparison of values
  let filterExp =
    result.filter[0].match === 1
      ? `row['${result.filter[0].col}'] == '${result.filter[0].value}'`
      : `row['${result.filter[0].col}'] != '${result.filter[0].value}'`;
  result.filter.slice(1).forEach((obj) => {
    if (obj.match === 1) {
      filterExp += `row['${obj.col}'] == '${obj.value}'`;
    } else if (obj.match === 0) {
      filterExp += ` || row['${obj.col}'] == '${obj.value}'`;
    } else {
      filterExp +=
        obj.inc === true
          ? ` && row['${obj.col}'] != '${obj.value}'`
          : ` || row['${obj.col}'] != '${obj.value}'`;
    }
  });
  let includedCols = result.cols;
  let allRows = intialRecords.rows.map((row) => {
    let newRow: Record<string, any> = {};
    includedCols.forEach((incCol) => {
      newRow[incCol] = row[incCol];
    });
    return newRow;
  });
  let filteredRecords = allRows.filter((row) => eval(filterExp));
  return filteredRecords;
}