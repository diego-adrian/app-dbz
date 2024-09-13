window.addEventListener('load', async function () {
  const BASE_URL = 'https://dragonball-api.com/api';
  let characters = [];
  let characterSelected = [];

  const INPUT_SEARCH = document.querySelector('#search');
  INPUT_SEARCH.addEventListener('input', function (event) {
    const value = event.target.value;

    const findCharacters = characters.filter(character => {
      return character.name.toLowerCase().includes(value.toLowerCase());
    });

    if (findCharacters.length) {
      const container = document.querySelector('.container');
      container.innerHTML = '';
      createCards(findCharacters);
    }

  });

  const createCards = (items) => {
    const container = document.querySelector('.container');

    items.forEach(item => {
      const div = document.createElement('div');
      div.setAttribute('class', 'card');
      div.addEventListener('click', function () {
        characterSelected.push(item.name.toLowerCase());
        characterSelected = [...new Set(characterSelected)];

        if (window.localStorage) {
          localStorage.setItem('characters', JSON.stringify(characterSelected));
        }
      });
  
      div.addEventListener('dblclick', function () {
        const { name } = item;
        characterSelected = characterSelected.filter(nameCharacter => {
          return nameCharacter !== name.toLowerCase();
        });

        if (window.localStorage) {
          const res = localStorage.getItem('characters', characterSelected);
          console.log(JSON.parse(res));
        }
      });

      const img = document.createElement('img');
      img.setAttribute('src', item.image);
      img.setAttribute('alt', item.name);
      img.setAttribute('class', 'card-image');

      const h2 = document.createElement('h2');
      h2.textContent = item.name;
      h2.setAttribute('class', 'card-title');

      const p = document.createElement('p');
      p.textContent = item.description;
      p.setAttribute('class', 'card-description');

      div.appendChild(img);
      div.appendChild(h2);
      div.appendChild(p);

      container.appendChild(div);
    });

    // const div = `
    //   <div class="cards"></div>
    // `;
    // container.innerHTML = div;
  }

  const getCharacters = async () => {
    try {
      const path = `${BASE_URL}/characters?page=2&limit=5`;
      const response = await fetch(path);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }

  const { items  } = await getCharacters();
  characters = items;
  createCards(characters);
});