import "./Menu.scss"
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/hooks";
import { authActions } from "../store/auth-slice";
import { Link } from 'react-router-dom';
import { MenuItem } from "../models/MenuItemModel";

interface MenuProps {
    items: MenuItem[];
    openModal?: () => void;
    modalParameter?: String;
}

const Menu: React.FC<MenuProps> = ({ items, openModal, modalParameter }) => {
const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
const loggedInUser = useAppSelector(state => state.auth.loggedInUser)
const dispatch = useDispatch();

const onLogOut = () => {
    dispatch(authActions.logout());
}

return (
    <div className="menuContainer">
    <div className="logo">
        <h2>No</h2><h4>te</h4><h2>Brain</h2>
    </div>

    {openModal && <div className="menuButton" onClick={openModal}>{modalParameter}</div>}
    {items.map((item, index) => (
        <Link key={index} to={item.link} onClick={item.onClick}>
        <div className="menuButton">{item.name}</div>
        </Link>
    ))}
    {isLoggedIn ? 
      
      <div className="menuButton" onClick={onLogOut}>Log out</div>:

      <Link to={"/Login"}>
        <div className="menuButton">Login</div>
      </Link>}

        <div className="loginStatus">  {isLoggedIn ? loggedInUser : "You are not logged in "}</div>
    </div>
)
};

export default Menu;
