const express = require("express");
const cds = require("@sap/cds");
const odatav2proxy = require("@sap/cds-odata-v2-adapter-proxy");
require('dotenv').config()

const { PORT = 5007 } = process.env
const app = express()

//With below line all cds services can consumed as express serveices
cds.serve("all").in(app)

//convert Odata4 to Odata2 with below line
app.use(odatav2proxy({ path: "v2", port: PORT }))

//Generate a local server "http://localhost" running on port 5007
app.listen(PORT, () => console.info(`server listening on http://localhost:${PORT}`))
