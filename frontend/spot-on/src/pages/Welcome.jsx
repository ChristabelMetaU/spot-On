import { Link } from 'react-router-dom';
import "../styles/pages.css"
const welcome = () => {
  return (
   <div className='welcome-page'>

          <h1>Spot On</h1>
        <p>Parking made easier for YOU</p>
        <p>find the parking spot for you</p>
        <Link to="/signup"><button className='btn-start'>Sign In</button></Link>
        <Link to="/login"><button className='btn-start'>Login</button></Link>
   </div>
  )
}

export default welcome;
