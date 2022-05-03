const express = require("express");
const router = express.Router();
const pool = require("../helper/helper");
const Journal_Entries = require("../models/Journal_Entries");

// journal_entries

router.post("/get_journal_entries", (req, res) => {
  Journal_Entries.Get(req, res);
});

router.post("/insert_journal_entries", (req, res) => {
  Journal_Entries.Insert(req, res);
});

router.post("/update_journal_entries", (req, res) => {
  Journal_Entries.Update(req, res);
});

router.post("/delete_journal_entries", (req, res) => {
  Journal_Entries.Delete(req, res);
});

app.get("/test", (_req, res) =>  {
  res.status(200).send("Hello world")
})

module.exports = router;
