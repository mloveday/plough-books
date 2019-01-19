<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\RouterInterface;

class IndexController extends AbstractController {

    public function indexAction(RouterInterface $router) {
        return $this->render('index/index.html.twig');
    }
}