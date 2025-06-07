import { bookService } from "../services/book.service.js"
import { LongTxt } from "../cmps/LongTxt.jsx";

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouter
const { Link } = ReactRouterDOM

export function BookDetails() {
    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBook()
    }, [params.bookId])

    function loadBook() {
        setIsLoading(true)
        bookService.get(params.bookId)
            .then(setBook)
            .catch(() => {
                navigate(`/book`)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }


    function getBookDateLevel() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const yearsSinceOut = currentYear - book.publishedDate
        let dateLevelTxt = ''
        if (yearsSinceOut > 10) dateLevelTxt = 'Vintage Book'
        if (yearsSinceOut < 3) dateLevelTxt = 'New Book'
        return dateLevelTxt
    }

    function bookReadingLevel() {
        if (book.pageCount > 500) return 'Serious Reading'
        if (book.pageCount > 200) return 'Descent Reading'
        return 'Light Reading'
    }


    if (isLoading || !book) return <div className="loader"></div>

    const bookPriceClass = book.listPrice.amount > 200 ? 'high-price' : 'low-price';
    return (
        <article className='book-details'>
            <nav className='book-details-nav'>
                <Link to={`/book/${book.prevBookId}`}>
                    <button><i className="fa-solid fa-arrow-left"></i></button>
                </Link>
                <Link to={`/book/${book.nextBookId}`}>
                    <button><i className="fa-solid fa-arrow-right"></i></button>
                </Link>
            </nav>
            <h2>{book.title}</h2>
            <span>{getBookDateLevel()}</span>
            <h4>{bookReadingLevel()}</h4>

            <img className='book-img' src={book.thumbnail} alt="" />

            <p className={bookPriceClass}>
                <span className='bold-txt'>Price: </span>
                {book.listPrice.amount} {book.listPrice.currencyCode}
            </p>
            <p>
                <span className='bold-txt'>Language:</span>
                {book.language}
            </p>
            {book.categories && <p>
                <span className='bold-txt'>Categoric:</span> {book.categories}
            </p>}
            {book.authors && <p>
                <span className='bold-txt'>Authors:</span> {book.authors}
            </p>}
            {book.description && <LongTxt txt={book.description} />}
            {book.listPrice.isOnSale && <img className="on-sale-icon" src="/assets/booksImages/onSale.png.png" alt="" />}
            <button className='close'>
                <Link to='/book'>X</Link>
            </button>


        </article>
    )
}