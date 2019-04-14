// Global app controller
//Development tools are stored in dev dependencies and other dependencies are like frame works and external libraries.
//--save-dev installs as a dev depnedency
//--save will not install as a dev dependency
//Packages can also be installed globally
//Webpack is the most commonly used asset bundler
//Bundles not only javascript files but also assets like css, 
//It bundles mulitple files into just one javascript file, one css, one .jpg and one .png


//global app contorller
//Exported value from test is stored in the num variable
// import num from './test';
// // import { fileURLToPath } from 'url';
// const x =23;
// console.log(`I imported ${num} from another module called test.js another one! var x is ${x}`);

//For webpack build or dev commands will save the index.html file to the disk but the command start will not ssave it to the disk but the webpack will stream it to the webpack server.
//Loaders allow to import and load different files and allow us to process like ES6 to ES5 and so on.

//.babelrc is the config file, //preset is a code transformation plugins, like pieces of code that actually transform our environment.
// last 5 versions will tell babel to figure out which ES6 features need to be converted to ES5 to work on the las 5 versions of all the browsers.

//Promises and other features not present in ES5 cannot be converted back these need to be polyfilled. Even array.from method.
//Some code that will implement ES5 -> polyfill. It is a substitute code. Polyfill needs to be added at the entry point. 
//3 step process of installing babel
// 1. install packags and add rules -> webpack.config.js
// 2. .babelrc a config file to tell babel which stuff to convert back to ES5 
// 3. include polyfill in the package.json by installing it to --save and not just --save-dev

//PROJECT STARTS
//By default, model is named with upper case like Search.js and not search.js
// import str from './models/Search';
//Never write file extensions for moduels, like Search ano not Search.js
//Named export is used to export mutliple things in a module.
// import {add as a, multiply as m, ID} from './view/searchView';
//Add and multiply should be the exact same name.
// import * as searchView from './view/searchView';

// console.log(`Using imported functions! ${a(ID,2)} and ${m(ID, 3)}. ${str}`);
// console.log(`Using imported functions! ${searchView.add(searchView.ID,2)} and ${searchView.multiply(searchView.ID, 3)}. ${str}`);
//API key is a password or unique id that each user can use to make reqeusts.
//API key = 921914eac9c6a11c1c32ea02821f7db6
//https://www.food2fork.com/api/search
//Using axios as fetch does not work for all the browsers.
// import axios from 'axios';



// async function getResults(query){
//     const key = '921914eac9c6a11c1c32ea02821f7db6';
//     try {
//         const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
//         const result = res.data.recipes;
//         console.log(result);
//     } catch (error){
//         alert(error);
//     }
    
// }
// getResults('tomato pasta');

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import *  as searchView  from './view/searchView';
import *  as recipeView  from './view/recipeView';
import *  as listView  from './view/listView';
import *  as likesView  from './view/likesView';
import { elements, renderLoader, clearLoader, elementStrings } from './view/base';



//Controllert, everything goes into one.  
//State management is very important . Tells the state of our current application.
//There are libraries like redact and others that are very important for state management.
//The object that represents the current stage of the app is called a store.
/**
 * -Search object -> Search query and search results.
 * -current recipe object.
 * -Shopping list object
 * -liked recipe
 */
const state = {};

//controller search function
/**
 * Search controller
 */
const controlSearch = async () => {
    //1. Get query from the view
    const query = searchView.getInput(); //TODO

    if(query){
        //2) new search object and add to stage. the search object is created inside the state object.
        state.search = new Search(query);

        //3) prepare UI results.
        searchView.clearInput();
        //clear results from the previous search
        searchView.clearResults();
        //search loader spinner
        renderLoader(elements.searchResult);

        try {     
            //4) search for recipes. the await makes the controlSearch function as async function.
            await state.search.getResults();

            //Render the results on the UI.
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong')
            clearLoader();
        }


    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


//Since the buttons are not created when the page is loaded, the event delegation happens such that the event hablder is added to the element that is actually present

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * Recipe controller
 */
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);
//Use the hash change event -> fired off when the hash of the url is changed
const controlRecipe = async () => {
    //Get ID from teh URL
    const id = window.location.hash.replace('#', '');
    if(id){
        //Prepare the UI for changes
        renderLoader(elements.recipe);

        //Highlight selected search type
        if(state.search){
            searchView.highlightSelected(id);
        }        

        //Create a new recipe object
        state.recipe = new Recipe (id);
        
        try {
            //get recipe data and parseIngredients.
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servigns and time
            state.recipe.calServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            console.log(err);
            alert('Error processing recipe');
        }
    } 

};

//Event listener is added on the window and not just on the document. This is to check the changes in the URL. window is the global object
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

//Add event listener to 2 events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * List controller
 */
const controlList = () => {
    //Create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list
    state.recipe.ingredients.forEach( el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

/**
 * Like controller
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //User has not yet liked the current recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLikes(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike);

    //user has liked the current recipe
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove from the UI
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



//handle delete and update list item events.
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);
        //Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});


//Restore liked recipes
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    //Restore likes
    state.likes.readStorage();
    
    //Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the recipe
    state.likes.likes.forEach(like => likesView.renderLike(like));

});


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }        
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        //Call the like controller
        controlLike();
    }
});