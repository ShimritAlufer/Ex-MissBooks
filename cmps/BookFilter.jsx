import { debounce } from "../services/util.service.js"

const { useEffect, useState, useRef } = React

export function BookFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const initialFilterBy = useRef({ ...filterBy })
    const onSetFilterDebounce = useRef(debounce(onSetFilterBy, 400)).current

    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name: field, type } = target
        const value = type === 'number' ? +target.value : target.value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function reset() {
        setFilterByToEdit(initialFilterBy.current)
    }

    return (
        <section className='books-filter'>
            <h3>Filter</h3>
            <input onChange={handleChange} value={filterByToEdit.title} type="text" name='title' placeholder='Insert book name' />
            <input onChange={handleChange} value={filterByToEdit.minPrice || ''} type="number" name='minPrice' placeholder='Insert book price' />
            <button onClick={reset}>Reset</button>
        </section>
    )
}