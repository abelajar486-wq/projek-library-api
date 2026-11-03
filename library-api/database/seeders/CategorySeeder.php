<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Penguasa Langit Mars',      'genre' => 'Novel',            'description' => 'Novel dan cerita rekaan'],
            ['name' => 'Buku Materi Kelas 10 IPA',  'genre' => 'Ilmu Pengetahuan', 'description' => 'Buku ilmu pengetahuan alam'],
            ['name' => 'Pemenang Perang Dunia 2',   'genre' => 'Non-Fiksi',        'description' => 'Buku tentang peristiwa masa lalu'],
            ['name' => 'Bagaimana Cara Membuat AI', 'genre' => 'Pendidikan',       'description' => 'Komputer, pemrograman, dan internet'],
            ['name' => 'Al-Qur\'an',                'genre' => 'Bekal Akhirat',    'description' => 'Kitab suci umat Islam'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}