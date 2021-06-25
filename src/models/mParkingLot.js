const fs = require("fs")
let path = require("path")
const parkingLotDb = path.join(__dirname, "..", "dataStorage", "parkingLot.json")
const historyParkingLotDb = path.join(__dirname, "..", "dataStorage", "historyParkingLot.json")

module.exports = {
    saveData: (data) => {
        // const stringifyData = JSON.stringify(data)
        // fs.writeFileSync(parkingLotDb, stringifyData)
        return new Promise((resolve, reject) => {
            const stringifyData = JSON.stringify(data)
            fs.writeFile(parkingLotDb, stringifyData, err => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    },
    readData: () => {
        // const jsonData = fs.readFileSync(parkingLotDb)
        // return JSON.parse(jsonData)
        return new Promise((resolve, reject) => {
            fs.readFile(parkingLotDb, 'utf8', (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    },
    saveHistory: (data) => {
        // const stringifyData = JSON.stringify(data)
        // fs.writeFileSync(parkingLotDb, stringifyData)
        return new Promise((resolve, reject) => {
            const stringifyData = JSON.stringify(data)
            fs.writeFile(historyParkingLotDb, stringifyData, err => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    },
    readHistory: () => {
        // const jsonData = fs.readFileSync(parkingLotDb)
        // return JSON.parse(jsonData)
        return new Promise((resolve, reject) => {
            fs.readFile(historyParkingLotDb, 'utf8', (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    }
}