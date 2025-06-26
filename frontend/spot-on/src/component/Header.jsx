import {useAuth} from "./AuthContext";
const Header = () => {
     const {user, logout} = useAuth();
    return (
        <header className="header">
            welcome, {user?.username}
            <h1>Spot On</h1>

        </header>
    )
}

export default Header;
