import { Link, useRouteError } from "react-router-dom";
import "./styles/errorPage.css";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <section className="error-page">
      <div className="error-wrapper">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message || error.data}</i>
        </p>
        <p>
          Go back to <Link to="/">Home Page</Link>
        </p>
      </div>
    </section>
  );
};

export default ErrorPage;
