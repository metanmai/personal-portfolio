import './Typing.css'
import './Typing.js'

const Typing = () => {
    return (
        <div className="input-wrapper">
            <h2> Hello! I am</h2>
            <h1 className={`typewriter`} />
        </div>
    );
};

export default Typing;