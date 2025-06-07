import { BookList } from "../cmps/BookList.jsx"
import { bookService } from "../services/book.service.js"

const { useEffect, useState } = React


export function BookIndex() {
    const [books, setBooks] = useState(null)
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())

    useEffect(() => {
        loadBooks()
    }, [filterBy])

    function loadBooks() {
        bookService.query(filterBy)
            .then(setBooks)
            .catch(err => {
                console.log('Problems getting books:', err)
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!books) return <div>Loading...</div>
    return (
        <section className="book-index">
            {/* <CarFilter onSetFilter={onSetFilter} filterBy={filterBy} /> */}
            <BookList
                books={books}
                //onRemoveBook={onRemoveBook}
            />

        </section>
    )

}

// const [books, setBooks] = useState([])
//     const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())

//     useEffect(() => {
//         bookService.query(filterBy)
//             .then(setBooks)
//             .catch(err => console.log('err:', err))
//     }, [filterBy])

//     function onSetFilterBy(newFilter) {
//         console.log('newFilter',newFilter)
//         setFilterBy(prevFilter => ({ ...prevFilter, ...newFilter }))
//     }

//     function removeBook(bookId) {
//         bookService.remove(bookId)
//             .then(() => {
//                 setBooks(prevBooks => prevBooks.filter(book => bookId !== book.id))
//                 showSuccessMsg('Book has been successfully removed!')
//             })
//             .catch(() => {
//                 showErrorMsg(`couldn't remove book`)
//                 navigate('/book')
//             })
//     }

//     const { minPrice, title } = filterBy
//     return (
//         <div className='books-container'>
//             <h2>Books list</h2>
//             <BookFilter filterBy={{ minPrice, title }} onSetFilterBy={onSetFilterBy} />
//             <Link to="/book/edit"><button className='add-book'>Add book</button></Link>
//             <BookList books={books} onRemove={removeBook} />
//         </div>
//     )

