const products = require('./modules/products');
const manufacturers = require('./modules/manufacturers');

const client = require('./modules/postgresDB');

const createBBDD = async () => {

  const queryCreateProductsTable = 'CREATE TABLE concesionario.public.manufacturers( cif text NOT NULL, name text NOT NULL, addres text NOT NULL, PRIMARY KEY (cif) );'

  const queryCreateManufacturersTable = 'CREATE TABLE concesionario.public.products( id bigint NOT NULL, name text, cif text, price bigint, color text, PRIMARY KEY (id), FOREIGN KEY (cif) REFERENCES concesionario.public.manufacturers (cif) );'

  try {
    await client.query(`${queryCreateProductsTable} ${queryCreateManufacturersTable}`);

    let values = '';

    manufacturers.forEach(async manufacturer => {
      values += `( '${manufacturer.cif}', '${manufacturer.name}', '${manufacturer.address}' ),`;
    })

    values = values.substring(0, values.length - 1);

    const queryCreateManufacturers = `INSERT INTO public.manufacturers
        (cif, name, addres) VALUES ${values};`

    console.log('QUERY PARA INSERTAR FABRICANTES', queryCreateManufacturers)

    let idProduct = 0;
    values = '';
    products.forEach(async product => {
      idProduct++;
      values += `(${idProduct}, '${product.name}','${product.manufacturer}',${product.price},'${product.color}'),`;
    })

    values = values.substring(0, values.length - 1);

    const queryCreateProducts = `INSERT INTO public.products(
            id, name, cif, price, color)
            VALUES ${values};`

    console.log('QUERY PARA INSERTAR PRODUCTOS', queryCreateProducts)

    await client.query(`${queryCreateManufacturers} ${queryCreateProducts}`);

    console.log('TABLAS CREADAS CON ÉXITO');
  } catch (e) {
    console.log('ERROR', e)
  }
  await client.end();
}

createBBDD();