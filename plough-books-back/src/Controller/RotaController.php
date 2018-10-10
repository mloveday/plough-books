<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaController {

    public function rotaAction(Request $request) {
        switch($request->getMethod()) {
            case 'GET':
                return new JsonResponse((object) []); //TODO: stub response
            case 'POST':
                return new JsonResponse((object) []); //TODO: stub response
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}