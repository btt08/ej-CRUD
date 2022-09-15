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
      spanValueColor.style.color = `${car.color}`;
      if (car.color === 'black')
        spanValueColor.style.color = '#333';
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

      btnUpdate.addEventListener('click', async (e) => {
        updateCar(car.id);
        getSearchCars();
      });

      btnDelete.addEventListener('click', async (e) => {
        confirm(`¿Seguro que desea borrar el coche ${car.brand}?`) ?
          deleteCar(car.id) :
          null;
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
      addCar();
    });
    elemContent.append(addCard);
  }
}

async function fillManufacturersSelect(selectElem, cif = null) {
  selectElem.innerHTML = '';
  const manufacturers = await fetch(`http://localhost:3000/products/manufacturers`);
  const manufacturersData = await manufacturers.json();
  if (!manufacturersData.error)
    for (let i = 0; i < manufacturersData.result.length; i++) {
      const manufacturer = manufacturersData.result[i];
      const option = document.createElement('option');
      option.setAttribute('value', manufacturer.cif);
      option.innerText = manufacturer.name;
      if (manufacturer.cif === cif) option.setAttribute('selected', true);
      selectElem.appendChild(option);
    }
}

function toggleModal() {
  const modal = document.getElementById('modal');
  modal.classList.toggle("show-modal");
}

async function addCar() {
  toggleModal();
  document.querySelector('.modal-content h2').innerText = 'Insertar coche';
  const btnCancel = document.getElementById('btn-cancel-update');
  const elemManufacturersUpdate = document.getElementById('select-manufacturers-update');

  btnCancel.addEventListener('click', () => toggleModal());

  fillManufacturersSelect(elemManufacturersUpdate);

  const btnUpdate = document.getElementById('btn-update');
  btnUpdate.addEventListener('click', async (e) => {
    const inputBrandUpdate = document.getElementById('input-brand-update');
    const inputColorUpdate = document.getElementById('input-color-update');
    const inputPriceUpdate = document.getElementById('input-price-update');

    try {
      if (inputBrandUpdate.value && inputColorUpdate.value && inputPriceUpdate.value) {
        const maxId = await fetch('http://localhost:3000/products/ids');
        const newId = Number(await maxId.json()) + 1;
        const headers = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: newId,
            brand: inputBrandUpdate.value,
            color: inputColorUpdate.value,
            price: inputPriceUpdate.value,
            cif: elemManufacturersUpdate.value
          })
        };
        await fetch(`http://localhost:3000/products/insert`, headers);
        getSearchCars();
        toggleModal();
      } else {
        alert('Por favor, rellene todos los campos');
      }
    } catch (error) {
      console.log(error)
    }
  });
}

async function updateCar(id) {
  document.querySelector('.modal-content h2').innerText = 'Actualizar coche';

  const btnCancel = document.getElementById('btn-cancel-update');
  const elemManufacturersUpdate = document.getElementById('select-manufacturers-update');
  btnCancel.addEventListener('click', () => toggleModal());

  const car = await fetch(`http://localhost:3000/products/car/${id}`)
  const carData = await car.json();
  fillManufacturersSelect(elemManufacturersUpdate, carData.cif);

  const inputBrandUpdate = document.getElementById('input-brand-update');
  const inputColorUpdate = document.getElementById('input-color-update');
  const inputPriceUpdate = document.getElementById('input-price-update');

  inputBrandUpdate.value = carData.brand;
  inputColorUpdate.value = carData.color;
  inputPriceUpdate.value = carData.price;

  const btnUpdate = document.getElementById('btn-update');
  btnUpdate.addEventListener('click', async (e) => {
    e.preventDefault();
    const headers = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: carData.id,
        brand: inputBrandUpdate.value,
        color: inputColorUpdate.value,
        price: inputPriceUpdate.value,
        cif: elemManufacturersUpdate.value
      })
    }
    try {
      await fetch(`http://localhost:3000/products/update`, headers);
      getSearchCars()
      toggleModal();
    } catch (error) {
      console.log(error)
    }
  })
  toggleModal();
}

async function deleteCar(id) {
  try {
    await fetch(`http://localhost:3000/products/delete/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.log(error);
  }
  alert(`Coche borrado`);
  await getSearchCars();
}