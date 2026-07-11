import {Link,useLocation} from 'react-router-dom';

function Navbar(){
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active': '';

    return(
        <nav className='navbar'>
            <Link to="/" className='navbar-brand'>Price Intelligence</Link>
            <Link to="/" className={isActive('/')}>Dashboard</Link>
            <Link to="/review" className={isActive('/review')}>Price Review</Link>
            <Link to='/risk' className={isActive('/risk')}>Quote Risk</Link>
            <Link to='/feed' className={isActive('/feed')}>Live Feed</Link>
        </nav>
    );
}

export default Navbar;