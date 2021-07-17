// Variable Declarations
let list = [];
let searchDelay;

// DOM Access
const container = document.getElementById('container');
const app = document.getElementById('app');
const loading = document.getElementById('loading');
const input = document.querySelector('.form-input');

//Fetch Foods
let localFoods = JSON.parse(localStorage.getItem('localFoods'));
const getList = async () => {
  if (localFoods) {
    list = [...localFoods];
    showFood(localFoods);
  } else {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos');
    list = await response.json();
    localStorage.setItem('localFoods', JSON.stringify(list));
    showFood(list);
  }
};

//Fetch User Info
const getUser = async () => {
  let response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  let user = await response.json();
  document.getElementById('user').textContent = `Hello, ${user.name}`;
};

//Searchbar with Fuse.js
input.addEventListener('keyup', (e) => {
  clearTimeout(searchDelay);
  searchDelay = setTimeout(() => {
    const options = {
      includeScore: false,
      // equivalent to `keys: [['author', 'tags', 'value']]`
      keys: ['title'],
    };

    const fuse = new Fuse(list, options);

    let value = e.target.value.toLowerCase();
    if (value == '') {
      showFood(list);
    } else {
      const result = fuse.search(value);
      let filteredList = result.map((element) => element.item);
      // let filteredList = list.filter((item) => item.title.includes(value));
      showFood(filteredList);
    }
  }, 500);
});

//Display Food Container
const showFood = (list) => {
  container.innerHTML = null;
  list.forEach((item) => {
    let element = document.createElement('article');
    //add id
    element.id = item.id;
    //add class
    element.classList.add('card');
    element.tabIndex = item.id;

    element.addEventListener('click', (e) => {
      // Focusing selected element
      element.focus();
      element.style.border = '3px solid black';
    });

    // Key Events
    element.addEventListener('keyup', (e) => {
      if (e.key.toLowerCase() == 'f') {
        if (!item.isFavorite) {
          item.isFavorite = true;
          element.classList.add('favorite');
          favoriteButton.textContent = 'Remove from favorites';
          localStorage.setItem('localFoods', JSON.stringify(list));
        } else {
          item.isFavorite = false;
          element.classList.remove('favorite');
          favoriteButton.textContent = 'Add to favorites';
          localStorage.setItem('localFoods', JSON.stringify(list));
        }
      }
    });

    // Focus out
    element.addEventListener('focusout', (event) => {
      element.style.border = 'none';
    });

    if (!item.isFavorite) {
      element.innerHTML = `<h4>${item.title}</h4>
      <button>Add to favorites</button>`;
    } else {
      element.innerHTML = `<h4>${item.title}</h4>
      <button>Remove from favorites</button>`;
      element.classList.add('favorite');
    }

    //Handle Favorites
    const favoriteButton = element.querySelector('button');
    favoriteButton.addEventListener('click', () => {
      if (!item.isFavorite) {
        element.classList.add('favorite');
        favoriteButton.textContent = 'Remove from favorites';
        item.isFavorite = true;
        localStorage.setItem('localFoods', JSON.stringify(list));
      } else {
        element.classList.remove('favorite');
        favoriteButton.textContent = 'Add to favorites';
        item.isFavorite = false;
        localStorage.setItem('localFoods', JSON.stringify(list));
      }
    });
    //append child
    container.appendChild(element);
  });
  app.style.display = 'block';
  loading.style.display = 'none';
};

//App initialization
getUser();
getList();
