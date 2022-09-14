const client = require('../modules/postgresDB')

const getAllProducts = async () => {
  const query = 'SELECT p.id, p.name AS brand, price, color, m.name AS Manufacturer, p.cif AS cif, addres AS Address FROM public.products p JOIN public.manufacturers m ON m.cif = p.cif;';
  return await client.query(query);
};

const filterProducts = async (brand, color, price, manufacturer) => {
  const query = `SELECT p.name AS brand, price, color, m.name AS Manufacturer, p.cif AS cif, addres AS Address FROM products p JOIN manufacturers m ON m.cif = p.cif WHERE p.name LIKE '%${brand ? brand.toUpperCase() : ''}%' AND p.color LIKE '%${color ?? ''}%' ${price ? `AND p.price < ${price} ` : ''} AND p.cif LIKE '%${manufacturer ?? ''}%'`;
  return await client.query(query);
};

const deleteCar = async (id) => {
  const query = `DELETE FROM public.products WHERE id = ${id};`;
  return await client.query(query);
};

module.exports = {
  getAllProducts,
  filterProducts,
  deleteCar
};