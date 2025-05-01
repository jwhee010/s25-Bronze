import Navbar from "./Navbar";
import FriendList from "./FriendList";
import Sharing from "./Sharing";
import './ShelfFriends.css';

const ShelfFriends = () => {
    return  (
        <div>
            <Navbar />
            <h1 className = "shelfHeader">Shelf Friends</h1>
            <FriendList/>
            <Sharing/>
        </div>
    );
};

export default ShelfFriends;