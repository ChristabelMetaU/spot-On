import {Link} from 'react-router-dom';
const Nav = () => {
  return (
    <nav>
        <button className='default'>Map</button>
        <button className='btn-nav'>Filters</button>
       <Link to="/map"><button className='btn-nav'>Profile</button></Link>
    </nav>
  )
}

export default Nav;
