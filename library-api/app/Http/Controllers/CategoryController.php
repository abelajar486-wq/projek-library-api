<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
public function index() {
  return response()->json(Category::all());
}

public function show($id) {
  $category = Category::find($id);
  if (!$category) {
    return response()->json(
      ['message' => 'Kategori tidak ditemukan'], 404);
  }
  return response()->json($category);

  }
  public function store(Request $request) {
    $category = Category::create(
      $request->only(['name', 'genre', 'description'])
    );
    return response()->json($category, 201);
  }

  public function update(Request $request, $id) {
  $category = Category::find($id);
  if (!$category) {
    return response()->json(['message' => 'Kategori tidak ditemukan'], 404);
  }
  $category->update($request->only(['name', 'genre', 'description']));
  return response()->json($category);
  }

  public function destroy($id) {
  $category = Category::find($id);
  if (!$category) {
    return response()->json(['message' => 'Kategori tidak ditemukan'], 404);
  }
  $category->delete();
  return response()->json(['message' => 'Kategori dihapus']);
  }
}
