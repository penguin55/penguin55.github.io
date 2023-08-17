let bookshelfServer = {}; // To save wishlisted book and readed book: Bookshelf Object format
let libraryServer = {}; // To save Book Data in local server: Book Object Format
let username = "";

let USER_KEY = "USER_KEY_STORAGE";
let BOOKSHELF_KEY = "BOOKSHELF_KEY_STORAGE";
let LIBRARY_KEY = "LIBRARY_KEY_STORAGE";

class Bookshelf {
    constructor(id, read){
        this.id = id;
        this.read = read;
    }
}

// #region JSON Function
function readLocalJSON(filePath) {
    return new Promise(function (resolve, reject) {
        var jsonRequest = new XMLHttpRequest();
        jsonRequest.overrideMimeType("application/json");
        jsonRequest.open("GET", filePath, true);
        jsonRequest.send();
        jsonRequest.onload = function () {
            if (jsonRequest.readyState === 4 && jsonRequest.status == "200") {
                return resolve(jsonRequest.responseText);
            } else {
                return reject(jsonRequest.status);
            }
        }
    });
}

async function fetchJSONData(filePath, callback) {
    let raw_data = await readLocalJSON(filePath);
    callback(JSON.parse(raw_data));
}
// #endregion 

//#region Storage
async function initStorage (){
    if (typeof (Storage) !== 'undefined'){
        if (localStorage.getItem(BOOKSHELF_KEY) === null) localStorage.setItem(BOOKSHELF_KEY, "{}");
        if (sessionStorage.getItem(USER_KEY) === null) sessionStorage.setItem(USER_KEY, '');
        if (localStorage.getItem(LIBRARY_KEY) === null) {
            await fetchJSONData("./data/book.json", (data)=> localStorage.setItem(LIBRARY_KEY, JSON.stringify(data)));
        }
    } else {
        alert("Browser tidak mendukung Storage");
    }
}

async function loadStorage(){
    await initStorage().then(()=>{
        //Load Bookshelf Data
        let bookshelfServer_String = localStorage.getItem(BOOKSHELF_KEY);
        let bookshelfServer_JSON = JSON.parse(bookshelfServer_String);
        bookshelfServer = Object.keys(bookshelfServer_JSON).length > 0 ? bookshelfServer_JSON : [];

        let libraryServer_String = localStorage.getItem(LIBRARY_KEY);
        let libraryServer_JSON = JSON.parse(libraryServer_String);
        libraryServer = libraryServer_JSON;

        let username_String = sessionStorage.getItem(USER_KEY);
        username = username_String;
    });
}

function saveStorage(){
    let currentBookshelfServer = JSON.stringify(bookshelfServer);
    let currentLibraryServer = JSON.stringify(libraryServer);
    
    localStorage.setItem(BOOKSHELF_KEY, currentBookshelfServer);
    localStorage.setItem(LIBRARY_KEY, currentLibraryServer);
}
//#endregion


// #region Public Function
function updateUsernameSession(value){
    sessionStorage.setItem(USER_KEY, value);
}

function saveBookmark(book_id, bookmark = true, callback){
    if (bookmark) bookshelfServer.push(new Bookshelf(book_id, false));
    else bookshelfServer = bookshelfServer.filter((book)=> { return book.id != book_id; });
    saveStorage();
    callback();
}

function readBook(book_id, read, callback){
    let bookIndex = bookshelfServer.findIndex((book)=> book.id === book_id);
    bookshelfServer[bookIndex].read = read;

    saveStorage();
    callback();
}

function removeBookFromLibrary(id, callback){
    bookshelfServer = bookshelfServer.filter((book)=> { return book.id != id; });
    libraryServer.books = libraryServer.books.filter((x) => { return x.id != id; });

    saveStorage();
    callback();
}
//#endregion

export {bookshelfServer, libraryServer, username, loadStorage, saveStorage, updateUsernameSession, saveBookmark, readBook, removeBookFromLibrary};