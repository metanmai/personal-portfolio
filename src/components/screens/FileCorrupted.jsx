import { Link } from 'react-router-dom';
import ScreenFrame from './ScreenFrame.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const FileCorrupted = () => {
    usePageMeta('404 — FILE CORRUPTED');

    return (
        <ScreenFrame title="ERROR 404">
            <pre>{`
!!! FILE CORRUPTED !!!

THE REQUESTED RECORD COULD NOT BE RECOVERED.
DATA INTEGRITY CHECK ............ FAILED
SECTOR SCAN ..................... NO CARRIER
            `}</pre>
            <p>
                &gt; <Link to="/">RETURN TO MAIN MENU</Link>
            </p>
        </ScreenFrame>
    );
};

export default FileCorrupted;
