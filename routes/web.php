<?php

use App\Http\Controllers\Bills\BillsController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Files\FileController;
use App\Http\Controllers\Posts\PostController;
use App\Http\Controllers\Users\RolesController;
use App\Http\Controllers\Users\UsersController;
use App\Http\Controllers\Brands\BrandController;
use App\Http\Controllers\Files\FolderController;
use App\Http\Controllers\Products\ProductsController;
use App\Http\Controllers\Slide\SlidesController;
use App\Http\Controllers\Users\PermissionsController;
use App\Http\Controllers\Collections\ProductCollection;
use App\Http\Controllers\Categories\CategoriesController;
use App\Http\Controllers\Posts\PostCategoryController;
use App\Http\Controllers\Contacts\ContactsController;
use App\Http\Controllers\Posts\PostCollectionsController;
use App\Http\Controllers\Comments\CommentController;
use App\Http\Controllers\Reviews\ReviewController;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::resource('contacts', ContactsController::class);
    Route::resource('comments', CommentController::class);
    //============================================================
    Route::resource('bills', BillsController::class);
    //============================================================
    Route::resource('permissions', PermissionsController::class);
    //================================
    Route::post('/permissions/add-role-permision', [PermissionsController::class, 'role_permission']);
    Route::get('/permissions/roles/{id}', [PermissionsController::class, 'get_permissions']);
    //===========================================================
    Route::resource('roles', RolesController::class);
    //===========================================================
    Route::resource('users', UsersController::class);
    //==========================================================
    Route::resource('collections', ProductCollection::class);
    Route::post('collections/home', [ProductCollection::class, 'storeHomeCollection']);
    Route::post('collections/home', [ProductCollection::class, 'storeHomeCollection']);
    Route::get('collections-trang-chu', [ProductCollection::class, 'indexHomeCollection']);
    Route::put('collectionsHome/{id}', [ProductCollection::class, 'updateHomeCollection']);
    //==========================================================
    Route::resource('categories', CategoriesController::class);
    //==========================================================
    Route::resource('brands', BrandController::class);
    //==========================================================
    Route::resource('reviews', ReviewController::class);
    //==========================================================
    Route::resource('slides', SlidesController::class);
    Route::post('/slides/image/{id}', [SlidesController::class, 'changeImage']);
    //==========================================================
    Route::resource('posts', PostController::class);
    Route::resource('post/categories', PostCategoryController::class);
    Route::resource('posts-collections', PostCollectionsController::class);
    //==========================================================
    Route::resource('files', FileController::class);
    Route::resource('files', FileController::class);
    Route::post('folder', [FolderController::class, 'store']);
    Route::put('folder/{id}', [FolderController::class, 'update']);
    Route::delete('folder/{id}', [FolderController::class, 'destroy']);
    //==========================================================
    Route::resource('products', ProductsController::class);
    Route::post('/update-products/{id}', [ProductsController::class, 'update']);
    Route::post('/update-product-images/{id}', [ProductsController::class, 'Update_Images']);
    Route::post('/delete-product-image/{id}', [ProductsController::class, 'Delete_Image']);
    Route::post('/set-default-product-image/{id}', [ProductsController::class, 'Set_Default']);
    Route::get('/products-export', [ProductsController::class, 'exportExample']);
    Route::get('/products', [ProductsController::class, 'index']);
});
Route::get('/', [UsersController::class, 'login'])->name('login');
Route::post('/checkLogin', [UsersController::class, 'checkLogin'])->middleware('web');
Route::get('/logout', [UsersController::class, 'logout'])->name('logout');
Route::group(['prefix' => 'laravel-filemanager'], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});
