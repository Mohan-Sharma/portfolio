export const toggleTheme = () => {
    const themeIcons = document.querySelectorAll('#toggleTheme');

    // executes immediately after page load
    const theme = localStorage.getItem('theme');
    if (theme && theme === 'light-mode') {
        document.body.classList.add('light__mode');
        toggleSunIcon('none');
        toggleMoonIcon('block');
    } else {
        toggleSunIcon('block');
        toggleMoonIcon('none');
    }

    themeIcons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme();
       });
    });
};

const applyTheme = () => {
    document.body.classList.toggle('light__mode');
    if ( document.body.classList.contains('light__mode')) {
        localStorage.setItem('theme', 'light-mode');
        toggleSunIcon('none');
        toggleMoonIcon('block');
    } else {
        localStorage.removeItem('theme');
        document.body.removeAttribute('class');
        toggleSunIcon('block');
        toggleMoonIcon('none');
    }
};

const toggleSunIcon = ( display ) => {
    const sunIcons = document.querySelectorAll('.sun');
    sunIcons.forEach(btn => {
        btn.style.display = display;
    });
}

function toggleMoonIcon( display ) {
    const moonIcons = document.querySelectorAll('.moon');
    moonIcons.forEach(btn => {
        btn.style.display = display;
    })
}