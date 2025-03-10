const express = require("express");
const app = express()

app.use(express.static(__dirname))
const port = 8000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(port || 8000, () => {
    console.log("Listening on port " + port)
})