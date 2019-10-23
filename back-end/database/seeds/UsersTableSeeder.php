<?php

use App\users;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        users::create([
        	'name' => 'Ram',
        	'email'=> 'ramaa@gmail.com',
        	'password'=> 'ramdoesnotlie'

        ]);
        users::create([
        	'name' => 'Sam',
        	'email'=> 'samaa@gmail.com',
        	'password'=> 'samnotlie'

        ]);
        
    }
}
