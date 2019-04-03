<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class AdminController extends AbstractController {
    public function logAction() {
        return $this->render('logs/logs.html.twig', [
            "entries" => array_reverse(explode("\n",file_get_contents('/home/dashboard/logs/error_log')))
        ]);
//        return new JsonResponse(array_reverse(explode("\n",file_get_contents('/home/dashboard/logs/error_log'))));
    }
}