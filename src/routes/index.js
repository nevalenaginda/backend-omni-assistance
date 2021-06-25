const express = require("express")
const Route = express.Router()

const rParking = require("./rParking")

Route.use("/parking", rParking)

module.exports = Route