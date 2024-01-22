'use strict';

/**
 * Example inspired in code from the LinkedIn Learning course "Introduction to Web APIs"
 */
const api = 'https://official-joke-api.appspot.com/random_joke';
document.querySelector('#api').innerHTML = `<a href="${api}" target="_blank" title="Official Joke API">${api}</a>`;

// API consumption via XHR (XMLHttpRequest)
document.querySelector('#btnXhr').addEventListener('click', () => {
    startSpinner();

    const request = new XMLHttpRequest();

    request.open('GET', api);
    
    request.onload = () => {
        const response = request.response;
    
        // The GET response is a string
        document.querySelector('#response').innerText = response;
        document.querySelector('#response_type').innerText = typeof response;
        
        // But once parsed, it becomes a JavaScript object
        const jsonData = JSON.parse(response);
        document.querySelector('#parsed_response').innerText = jsonData;
        document.querySelector('#parsed_response_type').innerText = typeof jsonData;
    
        // The object can be easily manipulated
        fillTable(jsonData);
        showOutput();
        showCode('xhr');
        showObject(false);
        stopSpinner();
    };
    
    request.send();

});

// API consumption via the Fetch API
document.querySelector('#btnFetch').addEventListener('click', async () => {
    document.querySelector('.loader').classList.add('loader-active');

    fetch(api, {
        method: 'GET',        
    }).then(response => {
        // The GET response is a JavaScript object
        document.querySelector('#response').innerText = response;
        document.querySelector('#response_type').innerText = typeof response;

        const content = `
            type: ${response.type}
            url: ${response.url}
            redirected: ${response.redirected}
            status: ${response.status}
            statusText: ${response.statusText}
            ok: ${response.ok}
            body: ${response.body}
            bodyUsed: ${response.bodyUsed}
            headers: ${response.headers}
        `;
        document.querySelector('#object_content').innerText = content;

        return response.json();
    })
    .then((data) => {
        // Once parsed, it becomes JSON
        document.querySelector('#parsed_response').innerText = data;
        document.querySelector('#parsed_response_type').innerText = typeof data;
    
        // The JSON can be easily manipulated
        fillTable(data);
        showOutput();
        showCode('fetch');
        showObject();
        stopSpinner();
    });  
});

/*
    Alternative fetch() implementation
*/

// document.querySelector('#btnFetch').addEventListener('click', async () => {
//     document.querySelector('.loader').classList.add('loader-active');

//     const response = await fetch(api);

//     // The GET response is a JavaScript object
//     document.querySelector('#response').innerText = response;
//     document.querySelector('#response_type').innerText = typeof response;
    
//     const content = `
//         type: ${response.type}
//         url: ${response.url}
//         redirected: ${response.redirected}
//         status: ${response.status}
//         statusText: ${response.statusText}
//         ok: ${response.ok}
//         body: ${response.body}
//         bodyUsed: ${response.bodyUsed}
//         headers: ${response.headers}
//     `;
//     document.querySelector('#object_content').innerText = content;

//     // Once parsed, it becomes JSON
//     const jsonData = await response.json();
//     document.querySelector('#parsed_response').innerText = jsonData;
//     document.querySelector('#parsed_response_type').innerText = typeof jsonData;

//     // The JSON can be easily manipulated
//     fillTable(jsonData);
//     showOutput();
//     showCode('fetch');
//     showObject();
//     stopSpinner();
// });

const fillTable = (jsonData) => {
    const table = document.querySelector('#parsed_object');
    table.innerHTML = '';
    for (let property in jsonData) {
        let row = document.createElement('tr');

        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(property))
        row.appendChild(cell);
        
        cell = document.createElement('td');
        cell.appendChild(document.createTextNode(jsonData[property]))
        row.appendChild(cell);

        table.appendChild(row);
    }
}

const startSpinner = () => document.querySelector('.loader').classList.add('loader-active');
const stopSpinner = () => document.querySelector('.loader').classList.remove('loader-active');

const showOutput = () => document.querySelectorAll('section.output').forEach((section) => { section.classList.remove('hidden'); });

/**
 * Shows a code section and hides the other
 * @param {*} type 'xhr' or 'fetch'
 */
const showCode = (type) => {
    let xhrStatus = ['visible', 'hidden'];
    if (type === 'xhr') {
        xhrStatus = ['hidden', 'visible'];
    }
    document.querySelector('#xhr_code').classList.remove(xhrStatus[0]);
    document.querySelector('#xhr_code').classList.add(xhrStatus[1]);    
    document.querySelector('#fetch_code').classList.remove(xhrStatus[1]);
    document.querySelector('#fetch_code').classList.add(xhrStatus[0]);
}

/**
 * Shows or hides the object content paragraph
 * @param {*} show If true, it shows the paragraph; otherwise, it hides it
 */
const showObject = (show = true) => {
    document.querySelector('#object').classList.remove(show ? 'hidden' : 'visible');
    document.querySelector('#object').classList.add(show ? 'visible' : 'hidden');
}