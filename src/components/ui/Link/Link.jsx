import { Link, useLocation } from 'react-router-dom';

export function LinkWithParams({ to, children, ...props }) {
  const location = useLocation();
  return (
    <Link {...props} to={`${to}${location.search}`}>
      {children}
    </Link>
  );
}
