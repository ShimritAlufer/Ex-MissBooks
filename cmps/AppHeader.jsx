const { Link, NavLink } = ReactRouterDOM

export function AppHeader() {
    return (
        <header className="app-header full main-layout">
            <section>
                <h1>React Miss Book App</h1>
                <nav className="app-nav">
                    <NavLink to="/home">Home Page</NavLink>
                    <NavLink to="/about">About Us</NavLink>
                    <NavLink to="/book">Books</NavLink>
                </nav>
            </section>
        </header>
    )
}