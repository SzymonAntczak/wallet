import Link from 'next/link';

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign up', href: '/auth/sign-up' },
    !currentUser && { label: 'Sign in', href: '/auth/sign-in' },
    currentUser && { label: 'Sign out', href: '/auth/sign-out' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href} className="nav-link">
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        <div className="navbar-brand">Wallet</div>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
