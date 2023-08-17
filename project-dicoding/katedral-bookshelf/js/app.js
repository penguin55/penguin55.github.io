import { bookshelfServer, libraryServer, username, loadStorage, saveStorage, updateUsernameSession, saveBookmark, readBook, removeBookFromLibrary } from "./data-handler.js";
import { convertBase64Image as upload } from "./image-upload.js";

function formGenerate(formType, data){
    let formCard =
        `<div id="form-card" value="${data.id}" class="flex flex-column">
            <button value="Close-Form" type="button" class="close-form afc-button"><i class="fa-regular fa-circle-xmark"></i></button>
            <h2 id="form-title">${formType} Buku</h2>
            <section class="input-field flex" style="gap:2em;">
                <section class="flex flex-column" style="flex-grow: 2;">
                    <label for="book-file">Unggah Cover Buku</label>
                    <input type="file" id="upload-image" accept="image/png, image/jpeg">
                </section>
                <div class="form-thumbnail flex"><div>No Image</div></div>
            </section>
            <section class="input-field flex flex-column">
                <label for="book-title">Judul</label>
                <input maxlength="40" type="text" id="book-title" value="${data.title}">
            </section>
            <section class="input-field flex flex-column">
                <label for="book-author">Author</label>
                <input maxlength="40" type="text" id="book-author" value="${data.author}">
            </section>
            <section class="input-field flex flex-column">
                <label for="book-year">Tahun</label>
                <input type="number" min="1900" max="2099" step="1" id="book-year" value="${data.year}">
            </section>
            <section class="input-field flex flex-column">
                <label for="book-sinopsis">Sinopsis</label>
                <textarea maxlength="200" type="text" id="book-sinopsis" rows="3"></textarea>
            </section>
            <section class="flex" style="gap:1.5em;">
                <button value="Submit-Form" id="book-form-submit" class="button button-accept" type="button">${formType} Buku</button>
                ${formType.toLowerCase() === "edit" ? '<button value="Remove-Form" id="book-form-submit" class="button button-reject" type="button">Hapus Buku</button>' : '' }
            </section>
        </div>`;
    return formCard;
}

function bookCardMaker(data, cardType) {
    function validateCollection(book, trueCondition, falseCondition) {
        if (bookshelfServer.length > 0) return (bookshelfServer.find((data) => data.id == book.id) !== undefined) ? trueCondition : falseCondition;
        else return falseCondition;
    }

    let result = "";

    let html_BookCover =
        `<section class="book-cover">
            <img src="${data.cover}" alt="${data.title}">
        </section>`;

    let html_BookInfo =
        `<section class="flex flex-column book-info">
            <h4>${data.title}</h4>
            <section class="book-detail flex">
                <p>Author</p> <p>${data.author}</p>
            </section>
            <section class="book-detail flex">
                <p>Tahun</p> <p>${data.year}</p>
            </section>
            <section class="book-detail flex">
                <p>Sinopsis</p> <p>${data.sinopsis}</p>
            </section>
        </section>`;

    let html_Action_Library =
        `<section value="${data.id}" class="book-action flex flex-column">
            <button value="Bookmark" type="button" class="${validateCollection(data, "hidden", "")} afc-button bookmark"><i class="icon-success fa-regular fa-bookmark"></i></button>
            <button value="Unbookmark" type="button" class="${validateCollection(data, "", "hidden")} afc-button remove-bookmark"><i class="icon-warn fa-regular fa-square-minus"></i></button>    
            <button value="Edit" type="button" class="afc-button"><i class="icon-process fa-solid fa-pen-to-square"></i></button>
        </section>`;

    let html_Action_Book_Collection =
        `<section value="${data.id}" class="book-action flex flex-column">
            <button value="Unbookmark-Book" type="button" class="afc-button remove-wishlist"><i class="icon-warn fa-regular fa-trash-can"></i></button>
            <button value="Read" type="button" class="afc-button read"><i class="icon-success fa-solid fa-file-circle-check"></i></button>
        </section>`;

    let html_Action_Read_Collection =
        `<section value="${data.id}" class="book-action flex flex-column">
            <button value="Unread" type="button" class="afc-button unread"><i class="icon-warn fa-solid fa-file-circle-minus"></i></button>
        </section>`;

    result = html_BookCover + html_BookInfo;

    switch (cardType) {
        case "library":
            result += html_Action_Library;
            break;
        case "book-collection":
            result += html_Action_Book_Collection;
            break;
        case "read-collection":
            result += html_Action_Read_Collection;
            break;
    }

    let html_Result =
        `<article class="flex book-card">                 
            ${result}
        </article>`;

    return html_Result;
}

