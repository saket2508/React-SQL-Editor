type TableData = {
    rows: Array<Record<string, any>>;
    cols: Array<string>;
    length: number;
}

type Filter = {
    cols: string[];
    filter: {
        col: string;
        value: any;
        match: 1 | 0 | -1;
        inc?: boolean;
        cmp?: '==' | '<' | '>' | '<=' | '>=';
        valIsCol?: boolean;
    }[]
}
