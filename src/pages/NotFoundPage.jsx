import { Header } from '../components/Header';
import { Link } from 'react-router';
import './NotFoundPage.css';

export function NotFoundPage() {
    return (
        <>
            <title>404 Page Not Found</title>
            <Header />
            <div className="not-found-page">
                <div className="not-found-container">
                    <h1 className="not-found-code">404</h1>
                    <h2 className="not-found-title">Page Not Found</h2>
                    <p className="not-found-text">
                        We're sorry, the page you requested could not be found.
                    </p>
                    <Link to="/" className="not-found-button button-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
