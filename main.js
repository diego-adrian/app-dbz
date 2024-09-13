window.addEventListener('load', async function () {
  // const canvas = document.querySelector('#canvas');
  // canvas.width = 800;
  // canvas.height = 600;
  // canvas.getContext('2d');

  const BASE_URL = 'https://dragonball-api.com/api';
  let characters = [];
  let characterSelected = [];

  if (window.localStorage) {
    const res = localStorage.getItem('characters');
    if (res) {
      characterSelected = JSON.parse(res);
    }
  }

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
        const nameCharacter = item.name.toLowerCase();
        if (window.localStorage) {
          const res = localStorage.getItem('characters');
          if (res) {
            characterSelected = JSON.parse(res);
            const existe = characterSelected.includes(nameCharacter);
            if (existe) {
              characterSelected = characterSelected.filter(item => {
                return item !== nameCharacter.toLowerCase();
              });
            } else {
              characterSelected.push(nameCharacter);
            }
          }
        }

        characterSelected = [...new Set(characterSelected)];

        if (window.localStorage) {
          localStorage.setItem('characters', JSON.stringify(characterSelected));
        }

        window.location.reload();
      });

      const img = document.createElement('img');
      img.setAttribute('src', item.image);
      img.setAttribute('alt', item.name);
      img.setAttribute('class', 'card-image');

      const h2 = document.createElement('h2');
      h2.textContent = item.name;
      // console.log('-----------------en el momento del renderizado-------------------');
      // console.log(characterSelected.includes(item.name.toLowerCase()), item.name.toLowerCase());
      // console.log('------------------------------------');
      h2.setAttribute('class', 'card-title');
      h2.style.color = characterSelected.includes(item.name.toLowerCase()) ? 'red' : 'black';

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