function populateLibrary() {
    let libraryError = document.querySelector("#library-error");
    let libraryBookCard = document.querySelector("#library");

    libraryBookCard.innerHTML = '';
    libraryError.classList.add("hidden");
    libraryBookCard.classList.remove("hidden");

    if (libraryServer.books.length > 0) {
        for (let book of libraryServer.books) {
            libraryBookCard.innerHTML += bookCardMaker(book, "library");
        }
    } else {
        libraryBookCard.classList.add("hidden");
        libraryError.classList.remove("hidden");
        libraryError.firstChild.innerHTML = "Tidak ada koleksi buku";
    }
}

async function populateBookshelf() {
    populateCollection("book-collection", false);
    populateCollection("read-collection", true);
}

function populateCollection(collectioType, read) {
    let collectionCard = document.querySelector(`#${collectioType}`);
    let collectionError = document.querySelector(`#${collectioType}-error`);
    
    collectionCard.innerHTML = '';
    collectionError.classList.add("hidden");
    collectionCard.classList.remove("hidden");

    let collections = bookshelfServer.length > 0 ? bookshelfServer.filter((x) => x.read === read) : [];

    if (collections.length > 0) {
        for (let book of collections) {
            let dataBook = libraryServer.books.find((x) => String(x.id) === String(book.id));
            if (dataBook === undefined) continue;

            collectionCard.innerHTML += bookCardMaker(dataBook, collectioType);;
        }
    } else {
        collectionCard.classList.add("hidden");
        collectionError.classList.remove("hidden");
        collectionError.firstChild.innerHTML = "Tidak ada koleksi buku";
    }
}

function refreshLibrary() {
    let library = document.querySelector("#library");
    library.classList.remove("hidden");
    library.innerHTML = '';
    document.querySelector("#library-error").classList.add("hidden");

    populateLibrary();
}

function refreshBookshelf() {
    let bookCollection = document.querySelector("#book-collection");
    bookCollection.classList.remove("hidden");
    bookCollection.innerHTML = '';
    document.querySelector("#book-collection-error").classList.add("hidden");

    let readCollection = document.querySelector("#read-collection");
    readCollection.classList.remove("hidden");
    readCollection.innerHTML = '';
    document.querySelector("#read-collection-error").classList.add("hidden");

    populateCollection("book-collection", false);
    populateCollection("read-collection", true);
}

// PUBLIC FUNCTION
async function onLoad() {
    await loadStorage().then(() => {
        if (username == "") {
            setupGreetingListener();
            document.querySelector(".overlay").classList.remove("hidden");
            document.body.style.overflow = "hidden";
        }

        setupGeneralListener();

        if (window.location.href.match('bookshelf.html') != null) populateBookshelf();
        else if (window.location.href.match('perpustakaan.html') != null) {
            setupFormListener();
            populateLibrary();
        }
    });
}

// INTERACTION
function setupGeneralListener() {
    let book_card = document.querySelector(".main-content");

    book_card.addEventListener('click', (ev) => {
        const isButton = ev.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        let button = ev.target;
        let buttonType = button.getAttribute("value");

        switch (buttonType.toLowerCase()) {
            case "bookmark":
                bookmark_event(button, true);
                break;
            case "unbookmark":
                bookmark_event(button, false);
                break;
            case "edit":
                openform_event(button, "Edit");
                break;
            case "unbookmark-book":
                unwishlist_event(button);
                break;
            case "read":
                readbook_event(button, true);
                break;
            case "unread":
                readbook_event(button, false);
                break;
            case "add-book":
                openform_event(button, "Tambah");
                break;
        }
    });
}

