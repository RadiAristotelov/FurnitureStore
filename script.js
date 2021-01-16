const firebaseLink = 'https://furniture-store-exrcs-default-rtdb.firebaseio.com';

const routes = {
    'all': './templates/home.hbs',
    'create': './templates/create.hbs',
    'mine': './templates/profile.hbs',
    'details': './templates/details.hbs',
};

const router = async (pathname) => {
    if (pathname === '/') {
        redirect('/funiture/all');
    }

    let [furniture, path, id] = pathname.split('/').filter(x => x);

    switch (path) {
        case 'all':
            showNotification();
            renderHomePage();
            break;
        case 'create':
            showNotification();
            renderCreatePage();
            break;
        case 'mine':
            showNotification();
            renderMyFurniturePage();
            break;
        case 'details':
            showNotification();
            renderDetailspage(id);
            break;
    }
};

function redirect(path) {
    history.pushState({}, '', path);

    router(path)
}

function onRouteChange(e) {
    if (e.target.tagName != 'A') {
        return;
    }

    e.preventDefault();

    let url = new URL(e.target.href);

    redirect(url.pathname);
}

async function renderHomePage() {
    const app = document.getElementById('root');

    const furniture = await fetch(`${firebaseLink}/furniture.json`)
        .then(res => res.json());

    let templateData;

    if (furniture !== null) {
        const furnitureData = Object.keys(furniture).map(key => ({
            key,
            ...furniture[key],
        }));

        templateData = {
            furnitureData: furnitureData,
        }
    }

    const responseTemplate = await fetch(routes['all'])
        .then((response) => response.text());

    const template = Handlebars.compile(responseTemplate);
    app.innerHTML = template(templateData);
}

async function renderCreatePage() {
    const app = document.getElementById('root');

    const responseTemplate = await fetch(routes['create'])
        .then((response) => response.text());

    const template = Handlebars.compile(responseTemplate);
    app.innerHTML = template();

    let formElement = document.getElementById('create-form');
    formElement.addEventListener('submit', onCreateSubmit);
}

async function renderMyFurniturePage() {
    const app = document.getElementById('root');

    const furniture = await fetch(`${firebaseLink}/furniture.json`)
        .then(res => res.json());

    let templateData;

    if (furniture !== null) {

        const furnitureData = Object.keys(furniture).map(key => ({
            key,
            ...furniture[key],
        }));

        templateData = {
            furnitureData: furnitureData,
        }
    }

    const responseTemplate = await fetch(routes['mine'])
        .then((response) => response.text());

    const template = Handlebars.compile(responseTemplate);
    app.innerHTML = template(templateData);
}

async function renderDetailspage(id) {
    const app = document.getElementById('root');

    const responseTemplate = await fetch(routes['details'])
        .then((response) => response.text());

    const template = Handlebars.compile(responseTemplate);


    const resultFur = await fetch(`${firebaseLink}/furniture/${id}.json`)
        .then(res => res.json());

    app.innerHTML = template(resultFur);
}

function onCreateSubmit(e) {
    e.preventDefault();

    let make = document.querySelector('#new-make');
    let model = document.querySelector('#new-model');
    let year = document.querySelector('#new-year');
    let description = document.querySelector('#new-description');
    let price = document.querySelector('#new-price');
    let image = document.querySelector('#new-image');
    let material = document.querySelector('#new-material');

    if (make.value.length < 4 || model.value.length < 4 || year.value === '' || year.value < 1950 || year.value > 2050 || description.value.length < 10 || price.value < 0 || price.value === '' || image.value === '') {
        checkIfValidInput(make);
        checkIfValidInput(model);
        checkIfValidInput(year);
        checkIfValidInput(description);
        checkIfValidInput(price);
        checkIfValidInput(image);
        checkIfValidInput(material);
        return;
    }

    let newFurniture = {
        make: make.value,
        price: price.value,
        model: model.value,
        image: image.value,
        year: year.value,
        description: description.value,
        material: material.value,
    };

    fetch(`${firebaseLink}/furniture.json`, {
            method: 'POST',
            headers: {
                'content-type': 'applicatoin/json'
            },
            body: JSON.stringify(newFurniture)
        })
        .then(res => res.json())
        .then(data => redirect('/furniture/all'));
}

function checkInput(e) {
    const currElement = e.target;
    checkIfValidInput(currElement);
}

function checkIfValidInput(currElement) {
    if (currElement.tagName !== 'INPUT') {
        return;
    }

    switch (currElement.name) {
        case 'make':
            const makeNotificationId = 'makeInvalidNotification';
            const makelInputId = 'new-make';

            if (currElement.value.length < 4) {
                invalidNotification(makeNotificationId, makelInputId);
            } else {
                validNotification(makeNotificationId, makelInputId);
            }
            break;
        case 'model':
            const modelNotificationId = 'modelInvalidNotification';
            const modelInputId = 'new-model';

            if (currElement.value.length < 4) {
                invalidNotification(modelNotificationId, modelInputId);
            } else {
                validNotification(modelNotificationId, modelInputId);
            }
            break;
        case 'year':
            const yearNotificationId = 'yearInvalidNotification';
            const yearInputId = 'new-year';

            if (currElement.value < 1950 || currElement.value > 2050) {
                invalidNotification(yearNotificationId, yearInputId);
            } else {
                validNotification(yearNotificationId, yearInputId);
            }
            break;
        case 'description':
            const descriptionNotificationId = 'descriptionInvalidNotification';
            const descriptionInputId = 'new-description';

            if (currElement.value.length < 10) {
                invalidNotification(descriptionNotificationId, descriptionInputId);
            } else {
                validNotification(descriptionNotificationId, descriptionInputId);
            }
            break;
        case 'price':
            const priceNotificationId = 'priceInvalidNotification';
            const priceInputId = 'new-price';

            if (currElement.value < 0 || currElement.value === '') {
                invalidNotification(priceNotificationId, priceInputId);
            } else {
                validNotification(priceNotificationId, priceInputId);
            }
            break;
        case 'image':
            const imageNotificationId = 'imageInvalidNotification';
            const imageInputId = 'new-image';

            if (currElement.value === '') {
                invalidNotification(imageNotificationId, imageInputId);
            } else {
                validNotification(imageNotificationId, imageInputId);
            }
            break;
        case 'material':
            const materialNotificationId = 'materialInvalidNotification';
            const materialInputId = 'new-material';

            validNotification(materialNotificationId, materialInputId);
            break;

    }

    function invalidNotification(notifivationId, inputId) {
        const notification = document.getElementById(notifivationId);
        const input = document.getElementById(inputId);

        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        notification.style.display = 'block';
    }

    function validNotification(notifivationId, inputId) {
        const notification = document.getElementById(notifivationId);
        const input = document.getElementById(inputId);

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        notification.style.display = 'none';

    }
}

function deleteItem(e, id) {
    e.preventDefault();

    if (e.target.tagName !== 'A') {
        return;
    }

    fetch(`${firebaseLink}/furniture/${id}.json`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => redirect('/furniture/mine'));
}

function showNotification() {
    const loadingNotification = document.getElementById('loadingBox');

    loadingNotification.style.display = 'block';

    setTimeout(function () {
        loadingNotification.style.display = 'none';
    }, 1000);
}

document.querySelector('nav').addEventListener('click', onRouteChange);

router(location.pathname);