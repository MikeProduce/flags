"use strict";

const mainContent = document.getElementById("main-content");
const selectedRegion = document.getElementById("region");
const recommendationFlags = document.getElementById("recommendation-flags");

const fetchCountries = async function () {
    try {
        const countriesJson = "data.json"
        const response = await fetch(countriesJson);
        if (!response.ok) {
            throw new Error(`Error fetching data. Status ${response.status}`)
        }
        const data = await response.json();
        return data
    } catch {
        console.error('Error fetching data:', error.message)
        throw error;
    }
}

function htmlGenerator(data) {

    mainContent.innerHTML = '';

    if (typeof data === 'string') {
        renderErrorMessage(data);
    } else {
        renderCountries(data);
    }
}

function renderErrorMessage(message) {
    mainContent.innerHTML += `<div class="error-message">${message}</div>`
}

function renderCountries(countries) {
    const fragment = document.createDocumentFragment();

    countries.forEach(country => {
        const countryDiv = createCountryDiv(country);
        fragment.appendChild(countryDiv)
    });

    mainContent.appendChild(fragment);
}

function createCountryDiv(country) {
    const countryDiv = document.createElement('div');
    if (document.body.classList.value == "dark-mode"){
        countryDiv.className = 'flags dark-mode-elements';

    } else {
        countryDiv.className = "flags"
    }
    const formattedPopulation = country.population.toLocaleString();
    countryDiv.innerHTML = `
    <img src="${country.flags.svg}" alt="${country.name + ' flag'}">
    <div class="flags-info">
        <h2>${country.name}</h2>
        <span>Population:<p> ${formattedPopulation} </p></span>
        <span>Region: <p> ${country.region} </p></span>
        <span>Capital:<p> ${country.capital} </p></span>
    </div>
`;
    return countryDiv;
}

selectedRegion.addEventListener("change", function () {
    const selectedRegionValue = selectedRegion.value;
    main(selectedRegionValue);
});

const querySearch = document.getElementById("country-search");
querySearch.addEventListener("change", function () {
    const searchQuery = querySearch.value;
    main(undefined, searchQuery);
});


querySearch.addEventListener("input", function () {
    const inputText = querySearch.value;
    clearTimeout(querySearch.timer);
    querySearch.timer = setTimeout(function () {
        recommendationMain(inputText);
    }, 100);
});

async function main(selectedRegion, inputText) {
    try {
        const data = await fetchCountries();
        const filteredData = filterData(data, selectedRegion, inputText)
        renderData(filteredData)
    } catch (error) {
        console.error('An error occurred:', error)
    }
}

function filterData(data, selectedRegionValue, inputText) {
    if (!data) {
        return 'Data is not available';
    }
    let filteredData = data;

    if (selectedRegionValue && selectedRegionValue !== "all") {
        filteredData = data.filter(country => country.region === selectedRegionValue);
    }

    if (inputText && inputText !== "") {
        filteredData = data.filter(country => country.name.toLowerCase() === inputText.toLowerCase());
    }

    if (filteredData.length === 0) {
        return `${inputText} was not found. Try another country.`;
    }

    return filteredData;
}

function renderData(data) {
    htmlGenerator(data);
}



async function recommendationMain(inputText) {
    try {
        const data = await fetchCountries();
        if (!data) {
            throw new Error('Data is not available');
        }
        if (inputText !== '') {
            const filteredData = filterCountriesByPartialName(data, inputText);
            populateRecommendations(filteredData);
        } else {
            populateRecommendations([]);
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}
function filterCountriesByPartialName(data, inputText) {
    const inputTextLower = inputText.toLowerCase();

    return data.filter(country => {
        const countryName = country.name.toLowerCase();
        let tempValue = '';
        let countryCurrentLetter = 0;

        for (let i = 0; i < inputTextLower.length && countryCurrentLetter < countryName.length; i++) {
            if (inputTextLower[i] === countryName[countryCurrentLetter]) {
                tempValue += countryName[countryCurrentLetter];
                countryCurrentLetter++;
            }
        }
        if (tempValue === inputTextLower) {
            return true;
        } else {
            return false;
        }
    });
}


function populateRecommendations(recommendations) {

    recommendationFlags.innerHTML = '';
    if (recommendations.length === 0) {
        recommendationFlags.style.display = "none";
    } else {
        updateRecommendationFlags(recommendations)
    }

    recommendationFlags.addEventListener("click", function (event) {
        handleRecommendationClick(event);
    });
}
function updateRecommendationFlags(recommendations) {
    recommendationFlags.style.display = "block";
    recommendations.forEach((recommendation) => {
        recommendationFlags.innerHTML += `<li class="recommended-flag">${recommendation.name}</li>`;
    });
}
function handleRecommendationClick(event) {
    const { target } = event;
    if (target.classList.contains("recommended-flag")) {
        querySearch.value = target.textContent;
        querySearch.dispatchEvent(new Event("change"));
        recommendationFlags.style.display = "none";
    }
}
recommendationFlags.addEventListener("click", handleRecommendationClick);

main();



// dark mode config

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const flagsElements = document.getElementsByClassName('flags');
    const countrySearchBar = document.getElementById("country-search").classList.toggle("dark-mode-search")
    const regionSelector = document.getElementById("region").classList.toggle("dark-mode-search")
    const navigationBar = document.getElementsByClassName("navigation-bar")
    navigationBar[0].classList.toggle("dark-nav-bar");
    
        for (const element of flagsElements) {
            element.classList.toggle('dark-mode-elements');

    }

    toggleIcons();
}

function toggleIcons(){
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

// Get a reference to the dark mode toggle button
const darkModeToggle = document.querySelector('.toggle-light-and-dark');

// Attach a click event listener to the toggle button
darkModeToggle.addEventListener('click', toggleDarkMode);

