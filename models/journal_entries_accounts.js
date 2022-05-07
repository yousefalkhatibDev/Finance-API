const pool = require("../helper/helper");
const common_functiions = require("../helper/common_functions");
const groups = require("../models/groups");

module.exports = {
  Insert: async (req, res, je_id, je_accounts) => {
    for (let i = 0; i < je_accounts.length; i++) {
      const jea_id = common_functiions.generateId().substring(0,10); // generate id

      // insert data in the journal entries accounts table
      const sqlQuery = "INSERT INTO journal_entries_accounts (jea_id, jea_journal_entrie, jea_description, jea_credit, jea_debit) VALUES (?,?,?,?,?)";
      const result = await pool.query(sqlQuery, [
        jea_id,
        je_id,
        je_accounts[i].jea_description,
        je_accounts[i].jea_credit,
        je_accounts[i].jea_debit
      ]);

      if (result.affectedRows) {
        var value = je_accounts[i].jea_credit - je_accounts[i].jea_debit;

        // update the sum of the group
        groups.Update_Group_Sum(req, res, je_accounts[i].jea_super_group, value);
      } else {
        res.status(500).json({ error: "Error inserting data in journal entries accounts table" });
      }
    }
  },

  Update: async (req, res) => {},

  Delete: async (req, res) => {},
}