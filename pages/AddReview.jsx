import { bookService } from "../services/book.service.js"
import { showErrorMsg } from '../services/event-bus.service.js'
import { showSuccessMsg } from '../services/event-bus.service.js'
const { useNavigate } = ReactRouter

const { useState, useEffect } = React

export function AddReview({bookId}){
    const [review, setReview] = useState({fullname: '', rating: 0, readAt: ''})
    const navigate = useNavigate()

    function handleChange(ev) {
        const { name, value } = ev.target
        setReview(prevReview => ({...prevReview,
            [name]: value
        }))
    }

    function onSave(ev) {
        ev.preventDefault()
        bookService.saveReview(bookId, review)
            .then(() => showSuccessMsg('Book has successfully saved!'))
            .catch(() => showErrorMsg(`couldn't save book`))
            .finally(() => navigate('/book'))
    }

    return <section className='book-edit'>
        <h2>Add Review</h2>
        <form onSubmit={onSave}>
            <label className='bold-txt' htmlFor="fullname">Fullname: </label><br/>
            <input onChange={handleChange} id="fullname" type="text" name='fullname' />
            <br/>

            <label className='bold-txt' htmlFor="rating">Rating:</label><br/>
            <div className="star-rating edit">
            {[1, 2, 3, 4, 5].map(num => (
                <span key={num} className={`star ${num <= review.rating ? 'on' : 'off'}`}
                onClick={() => setReview(prev => ({ ...prev, rating: num }))}>
                ★
                </span>
            ))}
            </div>
            <br/>

            <label className='bold-txt' htmlFor="ReadAt">Read At:</label><br/>
            <input id="ReadAt" type="date" name="readAt" value={review.readAt} onChange={handleChange}/>
            <br/>

            <button type="submit">Save</button>
        </form>
    </section>
}