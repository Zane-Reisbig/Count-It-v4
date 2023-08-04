// const initSqlJs = require('sql.js');
// const SQL = await initSqlJs({
//   // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
//   // You can omit locateFile completely when running in node
//   locateFile: file => `https://sql.js.org/dist/${file}`
// });


// type fileRow = Array<Array<any>>;

// const neededHeaders = [
//     "Country",

//     "Site Number",
//     "Site ID",

//     "Performed by",

//     "Subject Number",
//     "Patient Number",
//     "E Code"

// ];

// interface headerMappings {
//     "Country": number,
//     "Site ID": number,
//     "Performed By": number,
//     "Patient ID": number
// }


// function initalDataBaseLoad(db: SQL.Database, data: fileRow) {

//     const neededHeaders = [
//         "Country",

//         "Site Number",
//         "Site ID",

//         "Performed by",

//         "Subject Number",
//         "Patient Number",
//         "E Code"

//     ];

//     const headerMappings = {
//         "Country": -1,
//         "Site ID": -1,
//         "Performed By": -1,
//         "Patient ID": -1
//     }

//     for (let i = 0; i < data.length; i++) {
//         for (let j = 0; j < data[i].length; j++) {
//             if (neededHeaders.includes(data[i][j])) {
//                 switch (data[i][j]) {
//                     case "Country":
//                         headerMappings["Country"] = j;
//                         break;
//                     case "Site ID":
//                     case "Site Number":
//                         headerMappings["Site ID"] = j;
//                         break;
//                     case "Performed by":
//                         headerMappings["Performed By"] = j;
//                         break;
//                     case "Patient ID":
//                     case "Subject Number":
//                     case "Patient Number":
//                     case "E Code":
//                         headerMappings["Patient ID"] = j;
//                 }
//             }
//         }

//     }
// }


// export default function initDataBase(data:fileRow): SQL.Database {
//     const db = new SQL.Database();
//     db.serialize(() => {
//         db.run(`
//             CREATE TABLE IF NOT EXISTS ExcelData (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 country TEXT,
//                 siteID TXT,
//                 performedBy TEXT,
//                 patientID TEXT,
//             )`)
//     });
    
//     initalDataBaseLoad(db, data);

//     return db;
// }

// function passStatment(db: sqlite3.Database, statment: string) {
//     db.serialize(() => {
//         db.run(statment);
//     });
// }

// function queryStatment(db: sqlite3.Database, statment: string) {
//     db.serialize(() => {
//         db.all(statment, (err, rows) => {
//             if (err) {
//                 console.log(err);
//             }
//             console.log(rows);
//         });
//     });
// }


// const initSqlJs = require('sql.js');
// const SQL = await initSqlJs({
//   // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
//   // You can omit locateFile completely when running in node
//   locateFile: file => `https://sql.js.org/dist/${file}`
// });

export default function handler(req, res) {
    res.status(200).json({ name: 'John Doe' })
}