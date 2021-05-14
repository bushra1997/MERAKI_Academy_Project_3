const port = 5000;
const express = require("express");
const app = express();

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})