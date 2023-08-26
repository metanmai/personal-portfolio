import './Typing.css'

const Typing = () => {
    return (
        <div className="input-wrapper">
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link href="https://fonts.googleapis.com/css2?family=Abyssinica+SIL&display=swap" rel="stylesheet"/>
            <h1>
              Hello! I&apos;m a&nbsp;<span className="typewriter"/>
            </h1>
        </div>
    );
};

export default Typing;