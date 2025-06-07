const { Link } = ReactRouterDOM
const { useEffect, useState } = React
import { bookService } from "../services/book.service.js"
import { BookList } from "../cmps/BookList.jsx"

import { BookFilter } from '../cmps/BookFilter.jsx'
import { showSuccessMsg } from '../services/event-bus.service.js'


export function BookIndex() {
    const [books, setBooks] = useState([])
    const [filterBy, setFilterBy] = useState(bookService.getDefaultFilter())

    useEffect(() => {
        bookService.query(filterBy)
            .then(setBooks)
            .catch(err => console.log('err:', err))
    }, [filterBy])

    function onSetFilterBy(newFilter) {
        console.log('newFilter',newFilter)
        setFilterBy(prevFilter => ({ ...prevFilter, ...newFilter }))
    }

    function removeBook(bookId) {
        bookService.remove(bookId)
            .then(() => {
                setBooks(prevBooks => prevBooks.filter(book => bookId !== book.id))
                showSuccessMsg('Book has been successfully removed!')
            })
            .catch(() => {
                showErrorMsg(`couldn't remove book`)
                navigate('/book')
            })
    }

    const { minPrice, title } = filterBy
    return (
        <div className='books-container'>
            <h2>Books list</h2>
            <BookFilter filterBy={{ minPrice, title }} onSetFilterBy={onSetFilterBy} />
            <Link to="/book/edit"><button className='add-book'>Add book</button></Link>
            <BookList books={books} onRemove={removeBook} />
        </div>
    )

}
