const express = require("express")
const Route = express.Router()

const cParkingLot = require("../controllers/cPrakingLot")

Route.post("/register", cParkingLot.register)
    .post("/exit", cParkingLot.exit)
    .post("/count-type", cParkingLot.countType)
    .post("/list-by-color", cParkingLot.listByColor)

module.exports = Route;