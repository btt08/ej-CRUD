getAllCars();
getAllManufacturers();

document.getElementById('btn-search').addEventListener('click', async (e) => {
  e.preventDefault();
  getSearchCars();
});

document.getElementById('select-manufacturers').addEventListener('change', async (e) => {
  getSearchCars();
});

async function getSearchCars() {
  const brand = document.getElementById('input-brand').value || null;
  const color = document.getElementById('input-color').value || null;
  const price = document.getElementById('input-price').value || null;
  const manufacturer = document.getElementById('select-manufacturers').value || null;
  if (brand || color || price || manufacturer) {
    const obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ brand, color, price, manufacturer })
    }
    const response = await fetch(
      `http://localhost:3000/products/search`, obj);
    const data = await response.json();
    printCars(data);
  } else {
    getAllCars();
  }
}

async function getAllCars() {
  const response = await fetch(
    `http://localhost:3000/products/all`);
  const data = await response.json();
  printCars(data);
}

async function getAllManufacturers() {
  const response = await fetch(`http://localhost:3000/products/manufacturers`);
  const data = await response.json();
  const elemManufacturers = document.getElementById('select-manufacturers');
  if (!data.error)
    for (let i = 0; i < data.result.length; i++) {
      const manufacturer = data.result[i];
      elemManufacturers.appendChild(new Option(manufacturer.name, manufacturer.cif));
    }
}

function printCars(data) {
  const elemContent = document.getElementById('cars');
  elemContent.innerHTML = '';
  if (data.error) elemContent.innerHTML = data.error;
  else {
    for (let i = 0; i < data.result.length; i++) {
      const car = data.result[i];

      const newDiv = document.createElement('article');
      newDiv.classList.add('card');
      newDiv.setAttribute('data-id', car.id);

      const carName = document.createElement('p');
      carName.classList.add('carName');
      carName.innerText = car.brand;

      const img = document.createElement('img');
      img.classList.add('car-img');
      img.setAttribute('src', './img/NA.jpg');

      const details = document.createElement('div');
      details.classList.add('details');

      const spanLabelManufacturer = document.createElement('span');
      spanLabelManufacturer.classList.add('label');
      spanLabelManufacturer.innerText = "Fabricante";

      const spanValueManufacturer = document.createElement('span');
      spanValueManufacturer.classList.add('dataNumber');
      spanValueManufacturer.innerText = car.manufacturer;

      const spanLabelCif = document.createElement('span');
      spanLabelCif.classList.add('label');
      spanLabelCif.innerText = "CIF";

      const spanValueCif = document.createElement('span');
      spanValueCif.classList.add('dataNumber');
      spanValueCif.innerText = car.cif;

      const spanLabelColor = document.createElement('span');
      spanLabelColor.classList.add('label');
      spanLabelColor.innerText = "Color";

      const spanValueColor = document.createElement('span');
      spanValueColor.classList.add('dataNumber');
      spanValueColor.innerText = car.color;

      const spanLabelPrice = document.createElement('span');
      spanLabelPrice.classList.add('label');
      spanLabelPrice.innerText = "Precio";

      const spanValuePrice = document.createElement('span');
      spanValuePrice.classList.add('dataPrice');
      spanValuePrice.innerText = car.price + ' €';

      details.append(spanLabelManufacturer, spanValueManufacturer, spanLabelCif, spanValueCif, spanLabelColor, spanValueColor, spanLabelPrice, spanValuePrice);

      const btns = document.createElement('div');
      btns.classList.add('btns');
      const btnUpdate = document.createElement('div');
      btnUpdate.classList.add('btn');
      btnUpdate.classList.add('update');
      btnUpdate.innerText = 'Actualizar'

      const btnDelete = document.createElement('div');
      btnDelete.classList.add('btn');
      btnDelete.classList.add('delete');
      btnDelete.innerText = 'Borrar'

      btns.append(btnUpdate, btnDelete);
      newDiv.append(carName, img, details, btns);

      btnDelete.addEventListener('click', async (e) => {
        deleteCar(car.id);
        getSearchCars();
      });
      elemContent.appendChild(newDiv);
    }
    const addCard = document.createElement('article');
    addCard.classList.add('card');
    addCard.classList.add('add');
    const addImg = document.createElement('img');
    addImg.setAttribute('src', './img/add.png');
    addCard.append(addImg);
    addCard.addEventListener('click', () => {
      alert('Añadir nuevo coche')
    });
    elemContent.append(addCard);

  }
}

async function deleteCar(id) {
  alert(`Coche con id ${id}} borrado`);
  await fetch(`http://localhost:3000/products/delete/${id}`);
}