function setupFormListener(){
    let form_card = document.querySelector("#form-content");

    form_card.addEventListener('click', (ev) => {
        const isButton = ev.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        let button = ev.target;
        let buttonType = button.getAttribute("value");

        switch (buttonType.toLowerCase()) {
            case "close-form":
                closeform_event(button);
                break;
            case "submit-form":
                submitform_event(button);
                break;
            case "remove-form":
                removeform_event(button);
                break;
        }
    });
}

function setupGreetingListener(){
    let overlay_panel = document.querySelector("#greeting-panel");

    overlay_panel.addEventListener('click', (ev) => {
        const isButton = ev.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        let button = ev.target;
        let buttonType = button.getAttribute("data-value");

        switch (buttonType.toLowerCase()) {
            case "slider-gender":
                genderchoice_event(button);
                break;
            case "accept-name":
                acceptname_event(button);
                break;
        }
    });
}

// #region BUtton Interaction Book Card
function bookmark_event(param, bookmark) {
    let actionNode = param.parentNode;
    let idNode = actionNode.getAttribute("value");

    if (bookmark) {
        actionNode.querySelector(".bookmark").classList.add("hidden");
        actionNode.querySelector(".remove-bookmark").classList.remove("hidden");
    } else {
        actionNode.querySelector(".bookmark").classList.remove("hidden");
        actionNode.querySelector(".remove-bookmark").classList.add("hidden");
    }

    saveBookmark(idNode, bookmark, () => { });
}

function unwishlist_event(param) {
    let actionNode = param.parentNode;
    let idNode = actionNode.getAttribute("value");
    saveBookmark(idNode, false, ()=> refreshBookshelf());
}

function readbook_event(param, read) {
    let actionNode = param.parentNode;
    let idNode = actionNode.getAttribute("value");
    readBook(idNode, read, ()=> refreshBookshelf());
}

function openform_event(param, formType) {
    let addType = formType.toLowerCase() === "tambah";
    let fetchedBook = "";

    if (!addType) {
        fetchedBook = libraryServer.books.find((x) => x.id === param.parentNode.getAttribute("value"));
    }

    let data = {
        id: addType ? "" : fetchedBook.id,
        title: addType ? "" : fetchedBook.title,
        author: addType ? "" : fetchedBook.author,
        year: addType ? "" : fetchedBook.year,
        sinopsis: addType ? "" : fetchedBook.sinopsis,
    }
    
    let form = formGenerate(formType, data);

    let formContent = document.querySelector("#form-content");
    formContent.innerHTML = form;
    formContent.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    let inputImage = formContent.querySelector("#upload-image");
    inputImage.addEventListener('input',(ev)=>{
        uploadimage_event(ev);
    });

    if (!addType) {
        document.querySelector("#book-sinopsis").innerHTML = fetchedBook.sinopsis;
    } 
}

function closeform_event(param) {
    let formCard = param.parentNode;

    let inputImage = formCard.querySelector("#upload-image");
    inputImage.removeEventListener('input',(ev)=>{
        uploadimage_event(ev);
    });
    
    formCard.parentNode.classList.add("hidden");
    formCard.remove();
    document.body.style.overflow = "initial";
}

