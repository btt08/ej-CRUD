const router = require('express').Router();
const products = require('../services/productsService');
const getAllManufacturers = require('../services/manufacturersService');

router.get('/all', async (req, res, next) => {
  try {
    const result = await products.getAllProducts();
    checkResultLength(result.rows, res);
  } catch (err) {
    next(err);
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const result = await products.filterProducts(req?.body?.brand, req?.body?.color, req?.body?.price, req?.body?.manufacturer);
    checkResultLength(result.rows, res);
  } catch (error) {
    next(error)
  }
})

router.get('/manufacturers', async (req, res, next) => {
  try {
    const result = await getAllManufacturers();
    checkResultLength(result.rows, res);
  } catch (err) {
    next(err);
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    const result = await products.deleteCar(req.params.id);
  } catch (error) {
    console.error(error);
  }
})

function checkResultLength(result, res) {
  result.length > 0
    ? res.json({ result }).status(200).end()
    : res.json({ error: 'No existen resultados' }).status(404).end();
}

module.exports = router;