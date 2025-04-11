import React from "react";
import Navbar from "./Navbar";
import './Recommendations.css';
import { Divider } from "@mui/material";

const Recommendations = () => {
    return (
        <div>
            <Navbar />
            <h1 className="RecommendHeader">Recommendations</h1>

            {/* Spoilage box */}
            <h2 className = "nearSpoilWrapper">Food Items Currently Nearing Their Spoilage Date
                <div className="spoilList">
                    <p>Tomatos   Quantity: 3</p>
                    <Divider/>
                    <p>Test1   Quantity: 1</p>
                    <Divider/>
                    <p>Test2   Quantity: 2</p>
                    <Divider/>
                    <p>Test3   Quantity: 3</p>
                    <Divider/>
                    <p>Test4   Quantity: 4</p>
                    <Divider/>
               </div>
            </h2>
            
            {/* Recipe Box */}
            <h2 className = "Recipewrapper"> Here Are Recipes Utilizing The Food Items Above
                 <div className = "recipeBox">

                    <p className="recipeh1">Recipe Name</p>
                    <p className="ingredientsh1">Ingredients:</p>
                    {/* push Ingredients as p1 elements with a break*/}
                    <p className="ingp">Tomato  Quantity: 2</p>
                    <p className="ingp">Test2  Quantity: 5oz</p>
                    <p className="ingp">Test3  Quantity: 6oz</p>
                    <p className="ingp">Test4  Quantity: 7oz</p>
                    <p className="ingp">Test5  Quantity: 8</p>
        
                    <p className="directionh1">Directions:</p>
                    <p className="drp">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua !. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat !. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur !. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum !.
                   </p>

                   <Divider  sx={{ borderBottomWidth: 5}}/>

                   <p className="recipeh1">Recipe Name</p>
                    <p className="ingredientsh1">Ingredients:</p>
               
                    <p className="ingp">Tomato  Quantity: 2</p>
                    <p className="ingp">Test2  Quantity: 5oz</p>
                    <p className="ingp">Test3  Quantity: 6oz</p>
                    <p className="ingp">Test4  Quantity: 7oz</p>
                    <p className="ingp">Test5  Quantity: 8</p>
        
                    <p className="directionh1">Directions:</p>
                    {/* this was to see if the text would wrap */}
                    <p className="drp">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua !. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat !. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur !. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum !.
                   </p>

                </div>
            </h2>

        
            






        </div>
    );
};

export default Recommendations;