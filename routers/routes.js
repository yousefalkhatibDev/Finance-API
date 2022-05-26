const express = require("express");
const router = express.Router();
const Journal_Entries = require("../models/Journal_Entries");
const Groups = require("../models/groups");
const Reports = require("../models/reports");

router.post("/test-heroku", (req, res) => {
  res.send("worked");
})

// Journal entries

// Get all journal entries
router.post("/get_journal_entries", (req, res) => {
  Journal_Entries.Get_Journal_Entrie_By_User(req, res);
});

// Create a new journal entry
router.post("/create_journal_entries", (req, res) => {
  Journal_Entries.Create_Journal_Entrie(req, res);
});

// Update a journal entry
router.post("/update_journal_entries", (req, res) => {
  Journal_Entries.Update_Journal_Entrie(req, res);
});

// Delete a journal entry
router.post("/delete_journal_entries", (req, res) => {
  Journal_Entries.Delete_Journal_Entrie(req, res);
});

// Groups

// Get all groups
router.post("/get_groups", (req, res) => {
  Groups.Get_Group_By_user(req, res);
});

// Create a new group
router.post("/create_group", (req, res) => {
  Groups.Create_Group(req, res);
});

// // Update a group
// router.post("/update_group_sum", (req, res) => {
//   Groups.Update_Group_Sum(req, res);
// });

// Delete a group
router.post("/delete_group", (req, res) => {
  Groups.Delete_Group(req, res);
});

// Reports

// Create profit and loss statement report
router.post("/create_profit_and_loss_statement", (req, res) => {
  Reports.Create_Profit_And_Loss_Statement(req, res);
});

// Get profit and loss statement report
router.post("/get_profit_and_loss_statement", (req, res) => {
  Reports.Get_Profit_And_Loss_Statement(req, res);
});

// Create balance sheet report
router.post("/create_balance_sheet", (req, res) => {
  Reports.Create_Balance_Sheet(req, res);
});

// Get balance sheet report
router.post("/get_balance_sheet", (req, res) => {
  Reports.Get_Balance_Sheet(req, res);
});

module.exports = router;
