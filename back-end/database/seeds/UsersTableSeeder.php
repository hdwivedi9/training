<?php

use App\User;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
        	'name' => 'Ram',
        	'email'=> 'ramaa@gmail.com',
        	'password'=> 'ramdoesnotlie'

        ]);
        User::create([
        	'name' => 'Sam',
        	'email'=> 'samaa@gmail.com',
        	'password'=> 'samnotlie'

        ]);
        
    }
}
