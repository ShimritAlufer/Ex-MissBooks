const { Link } = ReactRouterDOM

import { BookPreview } from "./BookPreview.jsx"

export function BookList({ books, onRemove }) {
    return (
    <section className='books-list'>
        <ul>
            {books.map(book =>
                <li key={book.id}>
                    <BookPreview book={book} />
                    <button onClick={() => onRemove(book.id)} className='close'><i className="fa-regular fa-trash-can"></i></button>
                    <nav className='book-nav'>
                        <Link to={`/book/${book.id}`}><button className="nav-btns">Details</button></Link>
                        <Link to={`/book/edit/${book.id}`}><button className="nav-btns">Edit</button></Link>
                    </nav>
                </li>
            )}
        </ul>
    </section>
    )
}