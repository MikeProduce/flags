


const currentUrl = new URL(window.location.href);
const searchParams = currentUrl.searchParams;
const selectedCountry = searchParams.get('selectedCountry');


const fetchCountries = async function () {
    try {
        const countriesJson = "data.json"
        const response = await fetch(countriesJson);
        if (!response.ok) {
            throw new Error(`Error fetching data. Status ${response.status}`)
        }
        const data = await response.json();
        displaySelectedCountry(data)
    } catch {
        console.error('Error fetching data:', error.message)
        throw error;
    }
}

const displaySelectedCountry = async function (data) {
    const filteredCountry = data.filter((data) => data.name == selectedCountry)
    generateHTML(filteredCountry[0])
}

function generateHTML(country) {
    console.log(country);
    const createDiv = document.createElement('div');
    const countryDiv = document.getElementById("country-container");

    createDiv.innerHTML += `
        <div class="country-info">
            <div class="flag-container">
                <img class="flag-image" src="${country.flag}" alt="${country.name} Flag">
            </div>
            <div class="details-container">
                <h2>${country.name}</h2>
                <div class="container-specific-details">
                <div class="container-description">
                <p><strong>Native Name:</strong> ${country.nativeName}</p>
                <p><strong>Population:</strong> ${country.population}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Subregion:</strong> ${country.subregion}</p>
                <p><strong>Capital:</strong> ${country.capital}</p>
                </div>
                <div class="container-description">
                <p><strong>Top Level Domain:</strong> ${country.topLevelDomain.join(', ')}</p>
                <p><strong>Currencies:</strong> ${country.currencies.map(currency => currency.name).join(', ')}</p>
                <p><strong>Languages:</strong> ${country.languages.map(language => language.name).join(', ')}</p>
                </div>
                <div>
            </div>
        </div>
        <div class="countries-borders">
                    <strong class="country-name">Border Countries:</strong>
                    ${country.borders.map(border => `<button class="border-countries">${border}</button>`)}
                </div>
    `;

    countryDiv.appendChild(createDiv);
}



function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const navigationBar = document.getElementsByClassName("navigation-bar")
    navigationBar[0].classList.toggle("dark-nav-bar");

    toggleIcons();
}

function toggleIcons() {
    const toggleLight = document.querySelector(".toggle-light-mode");
    const toggleDark = document.querySelector(".toggle-dark-mode");

    const stylesDark = window.getComputedStyle(toggleDark);
    const stylesLight = window.getComputedStyle(toggleLight);

    if (stylesDark.display == "flex") {
        toggleDark.style.display = "none";
        toggleLight.style.display = "flex";
    } else if (stylesLight.display == "flex") {
        toggleDark.style.display = "flex";
        toggleLight.style.display = "none";
    }

}


const darkModeToggle = document.querySelector('.toggle-light-and-dark');
darkModeToggle.addEventListener('click', toggleDarkMode);
fetchCountries();