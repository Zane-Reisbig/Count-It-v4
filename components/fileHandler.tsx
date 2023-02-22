import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useState, useEffect, Suspense } from 'react'

import readXlsxFile, { Row } from 'read-excel-file'
import { getDataFromHeader, getUniqueValuesFromHeader, generateReport, downloadFile } from './parser';

import styles from './handleFiles.module.css'

interface FileHandlerProps {
    fileOut: File;
    fileOutHandler: (file: File) => void;
}

interface paramObject {
    "Performed by": string;
    "Country": string;
    "Site Number": string;
    "Subject Number": string;
}

export const FileHandler: NextPage<FileHandlerProps> = (props) => {

    const router = useRouter();

    const [fileRows, setFileRows] = useState<Row[]>([]);
    const [decodedHeaders, setDecodedHeaders] = useState<any[]>([]);
    const [currentReport, setCurrentReport] = useState<any[]>([]);


    useEffect(() => {
        // This useEffect is executed only once when the component is mounted.
        // It reads the data from the fileOut provided via props and sets the read data in the state variable fileRows.
        const reader = async () => await readXlsxFile(props.fileOut)
            .then(async (rows) => {
                await setFileRows(rows);
            })
        reader();
    }, [])

    useEffect(() => {
        // This useEffect is executed whenever fileRows change.
        // It searches for the header row in the fileRows and then extracts the data from the fileRows for each header column.
        // The extracted data is stored in decodedHeaders state variable.
        if (fileRows.length == 0) {
            return;
        }

        let headerRow: Row;
        let headerRowLength: number;
        for (let i = 0; i < fileRows.length; i++) {
            let row = fileRows[i];
            let rowLength = row.length;

            for (let j = 0; j < rowLength; j++) {
                let cell = row[j];

                if (cell == "Country") {
                    headerRow = row;
                    headerRowLength = rowLength;
                    break;
                }
            }
        }

        let decodedHeaders: any[] = [];

        for (let i = 0; i < headerRowLength; i++) {
            let header = headerRow[i];
            let uniqueValues = getUniqueValuesFromHeader(header, fileRows);
            let data = getDataFromHeader(header, fileRows);

            decodedHeaders.push({
                header: header,
                uniqueValues: uniqueValues,
                data: data
            })
        }

        setDecodedHeaders(decodedHeaders);

    }, [fileRows])

    useEffect(() => {
        // This useEffect is executed whenever decodedHeaders change.
        // It calls the generateControls() function.
        generateControls();
    }, [decodedHeaders])

    useEffect(() => {
        // This useEffect is executed whenever currentReport change.
        // It calls the displayReport() function.
        displayReport();
    }, [currentReport])

    function internalDownload() {
        // This function is called when the Download button in the generated report is clicked.
        // It takes the data from the current report and downloads it as a CSV file.
        let returnedRows = currentReport[0];
        let fileName = new Date().toISOString() + ".csv";
        downloadFile(returnedRows["csv"], fileName, "text");
    }

    async function displayReport() {
        try {


            let reportOutputHandle = document.getElementById("reportOutput") as HTMLDivElement;
            reportOutputHandle.innerHTML = "";

            let reportOutputDiv = document.createElement("div");

            let reportTextArea = document.createElement("textarea");
            reportTextArea.className = "w-full h-96 text-black rounded-md ";
            reportTextArea.value = currentReport[0]["csv"];
            reportTextArea.spellcheck = false;
            reportTextArea.readOnly = true;

            let reportDownloadButton = document.createElement("button");
            reportDownloadButton.className = `rounded text-black bg-white mt-4 mx-auto rounded-lg w-36 h-12 transition-all duration-300 ease-in-out active:bg-zinc-50 active:scale-95 `;
            reportDownloadButton.className += ` m-3 `;

            reportDownloadButton.innerText = "Download";
            reportDownloadButton.onclick = () => {
                internalDownload();
            };

            reportOutputDiv.appendChild(reportDownloadButton);
            reportOutputDiv.appendChild(reportTextArea);
            reportOutputHandle.appendChild(reportOutputDiv);

            let reportPopUpHandle = document.getElementById("reportGeneratedPopup") as HTMLDivElement;
            for (let i = 0; i < 100; i++) {
                setTimeout((x) => { reportPopUpHandle.style.opacity = (i / 100).toString(); }, 10 * i, i);
            }

        } catch (error) {
            console.error("Failed to load report['csv']")
            console.error(error);
        }

    }

    async function generateParams() {
        let generatedIds = ["Performed by", "Country", "Site Number", "Subject Number"];

        let searchOn: paramObject = {
            "Performed by": "",
            "Country": "",
            "Site Number": "",
            "Subject Number": ""
        };

        generatedIds.forEach((id) => {
            let select = document.getElementById(id + "List") as HTMLSelectElement;
            let value = select.value;

            searchOn[`${id}`] = value;
        })

        console.log(searchOn);

        await setCurrentReport([generateReport(searchOn, fileRows)]);

    }

    function generateControls() {

        let neededHeaders = ["Performed by", "Country", "Site Number", "Subject Number"];
        let myHeaders = [];

        for (let i = 0; i < neededHeaders.length; i++) {
            let neededHeader = neededHeaders[i];
            for (let j = 0; j < decodedHeaders.length; j++) {
                let decodedHeader = decodedHeaders[j];
                if (decodedHeader.header == neededHeader) {
                    myHeaders.push(decodedHeader);
                }
            }
        }

        let generatedContentRoot = document.getElementById("generatedContentRoot");
        generatedContentRoot!.innerHTML = "";

        let loadingMessageHandle = document.createElement("h1") as HTMLHeadingElement;
        loadingMessageHandle.className = "text-2xl text-center";
        loadingMessageHandle.innerText = "Loading Data 🔁";

        generatedContentRoot!.appendChild(loadingMessageHandle);

        for (let i = 0; i < myHeaders.length; i++) {
            let decodedHeader = myHeaders[i];

            let div = document.createElement("div");
            div.className = "m-3";

            let p = document.createElement("p");
            p.className = "ml-5 text-2xl";
            p.innerText = decodedHeader.header + ":";
            div.appendChild(p);

            let select = document.createElement("select");
            select.name = decodedHeader.header + "List";
            select.id = decodedHeader.header + "List";
            select.className = "mt-1 rounded w-60 text-black";

            let blankOption = document.createElement("option")
            blankOption.value = "";
            select.appendChild(blankOption);

            let countryCheck = false;
            for (let j = 1; j < decodedHeader.uniqueValues.length; j++) {

                if (decodedHeader.header == "Country" && countryCheck == false) {
                    j += 7;
                    countryCheck = true;
                    continue;
                }


                let uniqueValue = decodedHeader.uniqueValues[j];

                let option = document.createElement("option");
                option.value = uniqueValue;
                option.innerText = uniqueValue;
                select.appendChild(option);
            }

            let resetButton = document.createElement("button");
            resetButton.className = " rounded text-white block";
            resetButton.innerText = "Reset";
            resetButton.onclick = () => {
                select.selectedIndex = 0;
            };

            loadingMessageHandle.remove();
            div.appendChild(select);
            div.appendChild(resetButton);

            generatedContentRoot!.appendChild(div);

        }

    }

    return (
        <div className={styles.mainUiGrid}>
            <div>
                <button
                    className={`
                    text-black
                    bg-white
                    m-4
                    rounded-lg
                    w-36
                    h-12

                `}
                    onClick={() => router.reload()}
                >Go Home?
                </button>
                <button
                    className={`
                        text-black
                        bg-white
                        m-4
                        rounded-lg
                        w-36
                        h-12
                    `}
                    onClick={() => {
                        generateControls();
                    }}

                >Reset All Controls</button>
            </div>

            <div></div>
            <div></div>
            <div id="generatedContentRoot">
                <h1 id="loadingMessage">Loading Data 🔁</h1>
                {/* Template for html elements */}
                {/* <div className={`m-3`}>
                        <p className={`ml-5 text-2xl text-white`}>$``:</p>
                        <select
                            name="$``List"
                            id="$``List"
                            className={`mt-1 rounded`}
                        >Choose $``</select>
                    </div>
                */}
            </div>

            <div />
            <div />


            <div className={`m-3 grid grid-rows-5 grid-cols-5`}>
                <div>
                    <button
                        onClick={() => { generateParams() }}
                        className={`
                            text-black
                            bg-white
                            mt-4
                            mx-auto
                            rounded-lg
                            w-36
                            h-12
                            transition-all
                            duration-300
                            ease-in-out
                            active:bg-zinc-50
                            active:scale-95
                        `}
                    >Run Report</button>
                </div>

            </div>

            <div>
                <div className='mt-[80%] opacity-0' id="reportGeneratedPopup">
                    <h1
                        className={`
                            text-center
                        `}
                    >Report Generated</h1>
                    <h1
                        className={`
                            text-center
                        `}
                    >👇</h1>
                </div>

            </div>

            <div />


            <div id="reportOutput" className=' col-span-3 p-3 '>
            </div>
        </div>
    )
}





