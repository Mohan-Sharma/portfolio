/**
 * @author Mohan Sharma
 */

export const blurImage = () => {
    const imgContainerDivs = document.querySelectorAll('.blur__loading');

    imgContainerDivs.forEach(imgContainerDiv => {
        const img = document.querySelector('img.project__tectstack');

        function imageLoaded() {
            imgContainerDiv.style.backgroundImage = 'none';
            imgContainerDiv.classList.add('img__loaded');
        }

        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
        }
    });
};