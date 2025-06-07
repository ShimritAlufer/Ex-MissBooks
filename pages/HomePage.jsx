const { useRef, useEffect } = React

export function HomePage() {
    const h1Ref = useRef()

    useEffect(() => {
        console.log('h1Ref:', h1Ref)
    }, [])

    return (
        <section className="home">
            <h1 ref={h1Ref}>Welcome to Miss Book</h1>
            <img src="../assets/img/MissBooks.jpg" alt="Miss-image" />
        </section>
    )
}