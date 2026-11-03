<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/halo', fn() => response()->json(['message' => 'halo']));

// fn() = versi lebih panjangnya: function return
// Route::get('/hello', function {
//     return response()->json(['message' => 'hello']);
// })

Route::get('/hello/{name}', fn($name) =>
  response()->json(['message' => "Halo, $name!"]));

Route::get('/baik', function(){
    return response()->json(['message' => 'baik']);
});


Route::get('/books',
  [BookController::class, 'index']);
Route::get('/books/{id}',
  [BookController::class, 'show']);
Route::post('/books',
  [BookController::class, 'store']);
Route::put('/books/{id}',
  [BookController::class, 'update']);
Route::delete('/books/{id}',
  [BookController::class, 'destroy']);

Route::get('/categories',
  [CategoryController::class, 'index']);
Route::get('/categories/{id}',
  [CategoryController::class, 'show']);
Route::post('/categories',
  [CategoryController::class, 'store']);
Route::put('/categories/{id}',
  [CategoryController::class, 'update']);
Route::delete('/categories/{id}',
  [CategoryController::class, 'destroy']);
