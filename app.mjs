import express from "express";
import cors from "cors";
//const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
import salesforceLogin from "./src/salesforce/salesforceLogin.mjs";

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.get("*", async (req, res) => {
  const salesforceLoginVar = await salesforceLogin();
  console.log("salesforceLoginVar" + salesforceLoginVar.salesforceAccessToken);
  res.send({
    message: "Hi, this is the paypal webhook, welcome developer :)",
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
