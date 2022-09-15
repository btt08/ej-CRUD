const client = require('../modules/postgresDB')

const getAllProducts = async () => {
  const query = 'SELECT p.id, p.name AS brand, price, color, m.name AS Manufacturer, p.cif AS cif, addres AS Address FROM public.products p JOIN public.manufacturers m ON m.cif = p.cif;';
  return await client.query(query);
};

const filterProducts = async (brand, color, price, manufacturer) => {
  const query = `SELECT p.id, p.name AS brand, price, color, m.name AS Manufacturer, p.cif AS cif, addres AS Address FROM products p JOIN manufacturers m ON m.cif = p.cif WHERE p.name LIKE '%${brand ? brand.toUpperCase() : ''}%' AND p.color LIKE '%${color ?? ''}%' ${price ? `AND p.price < ${price} ` : ''} AND p.cif LIKE '%${manufacturer ?? ''}%'`;
  return await client.query(query);
};

const getCarById = async (id) => {
  const query = `SELECT id, name AS brand, price, color, cif FROM products WHERE id = ${id}`;
  return await client.query(query);
};

const updateCar = async ({ id, brand, color, price, cif }) => {
  const query = `UPDATE products SET name=$1, color=$2, price=$3, cif=$4 WHERE id = $5`;
  const values = [brand, color, price, cif, id];
  try {
    return await client.query(query, values);
  } catch (error) {
    console.log(error)
  }
};

const insertCar = async ({ id, brand, color, price, cif }) => {
  const query = "INSERT INTO products (id, name, color, price, cif) VALUES ($1, $2, $3, $4, $5)";
  const values = [id, brand, color, price, cif];
  try {
    return await client.query(query, values);
  } catch (error) {
    console.log(error);
  }
};

const getMaxId = async () => {
  const query = "SELECT MAX(id) FROM products"
  return await client.query(query);
};

const deleteCar = async (id) => {
  const query = `DELETE FROM products WHERE id = ${id};`;
  return await client.query(query);
};

module.exports = {
  getAllProducts,
  filterProducts,
  getCarById,
  updateCar,
  insertCar,
  deleteCar,
  getMaxId
};