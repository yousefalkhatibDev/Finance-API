const pool = require("../helper/helper");
const common_functiions = require("../helper/common_functions");
const journal_entries_accounts = require("../models/journal_entries_accounts");

module.exports = {
  Get: async (req, res) => {
    try {
      const { id } = req.body; // get data

      // get data from journal entries table
      const sqlQuery = "SELECT * FROM journal_entries WHERE je_id=?";
      const result = await pool.query(sqlQuery, id);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Insert: async (req, res) => {
    try {
      const { je_user, je_credit, je_debit, je_reference, je_narration, je_date, je_balanced, je_accounts } = req.body; // get data
      const je_id = common_functiions.generateId().substring(0,10); // generate id

      // insert data in the journal entries table
      const sqlQuery = "INSERT INTO journal_entries (je_id, je_user, je_credit, je_debit, je_reference, je_narration, je_date, je_balanced) VALUES (?,?,?,?,?,?,?,?)";
      const result = await pool.query(sqlQuery, [
        je_id,
        je_user,
        je_credit,
        je_debit,
        je_reference,
        je_narration,
        je_date,
        je_balanced
      ]);
      
      // result response must be one of the following: { affectedRows: 1, insertId: 0n, warningStatus: 0 }

      // if the data inserted
      if (result.affectedRows) {
        // insert data in the journal entries accounts table
        journal_entries_accounts.Insert(req, res, je_id, je_accounts);
      } else {
        res.status(500).json({ error: "Error inserting data in journal entries table" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Update_narration: async (req, res) => {
    try {
      const { id, text } = req.body; // get data

      // update data in the journal entries table;
      const sqlQuery = "UPDATE journal_entries SET je_narration = ? WHERE je_id = ?";
      const result = await pool.query(sqlQuery, [text, id]);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Delete: async (req, res) => {
    try {
      const { id } = req.body; // get data

      // insert data in the journal entries table
      const sqlQuery = "DELETE FROM journal_entries WHERE je_id = ?";
      const result = await pool.query(sqlQuery, id);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  info: async (req, res) => {}
};
