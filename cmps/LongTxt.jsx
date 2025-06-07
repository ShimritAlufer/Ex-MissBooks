const { useState, useEffect, useRef } = React

export function LongTxt({ txt, limit = 100 }) {
    
    const [isShowFullTxt, setIsShowFullTxt] = useState(false)


    function onToggleIsShowFullTxt() {
        setIsShowFullTxt(prev => !prev)
    }

    const isTextTooLong = txt.length > limit
    const textToShow = (isShowFullTxt || !isTextTooLong) ? txt : (txt.substring(0, limit)) + '...'
    return (
        <section className="long-txt">
            <p className="txt" >{textToShow}</p>
            {isTextTooLong &&
                <div>
                    <button className="show-txt-btn" onClick={onToggleIsShowFullTxt}>
                        {isShowFullTxt ? 'Show Less' : 'Read More'}
                    </button>
                </div>
            }
        </section>
    )
}