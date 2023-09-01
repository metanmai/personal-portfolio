import './Video.css';

const VideoBackground = () => {
    return (
        <div className="video-container">
            <video autoPlay muted loop id="video-background">
                <source src="public/img/blue-blur.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default VideoBackground;
