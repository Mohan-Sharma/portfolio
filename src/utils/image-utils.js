export const blurImage = () => {
    const imgContainerDivs = document.querySelectorAll('.blur__loading');

    imgContainerDivs.forEach(imgContainerDiv => {
        const img = imgContainerDiv.querySelector('img.project__tectstack');

        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
        }

        function imageLoaded() {
            imgContainerDiv.style.backgroundImage = 'none';
            imgContainerDiv.classList.add('img__loaded');
        }
    });
};