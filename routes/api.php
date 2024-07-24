<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Collections\ProductCollection;
use App\Http\Controllers\Files\FolderController;
use App\Http\Controllers\Files\FileController;
use App\Http\Controllers\Products\ProductsController;
use App\Http\Controllers\Slide\SlidesController;
use App\Http\Controllers\Bills\BillsController;
use App\Http\Controllers\Customers\CustomersController;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Carts\CartsController;
use App\Http\Controllers\Contacts\ContactsController;
use App\Http\Controllers\Comments\CommentController;
use App\Http\Controllers\Reviews\ReviewController;
use App\Http\Controllers\Brands\BrandController;

Route::get('collections',[ProductCollection::class,'api_collections']);
Route::get('collections/{id}',[ProductCollection::class,'api_children_collections']);

//======================================================================
Route::get('brands',[BrandController::class,'api_brands']);
Route::get('brands/{id}',[BrandController::class,'api_children_brands']);

//======================================================================
Route::get('products',[ProductsController::class,'api_products']);
Route::get('products-name',[ProductsController::class,'api_get_productName']);
Route::get('categories',[ProductsController::class,'api_all_products']);
Route::get('products-categories/{id}',[ProductsController::class,'api_categories_products']);
Route::get('products/{id}',[ProductsController::class,'api_single']);
Route::get('filter-products/{id}',[ProductsController::class,'api_search_products']);
Route::get('products-comments/{id}',[CommentController::class,'getProductComment']);
Route::get('products-reviews/{id}',[CommentController::class,'getProductComment']);
//======================================================================
Route::get('slides/{id}',[SlidesController::class,'api_slides']);

Route::middleware(['web'])->group(function () {
    Route::get('/folder',[FileController::class,'get_folder']);
    Route::get('/files/{id}',[FileController::class,'get_files']);
    Route::post('/rename-folder/{id}',[FileController::class,'rename_folder']);
});

Route::post('/products-import', [ProductsController::class,'Import']);

Route::post('/product-crawler',[ProductsController::class,'api_import']);

Route::post('/products/loadCart',[ProductsController::class,'api_load_cart_product']);

Route::post('/',[BillsController::class,'store']);
//===================================================

Route::prefix('carts')->middleware('auth:sanctum')->group(function () {
    Route::get('/',[CartsController::class,'index']);
    Route::post('/',[CartsController::class,'store']);
    Route::delete('/{id}',[CartsController::class,'destroy']);
    Route::get('/{id}',[CartsController::class,'show']);
});
//===================================================

Route::prefix('customers')->group(function () {
    Route::get('/',[CustomersController::class,'show'])->middleware('auth:sanctum');
    Route::post('/auth/register',[CustomersController::class,'store']);
    Route::post('/auth/login',[CustomersController::class,'CheckLogin']);
    Route::post('/comment',[CommentController::class,'store'])->middleware('auth:sanctum');
    Route::post('/can-review',[ReviewController::class,'can_review'])->middleware('auth:sanctum');
    Route::post('/review',[ReviewController::class,'store'])->middleware('auth:sanctum');
    Route::post('/auth/login-email',[CustomersController::class,'CheckLoginSocial']);
    Route::get('/bills',[CustomersController::class,'get_bills'])->middleware('auth:sanctum');
});

Route::prefix('contact')->group(function () {
    Route::post('/',[ContactsController::class,'store']);
});

Route::prefix('bills')->group(function () {
    Route::post('/',[BillsController::class,'store']);
    Route::post('/login',[BillsController::class,'store2']);
});

Route::prefix('posts')->group(function () {
    Route::get('/',[PostController::class,'api_post']);
    Route::get('/highlight',[PostController::class,'api_highlight']);
    Route::get('/{id}',[PostController::class,'single_post']);
});

Route::get('/checkLogin',[CartsController::class,'countCart'])->middleware('auth:sanctum');
