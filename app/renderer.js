
// DOM Elements
const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkURL = document.querySelector('.new-link-url');
const newLinkButton = document.querySelector('.new-link-button');
const clearStorageButton = document.querySelector('.clear-storage');

// DOM API
const parser = new DOMParser();
const { shell } = require('electron');


const parserResponse = text => {
    return parser.parseFromString(text, 'text/html');
}
// Functions
const findTitle = nodes => {
    return nodes.querySelector('title').innerText;
}

const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({ title, url }));
}

const getLinks = () => {
    return Object.keys(localStorage)
        .map(key => JSON.parse(localStorage.getItem(key)));
}

const createLinkElement = link => {
    // console.log(link);
    return `
        <div>
            <h3>${link.title}</h3>
            <p>
                <a href="${link.url}">${link.url}</a>
            </p>
        </div>
    `
}

const renderLinks = () => {
    const linksElements = getLinks().map(createLinkElement).join('');
    linksSection.innerHTML = linksElements;
}

const clearForm = () => {
    newLinkURL.value = null;
}

const handleError = (error, url) => {
    errorMessage.innerHTML = `
        There was an error adding the link ${url}. Error: ${error.message}
    `.trim();
    setTimeout(() => {
        errorMessage.innerHTML = null;
    }, 5000);
}

// Event Listeners
renderLinks();

newLinkURL.addEventListener('keyup', () => {
    newLinkButton.disabled = !newLinkURL.validity.valid;
})

newLinkForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = newLinkURL.value;

    try {
        const response = await fetch(url);
        const data = await response.text();
        const parsedResponse = parserResponse(data);
        const title = findTitle(parsedResponse);
        storeLink(title, url);
        renderLinks();
        clearForm();
    } catch (error) {
        handleError(error, url);
    }
})

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
})

linksSection.addEventListener('click', (event) => {
    if (event.target.href) {
        event.preventDefault();
        shell.openExternal(event.target.href);
    }
})