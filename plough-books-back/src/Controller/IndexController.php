<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouterInterface;

class IndexController {

    public function indexAction(RouterInterface $router, UserRepository $userRepository) {
        $routes = $router->getRouteCollection();
        return new JsonResponse((object)[
            "API" => "Plough books API",
            "endpoints" => array_map(function (Route $route) {return $route->getPath();}, $routes->all()),
            "users" => $userRepository->findAll(),
        ]);
    }
}