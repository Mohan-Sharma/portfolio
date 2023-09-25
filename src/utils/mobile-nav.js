export const toggleMobileNav = () => {
    const headerBarsIcon = document.querySelector('.header__bars');
    const mobileNav = document.querySelector('.mobile-nav');
    let openMobileNav = false;
    headerBarsIcon.addEventListener('click', () => {
        openMobileNav = !openMobileNav;

        if (openMobileNav) {
            mobileNav.style.display = 'flex';
            document.body.style.overflowY = 'hidden'
        } else {
            mobileNav.style.display = 'none';
            document.body.style.overflowY = 'auto'
        }
    });

    const menuItems = document.querySelectorAll('.mobile-nav__link');
    menuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            openMobileNav = false;
            mobileNav.style.display = 'none';
            document.body.style.overflowY = 'auto'
        });
    });
};