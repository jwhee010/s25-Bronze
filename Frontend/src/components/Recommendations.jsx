import React from "react";
import Navbar from "./Navbar";
import './Recommendations.css';
import { Divider } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const Recommendations = () => {

    const [recipe, setRecipe] = useState([]);

    const [expiringItems, setExpiringItems] = useState([]);

    const getRecipes = async(token) => {
        try {
            const response = await axios.get('http://localhost:80/recipe', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const rawRecipe = response.data.recipes;

            const groupIngredients = rawRecipe.reduce((acc, item) => {
                const { RecipeID, RecipeName, Instructions, RecipeLink, FoodName, QuantityRequired } = item;
                if (!acc[RecipeID]) {
                    acc[RecipeID] = {
                        RecipeID,
                        RecipeName,
                        Instructions,
                        RecipeLink,
                        Ingredients: []
                    };
                }

                acc[RecipeID].Ingredients.push( { FoodName, QuantityRequired });
                return acc;
            }, {});

            const completeRecipe = Object.values(groupIngredients);
            setRecipe(completeRecipe);

        } catch (error) {
            console.error('Error retrieving food items: ', error);
        }
    };

    const getExpiringItems = async(token) => {
        try {
            const response = await axios.get('http://localhost:80/exp/recipe', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setExpiringItems(response.data.expiringSoon);
        } catch (error) {
            console.error('Error retrieving expiring food items: ', error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        try {
            getRecipes(token);
            getExpiringItems(token);
        } catch(error) {
            console.error('Token decoding error: ', error);
        }
    }, []);

    return (
        <div>
            <Navbar />
            <h1 className="RecommendHeader">Recommendations</h1>

            {/* Spoilage box */}
            <h2 className = "nearSpoilWrapper">Food Items Currently Nearing Their Spoilage Date
                <div className="spoilList">
                    {expiringItems.map((item, index) => (
                        <div key={index}>
                            <p>{item.FoodName}   Quantity: {item.Quantity}</p>
                            <Divider/>
                        </div>
                    ))}

               </div>
            </h2>
            
            {/* Recipe Box */}
            <h2 className = "Recipewrapper"> Here Are Recipes Utilizing The Food Items Above
                 <div className = "recipeBox">
                    {recipe.map((item, index) => (
                        <div key={index} className="recipeItem">
                            <p className="recipeh1">{item.RecipeName}</p>
                            <p className="ingp">Source: {item.RecipeLink}</p>
                            <p className="indgredientsh1">Ingredients:</p>
                            {item.Ingredients.map((ingredient, idx) => (
                                <p key={idx} className="ingp">
                                    {ingredient.FoodName} Quantity: {ingredient.QuantityRequired}
                                </p>
                            ))}
                            <p className="directionh1">Directions:</p>
                            <p className="drp">{item.Instructions}</p>
                            <Divider  sx={{ borderBottomWidth: 5}}/>
                        </div>
                    ))}

                </div>
            </h2>

        </div>
    );
};

export default Recommendations;