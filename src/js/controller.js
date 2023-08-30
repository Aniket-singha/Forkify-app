 import 'core-js/stable';
 import 'regenerator-runtime/runtime';
 import * as model from './model.js';
import icons from 'url:../img/icons.svg';
import { MODAL_CLOSE_SECONDS } from './config.js';
import RecipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeVIew.js'
import recipeview from './views/recipeview.js';




// https://forkify-api.herokuapp.com/v2

if(module.hot){
    module.hot.accept();
}


const controlRecipes = async function () {
      
    try {
      const id= window.location.hash.slice(1);
      if(!id) return;


      RecipeView.renderspinner();
      bookmarksView.render(model.state.bookmarks);
     await model.loadRecipe(id);
    //  const {recipe}=model.state;

     RecipeView.render(model.state.recipe);
      
     
     

    }
    catch (err) {
        RecipeView.renderError();
    }

}

const controlSearchResults= async function(){
    try{
        resultsView.renderspinner();
        const query= searchView.getQuery();
        if(!query) return;
          await model.loadSearchResults(query);
        //   console.log(model.state.search.results);
          resultsView.render(model.getSearchResultsPage());

         paginationView.render(model.state.search) 
    }
    catch(err){
        console.log(err);
    }
};

const controlPagination=function(goToPage){

    resultsView.render(model.getSearchResultsPage(goToPage));
    paginationView.render(model.state.search);

}

const controlServings=function(newServings){
 
    model.updateServings(newServings);
    // RecipeView.render(model.state.recipe);
    RecipeView.render(model.state.recipe);

};

const controlAddBookmark=function(){

    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    RecipeView.render(model.state.recipe)
    bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks=function(){
    bookmarksView.render(model.state.bookmarks);
}
const controlAddRecipe= async function(newRecipe){
    try{
 await model.uploadRecipe(newRecipe);

    recipeview.render(model.state.recipe);
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null,'',`#${model.state.recipe.id}`);

    setTimeout(function(){
        addRecipeView.toggleWindow();
    },MODAL_CLOSE_SECONDS*1000)
    }
    catch(err){
        addRecipeView.renderError(err.message);
    }
}
const init=function(){
bookmarksView.addHandlerRender(controlBookmarks);
RecipeView.addHandlerRender(controlRecipes);
RecipeView.addHandlerUpdateServings(controlServings);
RecipeView.addHandlerAddBookmark(controlAddBookmark);
searchView.addHandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlPagination);
addRecipeView._addHandlerUpload(controlAddRecipe);

};


init();
// showrecipe();
// ['hashchange','load'].forEach(ev=>window.addEventListener(ev,controlRecipes));
// window.addEventListener('hashchange',controlRecipes());
// window.addEventListener('load',controlRecipes());