async function submitform_event(param) {
    //DOING THIS BECAUSE THIS BUTTON BEING CHILD of CHILD AND I NEED THE GRAND PARENT
    let buttonParentNode = param.parentNode;
    let rawImage = buttonParentNode.parentNode.querySelector("#upload-image").files[0];

    let id = buttonParentNode.parentNode.getAttribute("value");
    let createNew = Boolean(id);
    let imageData = rawImage;
    let titleData = buttonParentNode.parentNode.querySelector("#book-title").value;
    let authorData = buttonParentNode.parentNode.querySelector("#book-author").value;
    let yearData = buttonParentNode.parentNode.querySelector("#book-year").value;
    let sinopsisData = buttonParentNode.parentNode.querySelector("#book-sinopsis").value;

    let formData = {
        id : String(createNew ? id : (new Date()).getTime()),
        cover : imageData,
        title : titleData,
        author : authorData,
        year : yearData,
        sinopsis : sinopsisData
    };

    function isValid(data) {
        return (Boolean(data.id) && Boolean(data.cover) && Boolean(data.title) && Boolean(data.author) && Boolean(data.year) && Boolean(data.sinopsis));
    }

    if (isValid(formData)) {
        formData.cover = await upload(formData.cover);
        if (createNew) {
            let fetchedIndex = libraryServer.books.findIndex((x) => x.id === formData.id);
            libraryServer.books[fetchedIndex].cover = formData.cover;
            libraryServer.books[fetchedIndex].title = formData.title;
            libraryServer.books[fetchedIndex].author = formData.author;
            libraryServer.books[fetchedIndex].year = formData.year;
            libraryServer.books[fetchedIndex].sinopsis = formData.sinopsis;
        }
        else libraryServer.books.push(formData);
        
        saveStorage();

        refreshLibrary();
        closeform_event(buttonParentNode);
    } else alert("Isi semua field!");
}

function removeform_event(param) {
    //DOING THIS BECAUSE THIS BUTTON BEING CHILD of CHILD AND I NEED THE GRAND PARENT
    let buttonParentNode = param.parentNode;

    let id = buttonParentNode.parentNode.getAttribute("value");
    removeBookFromLibrary(id, ()=> {
        refreshLibrary();
        closeform_event(buttonParentNode);
    });
}

function genderchoice_event(param) {
    let buttonNode = param;
    let gender = buttonNode.getAttribute("value");

    switch (gender) {
        case "male":
            buttonNode.setAttribute("value", "female");
            buttonNode.children[0].style.left = "100%";
            buttonNode.children[0].style.transform = "translateX(-100%)";
            buttonNode.children[1].classList.remove("gender-active");
            buttonNode.children[2].classList.add("gender-active");
            break;
        case "female":
            buttonNode.setAttribute("value", "male");
            buttonNode.children[0].style.left = "0%";
            buttonNode.children[0].style.transform = "translateX(0%)";
            buttonNode.children[1].classList.add("gender-active");
            buttonNode.children[2].classList.remove("gender-active");
            break;
    }
}

function acceptname_event(param) {
    let actionNode = param.parentNode;
    let genderNode = actionNode.querySelector("#input-gender");
    let gender = genderNode.querySelector("button").getAttribute("value");
    let name = genderNode.querySelector("input").value;

    if (name === "") {
        alert("Nama tidak bisa kosong!");
    } else {
        // Animation
        let nameResult = actionNode.querySelector("#name-result");
        nameResult.innerHTML = ((gender === "male") ? "Santo" : "Santa").concat(" ", name);
        genderNode.classList.add("hidden");
        param.classList.add("hidden");
        nameResult.classList.remove("hidden");
        nameResult.style.opacity = "1";
        nameResult.style.position = "static";
        actionNode.classList.remove("flex-column");
        actionNode.style.gap = "1em";

        setTimeout(() => {
            document.querySelector(".overlay").classList.add("invisible");
            document.body.style.overflow = "initial";
            updateUsernameSession(nameResult.innerText);
        }, 2000);
    }
}

async function uploadimage_event(param) {
    let uploadImage = await upload(param.target.files[0]);
    let thumbnail = document.querySelector(".form-thumbnail");
    thumbnail.style.backgroundImage = `url("${uploadImage}")`;
    thumbnail.querySelector("div").classList.add("hidden");
}
//#endregion

window.addEventListener("pageshow", onLoad);