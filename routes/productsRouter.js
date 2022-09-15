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
});


router.get('/car/:id', async (req, res, next) => {
  try {
    const result = await products.getCarById(req.params.id);
    res.json(result.rows[0]).status(200).end();
  } catch (error) {
    next(error)
  }
});

router.patch('/update', async (req, res, next) => {
  try {
    const result = await products.updateCar(req.body);
    res.json(result).status(200).end();
  } catch (error) {
    next(error);
  }
});

router.get('/manufacturers', async (req, res, next) => {
  try {
    const result = await getAllManufacturers();
    checkResultLength(result.rows, res);
  } catch (err) {
    next(err);
  }
});

router.get('/ids', async (req, res, next) => {
  try {
    const result = await products.getMaxId();
    res.json(result.rows[0].max).status(200).end();
  } catch (error) {
    next(error);
  }
});

router.post('/insert', async (req, res, next) => {
  try {
    const result = await products.insertCar(req.body);
    res.json(result).status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    await products.deleteCar(req.params.id);
    res.status(200).end();
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