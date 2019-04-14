// export const add = (a,b) => a + b;
// export const multiply = (a,b) => a * b;
// export const ID = 23;
//Bunch of functions that are to be exported using named exports

import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
    
};

export const limitRecipeTitle = (title, limit = 17) => {
    //Craeting a const with for arary such that the array mutation is performed is possible. New are not mutating the underlying variable when we add or remove entries from the array. Same goes for objects.
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result, join is the opposite of split and joins the element of an array into a String separated by spaces.
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeEnd', markup);
};

//Type can be 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        
    </button>
    <!--
    <button class="btn-inline results__btn--prev">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page 1</span>
    </button>
    <button class="btn-inline results__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>
    -->
`;

const renderButtons = (page, numResults, resPerPage) => {
    const totalPages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && totalPages > 1){
        //Button to next page
        button = createButton(page, 'next');
    } else if (page === totalPages && totalPages > 1){
        //Button to previous page.
        button = createButton(page, 'next');
    } else if (page < totalPages){
        //Button is previous and next.
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;        
    }

    //Add the buttons to the HTML page
    elements.searchResultPages.insertAdjacentHTML('afterBegin', button);
}; 

export const renderResults = (recipes, page  = 1, resPerPage = 10)  => {
    //instead of recipes.forEach(el => renderRecipe(el)) the bottom version will automatically pass the current eleement in the the recipe vv
    //Redering results of current page.
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage; 
    
    recipes.slice(start, end).forEach(renderRecipe);
    //render the pagination buttons
    renderButtons(page, recipes.length, resPerPage);

};