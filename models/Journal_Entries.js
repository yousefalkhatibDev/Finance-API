const pool = require("../helper/helper");
const common_functiions = require("../helper/common_functions");
const journal_entries_accounts = require("../models/journal_entries_accounts");

module.exports = {
  Get_Journal_Entrie_By_User: async (req, res) => {
    try {
      const { je_id: je_user } = req.body; // get data from the request
      var data = {}; // create an empty object

      // get data from journal entries table
      var sqlQuery = "SELECT * FROM journal_entries WHERE je_user=?";
      const journal_entries = await pool.query(sqlQuery, je_user);

      if (journal_entries.length > 0) {
        for (let i = 0; i < journal_entries.length; i++) {
          data.journal_entrie = this.Get_Journal_Entrie_Info(journal_entries[i].je_id);
        }
      }

      res.status(200).json({ data: data }); // send the data back to the client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Create_Journal_Entrie: async (req, res) => {
    try {
      const {
        je_user,
        je_credit,
        je_debit,
        je_reference,
        je_narration,
        je_date,
        je_balanced,
        je_accounts,
      } = req.body; // get data from the request
      const je_id = common_functiions.generateId().substring(0, 10); // generate id

      // insert data in the journal entries table
      const sqlQuery =
        "INSERT INTO journal_entries (je_id, je_user, je_credit, je_debit, je_reference, je_narration, je_date, je_balanced) VALUES (?,?,?,?,?,?,?,?)";
      const data = await pool.query(sqlQuery, [
        je_id,
        je_user,
        je_credit,
        je_debit,
        je_reference,
        je_narration,
        je_date,
        je_balanced,
      ]);

      // result response must be one of the following: { affectedRows: 1, insertId: 0n, warningStatus: 0 }

      // if the data inserted
      if (data.affectedRows) {
        // insert data in the journal entries accounts table
        journal_entries_accounts.Insert(req, res, je_id, je_accounts);
      } else {
        res
          .status(500)
          .json({ error: "Error inserting data in journal entries table" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Update_Journal_Entrie_Narration: async (req, res) => {
    try {
      const { je_id, je_text } = req.body; // get data from the request

      // update data in the journal entries table;
      const sqlQuery =
        "UPDATE journal_entries SET je_narration = ? WHERE je_id = ?";
      const data = await pool.query(sqlQuery, [je_text, je_id]);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Delete_Journal_Entrie: async (req, res) => {
    try {
      const { je_id } = req.body; // get data from the request

      // insert data in the journal entries table
      var sqlQuery = "DELETE FROM journal_entries WHERE je_id = ?";
      var data = await pool.query(sqlQuery, je_id);

      if (data.affectedRows) {
        sqlQuery =
          "DELETE FROM journal_entries_accounts WHERE jea_journal_entrie = ?";
        data = await pool.query(sqlQuery, je_id);

        if (data.affectedRows) {
          res.status(200).json({ data: true });
        } else {
          res
            .status(500)
            .json({
              error: "Error deleting data in journal entries accounts table",
            });
        }
      } else {
        res
          .status(500)
          .json({ error: "Error deleting data in journal entries table" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Get_Journal_Entrie_Info: async (je_id) => {
    try {
      var data = {}; // create an empty object

      // get data from journal entries table
      var sqlQuery = "SELECT * FROM journal_entries WHERE je_id=?";
      const journal_entrie = await pool.query(sqlQuery, je_id);

      var sqlQuery =
        "SELECT * FROM journal_entries_accounts WHERE jea_journal_entrie=?";
      const journal_entrie_accounts = await pool.query(sqlQuery, je_id);

      data.journal_entrie = journal_entrie; // get data from journal entries table
      data.journal_entrie_accounts = journal_entrie_accounts; // get data from journal entries accounts table

      return data; // return the data
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
