<?php 

use App\Http\Middleware\CheckModuleActive;

protected $routeMiddleware = [
    'checkModule' => \App\Http\Middleware\CheckModuleActive::class,
];