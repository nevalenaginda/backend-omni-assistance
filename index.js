require("dotenv").config();

//PORT & HOST
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

//PACKAGE
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

//ROUTER
const indexRoute = require("./src/routes")

//INITIALIZATION EXPRESS
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use(morgan("dev"))
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Server aktif",
    });
})

app.use("/api/v1", indexRoute)

app.use("/*", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "URL tidak ditemukan",
    });
})

app.listen(PORT, () => {
    console.log(`Server aktif di http://${HOST}:${PORT}`);
})