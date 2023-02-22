export function textCleaner(text: string): Array<string> {
// Example:
// "Poor start of effort, late time to peak flow (FEV1); Maneuver was not started from TLC, FIVC is greater than FVC (FEV1 and FVC).; Maneuver was not started from TLC, FIVC is greater than FVC (FEV1 and FVC)."

    let splitText = text.split(';');
    let cleanText = splitText.map((item) => {
        return item.trim();
    });

    return cleanText;
}

export function createRepeatsObject(array:Array<Array<string>>, currentObject: any): any {
    let internalOb = currentObject;

    array.forEach((item) => {
        item.forEach((subItem) => {
            if (subItem in internalOb) {
                internalOb[subItem]++;
            } else {
                internalOb[subItem] = 1;
            }
        });

    });

    return internalOb;

}

export function makeAssociations(
    assocObjArray: Array<{ word: string, assoc: string }>,
    checkWordAndCountArray: Array<[string, number]>
): Array<[string, number]> {

    let internalObject = {};
    let internalArray = [];
    
    checkWordAndCountArray.forEach((item) => {
        let assocFound = false;
        assocObjArray.forEach((subItem) => {
            if (item[0] === subItem.word) {
                assocFound = true;

                if (subItem.assoc in internalObject) {
                    internalObject[subItem.assoc] += item[1];
                } else {
                    internalObject[subItem.assoc] = item[1];
                }
            }
        });

        if (!assocFound) {
            if ("No Assoc" in internalObject) {
                internalObject["No Assoc"] += item[1];
            } else {
                internalObject["No Assoc"] = item[1];
            }
        }
    });

    for (let key in internalObject) {
        internalArray.push([key, internalObject[key]]);
    }


    return internalArray;

}