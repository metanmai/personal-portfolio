import './Typing.css'
import './Typing.js'

const Typing = () => {
    return (
        <div className="input-wrapper">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap" rel="stylesheet"/>
            <h2> Hello! I am</h2>
            <h1 className={`typewriter`} />
        </div>
    );
};

export default Typing;