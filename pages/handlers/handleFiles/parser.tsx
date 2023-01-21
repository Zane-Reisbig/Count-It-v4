import { debug } from "console";
import { Row } from "read-excel-file";
import { Cell } from "read-excel-file/types";

import splitFirst from "./overReadParser";

export function getDataFromHeader(cell: Cell, rows: Row[]): Cell[] {

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            let rowCell = row[j];

            if (rowCell == cell) {
                let data: Cell[] = [];

                for (let k = 0; k < rows.length; k++) {
                    let row = rows[k];
                    let rowCell = row[j];

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
        let row = rows[i];
        let rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            let rowCell = row[j];

            if (rowCell == cell) {
                let uniqueValues: Cell[] = [];

                for (let k = 0; k < rows.length; k++) {
                    let row = rows[k];
                    let rowCell = row[j];

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

export function countRepeatedValues(colNumber: number, fileRows: Row[]): Object {

    let count: Object = {};

    for (let i = 0; i < fileRows.length; i++) {
        let row = fileRows[i];
        let rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            let rowCell = row[j] as string;

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

export function generateReport(params, fileRows: Row[]): object {

    let finalReport = {
        "finalRows": [],
        "overreadRows": []
    }

    let paramLocations = {
        ...params,
        "Test Date/Time": 0,
        "Overread Selection Reason": 0
    }
    delete paramLocations["End Date"]
    delete paramLocations["Start Date"]

    let paramKeys = Object.keys(paramLocations);

    for (let i = 0; i < fileRows.length; i++) {
        let row = fileRows[i];
        let rowLength = row.length;

        for (let j = 0; j < rowLength; j++) {
            let rowCell = row[j] as string;

            if (paramKeys.includes(rowCell)) {
                paramLocations[rowCell] = j;
            }
        }
    }


    //Header Row is 10
    //fileRows[r][c] - r = row, c = column

    // console.log(paramLocations);

    let userRows = [];

    for (let i = 0; i < fileRows.length; i++) {
        let currentCell = fileRows[i][paramLocations["Performed by"]];

        if (currentCell != null) {
            if (params["Performed by"] != "") {
                if (currentCell == params["Performed by"]) {
                    userRows.push(fileRows[i]);
                }
            }

            if (params["Performed by"] == "") {
                userRows.push(fileRows[i]);
            }
        }
    }

    let dateRows = [];

    for (let i = 0; i < userRows.length; i++) {
        let currentCell = userRows[i][paramLocations["Test Date/Time"]];

        if (currentCell != null) {
            let date = new Date(currentCell);

            if (params["Start Date"] != "" && params["End Date"] != "") {

                let startDate = new Date(params["Start Date"]);
                let endDate = new Date(params["End Date"]);

                if (date >= startDate && date <= endDate) {
                    dateRows.push(userRows[i]);
                }
            }

            if (params["Start Date"] == "") {
                if (params["End Date"] == "") {
                    dateRows.push(userRows[i]);
                    continue;
                }

                let endDate = new Date(params["End Date"]);

                if (date <= endDate) {
                    dateRows.push(userRows[i]);
                }

                continue;
            }

            if (params["End Date"] == "") {
                if (params["Start Date"] == "") {
                    dateRows.push(userRows[i]);
                    continue;
                }

                let startDate = new Date(params["Start Date"]);

                if (date >= startDate) {
                    dateRows.push(userRows[i]);
                }

                continue;
            }

        }
    }

    let siteNumberRows = [];

    for (let i = 0; i < dateRows.length; i++) {
        let currentCell = dateRows[i][paramLocations["Site Number"]];

        if (currentCell != null) {
            if (params["Site Number"] != "") {

                if (currentCell == params["Site Number"]) {
                    siteNumberRows.push(dateRows[i]);
                }
            }

            if (params["Site Number"] == "") {

                siteNumberRows.push(dateRows[i]);
            }
        }
    }

    let countryRows = [];

    for (let i = 0; i < siteNumberRows.length; i++) {
        let currentCell = siteNumberRows[i][paramLocations["Country"]];

        if (currentCell != null) {
            if (params["Country"] != "") {

                if (currentCell == params["Country"]) {
                    countryRows.push(siteNumberRows[i]);
                }
            }

            if (params["Country"] == "") {

                countryRows.push(siteNumberRows[i]);
            }
        }
    }

    let subjectNumberRows = [];

    for (let i = 0; i < countryRows.length; i++) {
        let currentCell = countryRows[i][paramLocations["Subject Number"]];

        if (currentCell != null) {
            if (params["Subject Number"] != "") {

                if (currentCell == params["Subject Number"]) {
                    subjectNumberRows.push(countryRows[i]);
                }
            }

            if (params["Subject Number"] == "") {

                subjectNumberRows.push(countryRows[i]);
            }

        }
    }



    let countedObjects = [];

    for (let i = 0; i < countryRows.length; i++) {
        // debugger;

        let currentCell = countryRows[i][paramLocations["Overread Selection Reason"]];

        if (currentCell != null) {
            countedObjects.push(splitFirst(currentCell));
        }
    }

    let finalCountRolled = {};
    let associationTotalRolled = {};

    for (let i = 0; i < countedObjects.length; i++) {
        let item = countedObjects[i]["finalCount"];

        for (let j = 0; j < item.length; j++) {
            if (finalCountRolled[item[j]["word"]] == null) {
                finalCountRolled[item[j]["word"]] = { count: item[j]["count"], assoc: item[j]["assoc"] }
            }
            else {
                finalCountRolled[item[j]["word"]]["count"] += item[j]["count"];
            }
        }
    }

    for (let i = 0; i < countedObjects.length; i++) {
        let item = countedObjects[i]["associationTotals"];

        for (let j = 0; j < item.length; j++) {
            if (associationTotalRolled[item[j]["assoc"]] == null) {
                associationTotalRolled[item[j]["assoc"]] = { count: item[j]["count"], assoc: item[j]["assoc"] }
            }
            else {
                associationTotalRolled[item[j]["assoc"]]["count"] += item[j]["count"];
            }
        }
    }

    finalReport["finalRows"] = subjectNumberRows;
    finalReport["overreadRows"].push(finalCountRolled);
    finalReport["overreadRows"].push(associationTotalRolled);

    // Convert final report to CSV
    const delimiter = ";";
    let csv = "";
    params["Performed by"] = params["Performed by"] == "" ? "All" : params["Performed by"];
    params["Start Date"] = params["Start Date"] == "" ? "All Time" : params["Start Date"];
    params["End Date"] = params["End Date"] == "" ? "All Time" : params["End Date"];
    params["Site Number"] = params["Site Number"] == "" ? "All" : params["Site Number"];
    params["Country"] = params["Country"] == "" ? "All" : params["Country"];
    params["Subject Number"] = params["Subject Number"] == "" ? "All" : params["Subject Number"];


    csv += `Performed by${delimiter}${params["Performed by"]}\n`;
    csv += `Start Date${delimiter}${params["Start Date"]}\n`;
    csv += `End Date${delimiter}${params["End Date"]}\n`;
    csv += `Site Number${delimiter}${params["Site Number"]}\n`;
    csv += `Country${delimiter}${params["Country"]}\n`;
    csv += `Subject Number${delimiter}${params["Subject Number"]}\n`;

    csv += "\r\n".repeat(2);

    Array.from(Object.keys(finalReport["overreadRows"][1])).forEach((key, index) => {
        csv += `${key}${delimiter}${finalReport["overreadRows"][1][key]["count"]}\n`;
    });

    csv += "\r\n".repeat(2);

    Array.from(Object.keys(finalReport["overreadRows"][0])).forEach((key, index) => {
        csv += `${key}${delimiter}${finalReport["overreadRows"][0][key]["count"]}\n`;
    });

    return { csv: csv, rowCount: Object.keys(finalReport["overreadRows"][0]).length };

}


export function downloadFile(data: any, filename: string, type: string) {
    let file = new Blob([data], { type: type });
    let a = document.createElement("a"),
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
