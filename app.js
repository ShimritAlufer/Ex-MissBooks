import { App } from './RootCmp.jsx'
import { bookService } from "./services/book.service.js"

window.bookService = bookService


const elContainer = document.getElementById('root')
const root = ReactDOM.createRoot(elContainer)
root.render(<App />);
