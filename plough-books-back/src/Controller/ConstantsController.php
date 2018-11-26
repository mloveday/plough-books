<?php

namespace App\Controller;

use App\Entity\Constants;
use App\Repository\ConstantsRepository;
use App\Service\Parsing\ConstantsParsingService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class ConstantsController {

    public function constantsAction(Request $request, ConstantsRepository $constantsRepository, ConstantsParsingService $constantsParsingService) {
        switch($request->getMethod()) {
            case 'GET':
                $allConstants = $constantsRepository->findAll();
                return new JsonResponse(array_map(function (Constants $constants) { return $constants->serialise(); }, $allConstants));
            case 'POST':
                if ($request->request->has('id')) {
                    $constants = $constantsParsingService->getUpdatedConstantsEntity($request->request->all());
                } else {
                    $constants = $constantsParsingService->getNewConstantsEntity($request->request->all());
                }
                return new JsonResponse($constants->serialise());
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}