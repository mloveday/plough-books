<?php

namespace App\Controller;

use App\Entity\Constants;
use App\Repository\ConstantsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ConstantsController {

    public function constantsAction(Request $request, ConstantsRepository $constantsRepository) {
        switch($request->getMethod()) {
            case 'GET':
                $allConstants = $constantsRepository->findAll();
                return new JsonResponse(array_map(function (Constants $constants) { return $constants->serialise(); }, $allConstants));
            case 'POST':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}