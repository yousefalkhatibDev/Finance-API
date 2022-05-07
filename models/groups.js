const pool = require("../helper/helper");
const common_functions = require("../helper/common_functions");

async function Get_Group_Info(g_id) {
  try {
    var data = {
      group_data: [],
      group_accounts: [],
      sub_groups: [],
    };

    var sqlQuery = "SELECT * FROM groups WHERE g_id=?"; // get the group info
    var group = await pool.query(sqlQuery, g_id);

    if (group.length > 0) {
      data.group_data = group; // add the group info to the data object

      var sqlQuery = "SELECT * FROM accounts WHERE a_group=?"; // get the accounts of the group
      var accounts = await pool.query(sqlQuery, g_id);
      data.group_accounts = accounts; // add the accounts of the group to the data object

      var sqlQuery = "SELECT * FROM groups WHERE g_super_group=?"; // get the sub_groups of the group
      var sub_groups = await pool.query(sqlQuery, g_id);
      data.sub_groups = sub_groups; // add the sub_groups of the group to the data object

      if (sub_groups.length > 0) {
        for (let i = 0; i < sub_groups.length; i++) {
          sub_groups[i] = Get_Group_Info(sub_groups[i].g_id); // implement the recursive function to get the sub_groups of the sub_groups
        }
      }
    }

    return data; // return the group info
  } catch (error) {
    return error.message; // return the error message
  }
}

module.exports = {
  Get_Group_By_user: async (req, res) => {
    try {
      const { g_user } = req.body; // get data from the request
      var data = {};

      var sqlQuery = "SELECT * FROM groups WHERE g_user=?";
      var groups = await pool.query(sqlQuery, g_user);

      if (groups.length > 0) {
        for (let i = 0; i < groups.length; i++) {
          const info = Get_Group_Info(groups[i].g_id); // get the group info
          data[groups[i].g_id] = await info; // add the group info to the data object
        }
      }

      console.log(data);

      res.status(200).json({ data: data }); // send the data back to the client
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Create_Group: async (req, res) => {
    try {
      const { g_user, g_name, g_sum, g_super_group, g_deletable } = req.body; // get data from the request
      const g_id = common_functions.generateId().substring(0, 10); // generate id

      // insert data in the groups table
      const sqlQuery =
        "INSERT INTO groups (g_id, g_user, g_name, g_sum, g_super_group, g_deletable) VALUES (?,?,?,?,?,?)";
      const data = await pool.query(sqlQuery, [
        g_id,
        g_user,
        g_name,
        g_sum,
        g_super_group,
        g_deletable,
      ]);

      // data response must be one of the following: { affectedRows: 1, insertId: 0n, warningStatus: 0 }

      // if the data inserted
      if (data.affectedRows) {
        res.status(200).json({ data: true }); // send the data back to the client
      } else {
        res.status(500).json({ error: "Error inserting data in groups table" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Update_Group_Sum: async (req, res) => {
    try {
      const { g_id, value } = req.body; // get data from the request

      // update the sum of the group
      const sqlQuery = "UPDATE groups SET g_sum = g_sum + ? WHERE g_id = ?";
      const data = await pool.query(sqlQuery, [value, g_id]);

      res.status(200).json({ data: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  Delete_Group: async (req, res) => {
    try {
      const { g_id } = req.body; // get data from the request

      // delete the group
      var sqlQuery = "DELETE FROM groups WHERE g_id = ?";
      var data = await pool.query(sqlQuery, [g_id]); // result response must be one of the following: { affectedRows: 1, insertId: 0n, warningStatus: 0 }

      if (data.affectedRows) {
        sqlQuery = "DELETE FROM groups_accounts WHERE ga_group = ?";
      } else {
        res.status(500).json({ error: "Error deleting group" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
