import React from "react";
import Navbar from "./Navbar";
import FriendList from "./FriendList";
import Sharing from "./Sharing";

const ShelfFriends = () => {
    return  (
        <div>
            <Navbar />
            <h1>ShelfFriends</h1>
            <FriendList/>
            <Sharing/>
        </div>
    );
};

export default ShelfFriends;