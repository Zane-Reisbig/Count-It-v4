
import words from "./words";


export default function splitFirst(string) {
    // Splits the TextArea at new lines and removes whitespace
    // Calls the countRepeats method

    let myArray = string
        .split(";")
        .map((item) => item.trim())
        .join("\n");


    return countRepeats(myArray);
}

function countRepeats(array) {

    // Counts the number of times a word is repeated in the second split textarea
    let finalCount = [];
    const items = array.split("\n");
    // Loops through the items
    // Checks if the word is already in the final Count array
    // Creates a new object with the word and the number of times it is repeated
    // Sets the values of the new object
    // Pushes the new object to the finalCount array

    items.forEach((item) => {
        if (!finalCount.find((o) => o.word === item) && item != "" && item != " ") {
            let newOb = { word: null, count: null, assoc: "No Assoc\n" };
            newOb.word = item;

            // @ts-ignore
            newOb.count = 0;
            finalCount.push(newOb);
        }
    });


    // Loops through the items array
    // Loops through the finalCount array
    // Checks the finalItem.word against the item
    // If found increments the finalItem.count
    // If there is no associated word ->
    // Loops through the words array
    // Checks if the word is the same as the finalItem.word
    // If found sets the finalItem.assoc to the word
    items.forEach((item) => {
        finalCount.forEach((finalItem) => {
            if (finalItem.word === item) {
                finalItem.count++;
                if (finalItem.assoc === "No Assoc\n") {
                    words().forEach((element) => {
                        if (element.word === item) {
                            finalItem.assoc = element.assoc + "\n";
                        }
                    });
                }
            }
        });
    });
    finalCount.pop(); // remove last item it is empty
    // Sorts the finalCount array by word count
    finalCount.sort((a, b) => {
        return b.count - a.count;
    });
    // Loops through the finalCount array
    // Counts the associated words
    let assocCount = [];
    let assocObjects = [];
    finalCount.forEach((item) => {
        let returnValue = "";
        let foundIndex = -1;
        let itemObj = { assoc: null, count: null };

        assocCount.forEach((item2) => {
            if (item2.split(",")[0] + "\n" == item.assoc) {
                foundIndex = assocCount.indexOf(item2);
            }
        });
        if (foundIndex != -1) {
            let newNumber = assocCount[foundIndex]
                .split(",")
                .map((i) => i.trim());
            newNumber = parseInt(newNumber[1]) + item.count;
            assocCount[foundIndex] = `${item.assoc.replace(
                "\n",
                ""
            )}, ${newNumber}`;

            itemObj.assoc = item.assoc.replace("\n", "");
            itemObj.count = newNumber;

            assocObjects.push(itemObj);

        } else {
            try {

                itemObj.assoc = item.assoc.replace("\n", "");
                itemObj.count = item.count;

                assocObjects.push(itemObj);

            } catch (error) {
                itemObj.assoc = item.assoc.replace("\n", "");
                itemObj.count = item.count;

                assocObjects.push(itemObj);
            }
            assocCount.push(returnValue);
        }
    });
    // Clean the list one last time
    // assocCount.map((item) => item.replace("\n", "") || item);
    // Sets the resultArea and assocResultArea to the finalCount array

    // @ts-ignore
    return { finalCount: finalCount, associationTotals: assocObjects };

}

function objToString(obj) {
    // Converts the obj to a string
    // Formats it for output
    let str = "";
    obj.forEach((item) => {
        try {
            return (str +=
                item.word.replace(",", ";") +
                ", " +
                item.count +
                ", " +
                item.assoc.replace(",", ";"));
        } catch (error) {
            return (str += item.word + ", " + item.count + ", " + item.assoc);
        }
    });
    return str;
}
