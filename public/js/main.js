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
  const elemContent = document.getElementById('content');
  elemContent.innerHTML = '';
  if (data.error) elemContent.innerHTML = data.error;
  else {
    for (let i = 0; i < data.result.length; i++) {
      const car = data.result[i];
      const newDiv = document.createElement('div');
      newDiv.classList.add('car');
      newDiv.setAttribute('data-id', car.id);
      for (const property in car) {
        if (property !== 'id') {
          const newP = document.createElement('p');
          newP.innerText = `${property}: ${car[property]}`.toUpperCase();
          newDiv.append(newP);
        }
      }
      const elemBtn = document.createElement('button');
      elemBtn.classList.add('btn');
      elemBtn.textContent = 'Delete';
      elemBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        deleteCar(car.id);
        getSearchCars();
      });
      newDiv.appendChild(elemBtn);
      elemContent.appendChild(newDiv);
    }
  }
}

async function deleteCar(id) {
  alert(`Coche con is ${id}} borrado`);
  const response = await fetch(`http://localhost:3000/products/delete/${id}`);
}