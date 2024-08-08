// Customer.js
const { workerData, parentPort } = require('worker_threads')
var NumberOfItems;
module.exports = {
    //Return the number of items
    getNumberOfItems: function () {
        return NumberOfItems;
    },

    setNumberOfItems: function (controlNumber) {
        if (controlNumber == 0) {
            NumberOfItems = GenerateRandomCustomerItems(20);
        }
        else {
            NumberOfItems = controlNumber;
        }
    }
}
function GenerateRandomCustomerItems(highValue) {
    return Math.ceil(Math.random() * highValue)
}
//parentPort.postMessage({ Action: workerData })