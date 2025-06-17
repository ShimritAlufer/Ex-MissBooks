import { debounce } from '../services/util.service.js'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { bookService } from "../services/book.service.js"

const { useState} = React

export function BookAdd() {
  const [searchTxt, setSearchTxt] = useState('')
  const [books, setBooks] = useState([])

  const debouncedSearch = debounce((txt) => {
    if (!txt) return
    console.log(txt)
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${txt}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.items || [])
      })
      .catch(err => {
                console.log('Problems getting books:', err)
                showErrorMsg('Problems getting books')
      })
  }, 500)

  function handleChange(ev) {
    const value = ev.target.value
    setSearchTxt(value)
    debouncedSearch(value)
  }


  function onAddGoogleBook(book) {
    bookService.addGoogleBook(book)
      .then(() => showSuccessMsg('Book susccesfully add!'))
      .catch(() => showErrorMsg('something went wrong'))
}

  return (
    <section className="book-add">
      <h2 className="add-book-title">Search Google Books</h2>
      <input type="text" className="tbSearchBar" value={searchTxt} onChange={handleChange}/>

      <ul className="google-search-list">
        {books.map(book => (
          <li key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <button className="btAddToList" onClick={() => onAddGoogleBook(book)}>+</button>
          </li>
        ))}
      </ul>
    </section>
  )
}