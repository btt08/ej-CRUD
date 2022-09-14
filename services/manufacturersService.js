const client = require('../modules/postgresDB');

const getAllManufacturers = async () => {
  const query = "SELECT * FROM manufacturers";
  return await client.query(query);
}

module.exports = getAllManufacturers;