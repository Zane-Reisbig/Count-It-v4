import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'

import readXlsxFile, { Row } from 'read-excel-file'
import { getDataFromHeader, getUniqueValuesFromHeader, generateReport, downloadFile } from './parser';


import styles from './handleFiles.module.css'

interface FileHandlerProps {
    fileOut: File;
    fileOutHandler: (file: File) => void;
}

export const FileHandler: NextPage<FileHandlerProps> = (props) => {

    const router = useRouter();

    const [fileRows, setFileRows] = useState<Row[]>([]);
    const [decodedHeaders, setDecodedHeaders] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState<any[]>([]);


    useEffect(() => {
        // console.log("Starting Processing...")

        const reader = async () => await readXlsxFile(props.fileOut)
            .then(async (rows) => {
                await setFileRows(rows);
            })
        reader();

    }, [])

    useEffect(() => {

        if (fileRows.length == 0) {
            return;
        }

        let headerRow = fileRows[10];
        let headerRowLength = headerRow.length;

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
        generateControls();

    }, [decodedHeaders])


    function generateParams() {

        let reportOutputHandle = document.getElementById("reportOutput") as HTMLInputElement;

        let params = {
            "Performed by": "",
            "Country": "",
            "Site Number": "",
            "Subject Number": "",
            "Start Date": "",
            "End Date": ""
        };

        // Get Params for search
        for (let key in params) {
            if (key == "Start Date" || key == "End Date") {
                let input = document.getElementById(key) as HTMLInputElement;
                params[key] = input.value;
                continue;
            }
            else {
                let select = document.getElementById(key + "List") as HTMLSelectElement;
                params[key] = select.value;
                continue;
            }
        }

        // Remove Unset
        for (let key in params) {
            if (params[key] == key) {
                params[key] = "";
            }
        }

        let returnedRows = generateReport(params, fileRows);
        let fileName = new Date().toISOString() + ".csv";


        reportOutputHandle.value = "Report Generated: " + fileName + " -> ";
        reportOutputHandle.value += "Returned: " + returnedRows["rowCount"] + " Rows";

        downloadFile(returnedRows["csv"], fileName, "text");

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
        generatedContentRoot.innerHTML = "";

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

            let countryCheck = false;
            for (let j = 0; j < decodedHeader.uniqueValues.length; j++) {

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

            div.appendChild(select);
            div.appendChild(resetButton);

            generatedContentRoot.appendChild(div);

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

            <div className='m-3'>
                <div className="grid grid-cols-2 grid-rows-4 w-full h-full">

                    <div>
                        <p className='text-2xl '>Start Date:</p>
                        <button
                            className={`rounded text-white block`}
                            onClick={() => {
                                let input = document.getElementById("Start Date") as HTMLInputElement;
                                input.value = "";
                            }}
                        >Reset</button>
                    </div>
                    <input
                        type="date"
                        name="startDate"
                        id="Start Date"
                        className={`
                            inline
                            h-1/2
                            text-black
                            rounded
                        `} />

                    <div>
                        <p className='text-2xl '>End Date:</p>
                        <button
                            className={`rounded text-white block`}
                            onClick={() => {
                                let input = document.getElementById("End Date") as HTMLInputElement;
                                input.value = "";
                            }}
                        >Reset</button>
                    </div>
                    <input
                        type="date"
                        name="endDate"
                        id="End Date"
                        className={`
                            inline
                            h-1/2
                            text-black
                            rounded
                        `} />


                </div>



            </div>

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

                <div />
                <div />
                <div />
                <div />

            </div>

            <div>
                <input
                    disabled
                    className={styles.reportOutput}
                    id="reportOutput"
                ></input>
            </div>
        </div>
    )
}





