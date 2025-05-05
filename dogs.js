let allBreeds = [];

async function loadDogCarousel() {
    const container = document.getElementById('dogCarousel');
    const fetches = Array.from({ length: 10 }, () =>
    fetch('https://dog.ceo/api/breeds/image/random')
    );

    const dogs = [];
    for (const fetch of fetches) {
        const result = await fetch;
        const data = await result.json();
        dogs.push(data);
    }

    dogs.forEach((dog, index) => {
        const img = document.createElement('img');
        img.src = dog.message;
        img.alt = 'Dog';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        if (index === 0) img.className = 'current-slide';
        container.appendChild(img);
    });

    const pictures = container.pictures;
    simpleslider.getSlider({
        container,
        pictures,
        onChange: (prev, next) => {
        pictures[prev].className = '';
        pictures[next].className = 'current-slide';
        },
        delay: 2,
        duration: 1
    });
}

function loadBreedButtons() {
    const buttonContainer = document.getElementById('breedButtons');

    fetch('https://dogapi.dog/api/v2/breeds')
        .then(res => res.json())
        .then(data => {
        allBreeds = data.data;

            allBreeds.slice(0, 10).forEach(breed => {
                const buttons = document.createElement('button');
                buttons.textContent = breed.attributes.name;
                buttons.setAttribute('class', 'breed-button');
                buttons.setAttribute('type', 'button');

                buttons.onclick = function () {
                displayBreedInfo(breed);
                };

                buttonContainer.appendChild(buttons);
            });
        });
}

function displayBreedInfo(breed) {
    const attr = breed.attributes;
    const infoContainer = document.getElementById('breedInfo');

    infoContainer.innerHTML = `
        <h3>Name: ${attr.name}</h3>
        <p><strong>Description:</strong> ${attr.description}</p>
        <p><strong>Min Life:</strong> ${attr.life.min}</p>
        <p><strong>Max Life:</strong> ${attr.life.max}</p>
    `;
    infoContainer.style.display = 'block';
}

if (annyang) {
    const commands = {
    'load dog breed *breed': function (breedName) {
        const match = allBreeds.find(b =>
            b.attributes.name.toLowerCase() === breedName.toLowerCase().trim()
        );
        if (match) {
            displayBreedInfo(match);
        }
    },
    'navigate to *page': function (page) {
        page = page.toLowerCase().trim();
        if (['home', 'stocks', 'dogs'].includes(page)) {
            window.location.href = page + '.html';
        }
    },

    'change the color to *color': function (color) {
        document.body.style.backgroundColor = color.toLowerCase();
    },

    'hello': function () {
        alert('Hello');
    },

    };

    annyang.addCommands(commands);

    document.querySelector('.audio-button-on').onclick = function () {
        annyang.start();
    };

    document.querySelector('.audio-button-off').onclick = function () {
        annyang.abort();
    };
}

loadDogCarousel();
loadBreedButtons();
