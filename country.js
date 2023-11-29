function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const navigationBar = document.getElementsByClassName("navigation-bar")
    navigationBar[0].classList.toggle("dark-nav-bar");

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


const darkModeToggle = document.querySelector('.toggle-light-and-dark');
darkModeToggle.addEventListener('click', toggleDarkMode);