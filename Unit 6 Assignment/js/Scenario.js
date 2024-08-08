//Scenario.js
var dressingRoom = require('./DressingRoom.js');
var customer = require('./Customer.js');
const { Worker } = require('worker_threads')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//Get the user input
readline.question('What ClothingItems value do you want? (0 = random) ', (items) => {
    readline.question("How many customers do you want? ", (customers) => {
        readline.question("How many dressing rooms do you want? ", (rooms) => {
            console.log(`${items} items entered and ${customers} customers entered and ${rooms} rooms entered`);
            readline.close();

            var count = 0;
            var totalWaitTime = 0;
            var totalRunTime = 0;
            var runTime = 0;
            var totalNumberOfItems = 0;

            //Loop through the customers and start worker threads.
            for (var i = 0; i < customers; i++) {
                //Set up asynchronous operations
                customerName = "Customer" + (i + 1);
                customer.setNumberOfItems(`${items}`);
                var numberOfCustomerItems = customer.getNumberOfItems();
                totalNumberOfItems = totalNumberOfItems + numberOfCustomerItems;

                var roomWaitTime = dressingRoom.RequestRoom();

                //Asynchronously run functions
                function runService(workerData) {
                    if (i < `${rooms}`) {
                        var waitTime = 0;
                        runTime = numberOfCustomerItems * roomWaitTime;
                        console.log(customerName + " changed in the dressing room.");
                    }
                    else {
                        var waitTime = roomWaitTime;
                        console.log(`${waitTime} wait time determined and ${numberOfCustomerItems} customer items determined`);
                        console.log(customerName + " waiting for dressing room.");
                        wait(waitTime * 10);
                    }
                    totalRunTime = runTime + totalRunTime;
                    var adjustedWaitTime = waitTime *
                        numberOfCustomerItems;
                    totalWaitTime = adjustedWaitTime + totalWaitTime;
                    if (count == rooms) {
                        wait(adjustedWaitTime * 10);
                        console.log(customerName + " changed in the dressing room.");
                        count = 0;
                    }
                    return new Promise((resolve, reject) => {
                        const worker = new Worker('./Customer.js',
                            { workerData });
                        worker.on('message', resolve);
                        worker.on('error', reject);
                        worker.on('exit', (code) => {
                            if (code !== 0)
                                reject(new Error(`Worker stopped with exit code ${code}`));
                        });
                    });
                }
                //Call the runService function using worker threads
                async function run() {
                    const result = await runService('Running worker threads');
                    wait(100);
                    console.log(result);
                }
                //Run the async operations
                run().catch(err => console.error(err));
                //Increment the counter
                count = count + 1;
            }
            //Get the final number of customers and avergae items, run and wait time.
            console.log("There were " + customers + " customers total");
            console.log(totalRunTime / customers + " milliseconds average run time.");
            console.log(totalWaitTime / customers + " milliseconds average wait time.");
            console.log("There were " + totalNumberOfItems / customers + " items on average");
        })
    })
})
//Wait function based on millisecond input
function wait(ms) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while (d2 - d < ms);
}