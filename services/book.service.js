import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BOOK_KEY = 'bookDB'
_createBooks()

export const bookService = {
    query,
    get,
    remove,
    save,
    getEmptyBook,
    getDefaultFilter,
    saveReview,
    removeReview,
    getGoogleBooks,
    addGoogleBook,
    getEmptyReview
}


function query(filterBy = {}) {
    return storageService.query(BOOK_KEY)
        .then(books => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                books = books.filter(book => regExp.test(book.title))
            }
            if (filterBy.minPrice) {
                books = books.filter(book => book.listPrice.amount >= filterBy.minPrice)
            }
            return books
        })
}

function get(bookId) {
    return storageService.get(BOOK_KEY, bookId).then(_setNextPrevBookId)
}

function remove(bookId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(BOOK_KEY, bookId)
}

function save(book) {
    if (book.id) {
        return storageService.put(BOOK_KEY, book)
    } else {
        return storageService.post(BOOK_KEY, book)
    }
}

function getEmptyBook(title = '', amount = '', description = '', pageCount = '', language = 'en', authors = '') {
    return {
        title,
        authors,
        description,
        pageCount,
        thumbnail: `/assets/booksImages/15.jpg`,
        language,
        listPrice: {
            amount,
            currencyCode: "EUR",
            isOnSale: Math.random() > 0.7
        },
        reviews: []
    }
}

function getDefaultFilter(filterBy = { title: '', minPrice: 0, maxPrice: 0 }) {
    return { title: filterBy.title, minPrice: filterBy.minPrice, maxPrice: 0 }
}

function _createBooks() {
    const ctgs = ['Love', 'Fiction', 'Poetry', 'Computers', 'Religion']
    const books = utilService.loadFromStorage(BOOK_KEY) || []

    if (books && books.length) return

    for (let i = 0; i < 20; i++) {
        const book = {
            id: utilService.makeId(),
            title: utilService.makeLorem(2),
            subtitle: utilService.makeLorem(4),
            authors: [
                utilService.makeLorem(1)
            ],
            publishedDate: utilService.getRandomIntInclusive(1950, 2024),
            description: utilService.makeLorem(20),
            pageCount: utilService.getRandomIntInclusive(20, 600),
            categories: [ctgs[utilService.getRandomIntInclusive(0, ctgs.length - 1)]],
            thumbnail: `/assets/booksImages/${i + 1}.jpg`,
            language: "en",
            listPrice: {
                amount: utilService.getRandomIntInclusive(80, 500),
                currencyCode: "EUR",
                isOnSale: Math.random() > 0.7
            },
            reviews: []
        }
        books.push(book)
    }
    utilService.saveToStorage(BOOK_KEY, books)
}

function _setNextPrevBookId(book) {
    return query().then((books) => {
        const bookIdx = books.findIndex((currBook) => currBook.id === book.id)
        const nextBook = books[bookIdx + 1] ? books[bookIdx + 1] : books[0]
        const prevBook = books[bookIdx - 1] ? books[bookIdx - 1] : books[books.length - 1]
        book.nextBookId = nextBook.id
        book.prevBookId = prevBook.id
        return book
    })
}

function saveReview(bookId, reviewToSave) {
    return get(bookId).then(book => {
        const review = _createReview(reviewToSave)
        book.reviews.unshift(review)
        return save(book).then(() => review)
    })
}


function getEmptyReview() {
    return {
        fullName: 'new name',
        rating: 0,
        date: new Date().toISOString().slice(0, 10),
        txt: '',
        selected: 0,
    }
}

function removeReview(bookId, reviewId) {
    return get(bookId).then(book => {
        const newReviews = book.reviews.filter((review) => review.id !== reviewId)
        book.reviews = newReviews
        return save(book)
    })
}

function addGoogleBook(book) {
    return storageService.post(BOOK_KEY, book, false)
}

function getGoogleBooks(bookName) {
    if (bookName === '') return Promise.resolve()
    const googleBooks = gCache[bookName]
    if (googleBooks) {
        console.log('data from storage...', googleBooks)
        return Promise.resolve(googleBooks)
    }

    const url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${bookName}`
    return axios.get(url)
        .then(res => {
            const data = res.data.items
            console.log('data from network...', data)
            const books = _formatGoogleBooks(data)
            gCache[bookName] = books
            utilService.saveToStorage(CACHE_STORAGE_KEY, gCache)
            return books
        })
}


function _createReview(reviewToSave) {
    return {
        id: utilService.makeId(),
        ...reviewToSave,
    }
}

function _formatGoogleBooks(googleBooks) {
    return googleBooks.map(googleBook => {
        const { volumeInfo } = googleBook
        const book = {
            id: googleBook.id,
            title: volumeInfo.title,
            description: volumeInfo.description,
            pageCount: volumeInfo.pageCount,
            authors: volumeInfo.authors,
            categories: volumeInfo.categories,
            publishedDate: volumeInfo.publishedDate,
            language: volumeInfo.language,
            listPrice: {
                amount: utilService.getRandomIntInclusive(80, 500),
                currencyCode: "EUR",
                isOnSale: Math.random() > 0.7
            },
            reviews: []
        }
        if (volumeInfo.imageLinks) book.thumbnail = volumeInfo.imageLinks.thumbnail
        return book
    })
}
