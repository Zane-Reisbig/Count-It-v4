import { Row } from "read-excel-file";
import { Cell } from "read-excel-file/types";

import { textCleaner, createRepeatsObject, makeAssociations } from "./textHandling";
import words from "./words";

interface paramObject {
    [key: string]: string;

    "Performed by": string;
    "Country": string;
    "Site Number": string;
    "Subject Number": string;
}


export function getDataFromHeader(cell: Cell, rows: Row[]): Cell[] {

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            const rowCell = row[j];

            if (rowCell == cell) {
                const data: Cell[] = [];

                for (let k = 0; k < rows.length; k++) {
                    const row = rows[k];
                    const rowCell = row[j];

                    if (rowCell != null) {
                        data.push(rowCell);
                    }
                }

                return data;
            }
        }
    }

    return [];

}

export function getUniqueValuesFromHeader(cell: Cell, rows: Row[]): Cell[] {

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            const rowCell = row[j];

            if (rowCell == cell) {
                const uniqueValues: Cell[] = [];

                for (let k = 0; k < rows.length; k++) {
                    const row = rows[k];
                    const rowCell = row[j];

                    if (!uniqueValues.includes(rowCell) && rowCell != null) {
                        uniqueValues.push(rowCell);
                    }
                }

                return uniqueValues;
            }
        }
    }

    return [];
}

export function countRepeatedValues(colNumber: number, fileRows: Row[]): { [key: string]: number } {

    const count: any = {};

    for (let i = 0; i < fileRows.length; i++) {
        const row = fileRows[i];
        const rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            const rowCell = row[j] as string;

            if (j == colNumber) {
                if (count[rowCell] == null) {
                    count[rowCell] = 1;
                } else {
                    count[rowCell] += 1;
                }
            }
        }
    }

    return count;

}

export function generateReport(searchOn: paramObject, fileRows: Row[]): object {
    interface paramLInterface {
        [key: string]: number;
        "E Code": number;
        "Country": number;
        "Site Number": number;
        "Performed by": number;
        "Subject Number": number;
        "Test Date/Time": number;
        "Overread Selection Reason": number;
    }

    const paramLocations: paramLInterface = {
        "Performed by": 0,
        "E Code": 0,
        "Country": 0,
        "Site Number": 0,
        "Subject Number": 0,
        "Test Date/Time": 0,
        "Overread Selection Reason": 0
    }

    const paramKeys = Object.keys(paramLocations);

    for (let i = 0; i < fileRows.length; i++) {
        const row = fileRows[i];
        const rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            const rowCell = row[j] as string;

            if (paramKeys.includes(rowCell)) {
                paramLocations[rowCell] = j;
            }
        }
    }


    //Header Row is 10
    //^ this is no longer always true. the header row is variable
    //fileRows[r][c] - r = row, c = column

    // console.log(paramLocations);

    const dataRows = [];

    for (let i = 0; i < fileRows.length; i++) {
        const currentCell = fileRows[i][paramLocations["Performed by"]];

        if (currentCell != null) {
            if (searchOn["Performed by"] != "") {
                if (currentCell == searchOn["Performed by"]) {
                    dataRows.push(fileRows[i]);
                }
            }

            if (searchOn["Performed by"] == "") {
                dataRows.push(fileRows[i]);
            }
        }
    }

    const siteNumberRows = [];
    for (let i = 0; i < dataRows.length; i++) {
        const currentCell = dataRows[i][paramLocations["Site Number"]];

        if (currentCell != null) {
            if (searchOn["Site Number"] != "") {

                if (currentCell == searchOn["Site Number"]) {
                    siteNumberRows.push(dataRows[i]);
                }
            }

            if (searchOn["Site Number"] == "") {

                siteNumberRows.push(dataRows[i]);
            }
        }
    }

    const countryRows = [];

    for (let i = 0; i < siteNumberRows.length; i++) {
        const currentCell = siteNumberRows[i][paramLocations["Country"]];

        if (currentCell != null) {
            if (searchOn["Country"] != "") {

                if (currentCell == searchOn["Country"]) {
                    countryRows.push(siteNumberRows[i]);
                }
            }

            if (searchOn["Country"] == "") {

                countryRows.push(siteNumberRows[i]);
            }
        }
    }

    const subjectNumberRows = [];
    let subjectIdCol = "Subject Number";
    if (paramLocations["E Code"] != 0) {
        subjectIdCol = "E Code";
    }
    else {
        subjectIdCol = "Subject Number";
    }

    console.log(paramLocations);

    for (let i = 0; i < countryRows.length; i++) {
        const currentCell = countryRows[i][paramLocations[subjectIdCol]];

        if (currentCell != null) {
            if (searchOn["Subject Number"] != "") {

                if (currentCell == searchOn["Subject Number"]) {
                    subjectNumberRows.push(countryRows[i]);
                }
            }

            if (searchOn["Subject Number"] == "") {

                subjectNumberRows.push(countryRows[i]);
            }

        }

    }



    const splitArray = [];

    for (let i = 0; i < countryRows.length; i++) {

        const currentCell = countryRows[i][paramLocations["Overread Selection Reason"]];

        if (currentCell != null) {
            splitArray.push(textCleaner(currentCell as string));
        }
    }

    interface wcoInterface {
        [key: string]: number;
    }
    let wordCountObject: wcoInterface = {};
    wordCountObject = createRepeatsObject(splitArray, wordCountObject);

    // Sort the object by count
    let wordCountsSorted: Array<[string, number]> = [];
    for (const word in wordCountObject) {
        if (word === "" || word === " ") { continue; }
        wordCountsSorted.push([word, wordCountObject[word]]);
    }

    wordCountsSorted = wordCountsSorted.sort((a, b) => b[1] - a[1]);

    let associationArray = [];
    associationArray = makeAssociations(words(), wordCountsSorted)

    const delimiter = ";";
    let csv = "sep=;\n";

    // Search Information logic
    searchOn["Performed by"] = searchOn["Performed by"] == "" ? "All" : searchOn["Performed by"];
    searchOn["Start Date"] = "All Time";
    searchOn["End Date"] = "All Time";
    searchOn["Site Number"] = searchOn["Site Number"] == "" ? "All" : searchOn["Site Number"];
    searchOn["Country"] = searchOn["Country"] == "" ? "All" : searchOn["Country"];
    searchOn["Subject Number"] = searchOn["Subject Number"] == "" ? "All" : searchOn["Subject Number"];

    // Search Information append
    csv += `Performed by${delimiter}${searchOn["Performed by"]}\n`;
    csv += `Start Date${delimiter}${searchOn["Start Date"]}\n`;
    csv += `End Date${delimiter}${searchOn["End Date"]}\n`;
    csv += `Site Number${delimiter}${searchOn["Site Number"]}\n`;
    csv += `Country${delimiter}${searchOn["Country"]}\n`;
    csv += `Subject Number${delimiter}${searchOn["Subject Number"]}\n`;

    // Word associations append
    csv += "\r\n".repeat(2);
    associationArray.forEach((key: string) => {
        csv += `${key[0]}${delimiter}${key[1]}\n`;
    });

    // Total Words counted
    csv += "\r\n".repeat(2);
    wordCountsSorted.forEach((key) => {
        csv += `${key[0]}${delimiter}${key[1]}\n`;
    });

    console.log(csv);
    return { csv: csv, rowCount: associationArray.length };

}


export function downloadFile(data: any, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
