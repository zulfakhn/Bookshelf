let books = [];
let book = {};
const empty = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
    const items = JSON.parse(localStorage.getItem("books"));
    if (items && items.length > 0) {
        books = items
    }

    const submitForm = document.getElementById("inputBook");
    const submitSearch = document.getElementById("searchBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    submitSearch.addEventListener("submit", function (e) {
        e.preventDefault();
        handleSearch();
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incompleteBookshelfList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    const checkSearch = document.getElementById("searchBookTitle").value;
    if (checkSearch !== "" && checkSearch.toLowerCase() === (book.judul ? book.judul.toLowerCase() : null)) {
        if (book.isComplete === false) {
            let bookElement = makeListBooks(book);
            uncompletedBookList.append(bookElement);
        } else {
            let bookElement = makeListBooks(book);
            completedBookList.append(bookElement);
        }
    } else if (checkSearch !== "" && checkSearch.toLowerCase() !== (book.judul ? book.judul.toLowerCase() : null)) {
        for (bookItem of empty) {
            if (bookItem.isComplete === false) {
                let bookElement = makeListBooks(bookItem);
                uncompletedBookList.append(bookElement);
            } else {
                let bookElement = makeListBooks(bookItem);
                completedBookList.append(bookElement);
            }
        }
    } else {
        for (bookItem of books) {
            if (bookItem.isComplete === false) {
                let bookElement = makeListBooks(bookItem);
                uncompletedBookList.append(bookElement);
            } else {
                let bookElement = makeListBooks(bookItem);
                completedBookList.append(bookElement);
            }
        }
    }
});

function handleSearch() {
    const search = document.getElementById("searchBookTitle").value;
    let filter = search.toLowerCase();
    books.map((e) => {
        if (e.judul.toLowerCase() === filter) {
            book = e;
        }
    })
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function addBook() {
    const judul = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const status = document.getElementById("inputBookIsComplete");

    let isComplete = ""
    if (status.checked) {
        isComplete = true
    } else {
        isComplete = false
    }

    const generatedID = generateId();
    const BooksObject = generateBooksObject(generatedID, judul, author, year, isComplete);
    books.push(BooksObject);
    localStorage.setItem("books", JSON.stringify(books))

    document.dispatchEvent(new Event(RENDER_EVENT));
    clear();
};

function generateId() {
    return +new Date();
};

function generateBooksObject(id, judul, author, year, isComplete) {
    return {
        id,
        judul,
        author,
        year,
        isComplete
    }
};

function makeListBooks(bookObject) {
    const container = document.createElement("article");

    if (bookObject.isComplete === false) {
        const judul = document.createElement("h3");
        judul.innerText = `Book Title: ${bookObject.judul}`;

        const author = document.createElement("p");
        author.innerText = `Author: ${bookObject.author}`;

        const year = document.createElement("p");
        year.innerText = `Year: ${bookObject.year}`;

        container.classList.add("book-item")
        container.setAttribute("id", `book-item`);

        const btnDone = document.createElement("button");
        var textDone = document.createTextNode("Done");
        btnDone.append(textDone);
        btnDone.classList.add("green")

        btnDone.addEventListener("click", function () {
            toCompletedRead(bookObject.id);
        });

        const btnRemove = document.createElement("button");
        var textRemove = document.createTextNode("Remove Book");
        btnRemove.append(textRemove);
        btnRemove.classList.add("red");

        btnRemove.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        const action = document.createElement("div");
        action.classList.add("action");

        action.append(btnDone, btnRemove);
        container.append(judul, author, year, action);
    } else {
        const judul = document.createElement("h3");
        judul.innerText = `Book Title: ${bookObject.judul}`;

        const author = document.createElement("p");
        author.innerText = `Author: ${bookObject.author}`;

        const year = document.createElement("p");
        year.innerText = `Year: ${bookObject.year}`;

        container.classList.add("book-item2")
        container.setAttribute("id", `book-item2`);

        const btnUnfinished = document.createElement("button");
        var textDone = document.createTextNode("Unfinished");
        btnUnfinished.append(textDone);
        btnUnfinished.classList.add("green")

        btnUnfinished.addEventListener("click", function () {
            toUncompletedRead(bookObject.id);
        });

        const btnRemove = document.createElement("button");
        var textRemove = document.createTextNode("Remove Book");
        btnRemove.append(textRemove);
        btnRemove.classList.add("red");

        btnRemove.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        const action = document.createElement("div");
        action.classList.add("action");

        action.append(btnUnfinished, btnRemove);
        container.append(judul, author, year, action);
    }

    return container;
};

function toCompletedRead(id) {
    books.map((e) => {
        if (e.id === id) {
            e.isComplete = true
        }
    });

    localStorage.setItem("books", JSON.stringify(books))
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function toUncompletedRead(id) {
    books.map((e) => {
        if (e.id === id) {
            e.isComplete = false
        }
    });

    localStorage.setItem("books", JSON.stringify(books))
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function removeBook(id) {
    var tanya = confirm("Yakin Kamu Akan Mengapusnya?");

    if (tanya === true) {
        const bookTarget = findBookIndex(id);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);

        localStorage.setItem("books", JSON.stringify(books))
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
};

function findBookIndex(id) {
    for (index in books) {
        if (books[index].id === id) {
            return index
        }
    }
    return -1
};

function clear() {
    const judul = document.getElementById("inputBookTitle").value = "";
    const author = document.getElementById("inputBookAuthor").value = "";
    const year = document.getElementById("inputBookYear").value = "";
    const status = document.getElementById("inputBookIsComplete");

    status.checked = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
};