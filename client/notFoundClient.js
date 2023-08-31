// Init Function, sets up the button to return to the homepage
const init = () => {
    const returnBtn = document.querySelector('#home');

    returnBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}

window.onload = init;