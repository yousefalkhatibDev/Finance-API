const pool = require("../helper/helper");
const common_function = require("../helper/common_functions");

module.exports = {
  Create_Profit_And_Loss_Statement: async (req, res) => {
    try {
      const {
        from,
        to,
        title,
        description,
        acounting_method,
        rounding,
        footer,
        show_accounts_codes,
        exclude_zero_balance,
      } = req.body;
      var data = {};

      var sqlQuery = `SELECT jea_type, sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'income' group by jea_type`;
      data.income = await pool.query(sqlQuery, [from, to]);

      sqlQuery = `SELECT jea_type, sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'expenses' group by jea_type`;
      data.expenses = await pool.query(sqlQuery, [from, to]);

      sqlQuery = `SELECT sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'income' or jea_super_group_type = 'expenses'`;
      data.total = await pool.query(sqlQuery, [from, to]);

      data.from = from;
      data.to = to;

      data.title = title;
      data.description = description;

      data.footer = footer;

      sqlQuery = `INSERT INTO profit_and_lose_statement_report (plr_id, plr_title, plr_description, plr_from, plr_to, plr_accounting_method, plr_rounding, plr_footer, plr_show_account_codes, plr_exclude_zero_balance) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.query(sqlQuery, [
        common_function.Generate_Id(),
        title,
        description,
        from,
        to,
        acounting_method,
        rounding,
        footer,
        show_accounts_codes,
        exclude_zero_balance,
      ]);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Get_Profit_And_Loss_Statement: async (req, res) => {
    try {
      const { plr_id } = req.body;
      var data = {};

      var sqlQuery = `SELECT * FROM profit_and_lose_statement_report WHERE plr_id=?`;
      const report = await pool.query(sqlQuery, [plr_id]);

      data.info = report;

      sqlQuery = `SELECT jea_type, sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'income' group by jea_type`;
      data.income = await pool.query(sqlQuery, [
        report[0].plr_from,
        report[0].plr_to,
      ]);

      sqlQuery = `SELECT jea_type, sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'expenses' group by jea_type`;
      data.expenses = await pool.query(sqlQuery, [
        report[0].plr_from,
        report[0].plr_to,
      ]);

      sqlQuery = `SELECT sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'income' or jea_super_group_type = 'expenses'`;
      data.total = await pool.query(sqlQuery, [
        report[0].plr_from,
        report[0].plr_to,
      ]);

      res.status(200).json({ data: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Create_Balance_Sheet: async (req, res) => {
    try {
      const {
        from,
        to,
        title,
        description,
        acounting_method,
        rounding,
        layout,
        footer,
        show_accounts_codes,
        exclude_zero_balance,
      } = req.body;
      var data = {};

      var sqlQuery = `SELECT jea_type, sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'assets' group by jea_type`;
      data.assets = await pool.query(sqlQuery, [from, to]);

      var sqlQuery = `SELECT jea_type, sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'liability' group by jea_type`;
      data.liability = await pool.query(sqlQuery, [from, to]);

      var sqlQuery = `SELECT jea_type, sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'equity' group by jea_type`;
      data.equity = await pool.query(sqlQuery, [from, to]);

      sqlQuery = `SELECT sum(jea_credit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'assets' OR jea_super_group_type = 'liability' or jea_super_group_type = 'equity'`;
      data.total = await pool.query(sqlQuery, [from, to]);

      data.from = from;
      data.to = to;

      sqlQuery = `INSERT INTO balance_sheet_report (bs_id, bs_title, bs_description, bs_from, bs_to, bs_accounting_method, bs_rounding, bs_layout, bs_footer, bs_show_account_codes, bs_exclude_zero_balance) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      await pool.query(sqlQuery, [
        common_function.Generate_Id(),
        title,
        description,
        from,
        to,
        acounting_method,
        rounding,
        footer,
        layout,
        show_accounts_codes,
        exclude_zero_balance,
      ]);

      res.status(200).json({ data: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Get_Balance_Sheet: async (req, res) => {
    try {
      const { bs_id } = req.body;
      var data = {};

      var sqlQuery = `SELECT * FROM balance_sheet_report WHERE bs_id=?`;
      const report = await pool.query(sqlQuery, [bs_id]);

      data.info = report;

      var sqlQuery = `SELECT jea_type, sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'assets' group by jea_type`;
      data.assets = await pool.query(sqlQuery, [
        report[0].bs_from,
        report[0].bs_to,
      ]);

      var sqlQuery = `SELECT jea_type, sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'liability' group by jea_type`;
      data.liability = await pool.query(sqlQuery, [
        report[0].bs_from,
        report[0].bs_to,
      ]);

      var sqlQuery = `SELECT jea_type, sum(jea_credit - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'equity' group by jea_type`;
      data.equity = await pool.query(sqlQuery, [
        report[0].bs_from,
        report[0].bs_to,
      ]);

      sqlQuery = `SELECT sum(jea_credit  - jea_debit) FROM journal_entries_accounts WHERE jea_date BETWEEN ? AND ? ANd jea_super_group_type = 'assets' OR jea_super_group_type = 'liability' or jea_super_group_type = 'equity'`;
      data.total = await pool.query(sqlQuery, [
        report[0].bs_from,
        report[0].bs_to,
      ]);

      res.status(200).json({ data: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // profit_and_loss_statement_actual_vs_budget: async (req, res) => {},

  // statement_of_changes_in_equity: async (req, res) => {},

  // trial_balance: async (req, res) => {
  //   try {
  //     const { from, to } = req.body;
  //     var data = {};

  //     res.status(200).json({ data: data });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },

  // general_ledger_summary: async (req, res) => {},

  // general_ledger_transactions: async (req, res) => {
  //   try {
  //     const { from, to } = req.body;
  //     var data = {};

  //     const sqlQuery = `SELECT * FROM journal_entries WHERE jea_date BETWEEN ? AND ? ANd jea_type = 'asset' or jea_type = 'liability'`;
  //     const journal_entries = await pool.query(sqlQuery, [from, to]);

  //     res.status(200).json({ data: journal_entries });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // },
};
