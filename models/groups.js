const pool = require("../helper/helper");

module.exports = {
  get: async (req, res) => {},

  insert: async (req, res) => {},

  update_sum: async (req, res, id, value) => {
    try {
      console.log(id, value);
      // update the sum of the group
      const sqlQuery = "UPDATE groups SET g_sum = g_sum + ? WHERE g_id = ?";
      const result = await pool.query(sqlQuery, [value, id]);
      console.log(result);
      
      res.status(200).json({ data: true });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {},
};
