<?php

namespace App\Controller;

use App\Repository\CashUpRepository;
use App\Service\Parsing\CashUpParsingService;
use App\Service\PersistenceService;
use App\Util\DateUtils;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CashUpController {

    public function cashUpAction(Request $request, CashUpParsingService $cashUpParsingService, PersistenceService $cashUpPersistenceService) {
        switch($request->getMethod()) {
            case 'POST':
                if ($request->request->has('id')) {
                    $cashUpEntity = $cashUpParsingService->getUpdatedExistingCashUpEntity($request);
                } else {
                    $cashUpEntity = $cashUpParsingService->getNewCashUpEntity($request);
                }
                $cashUpPersistenceService->persist($cashUpEntity);
                return new JsonResponse($cashUpEntity->serialise());
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function cashUpDateAction($dateString, CashUpRepository $cashUpRepository) {
        if (!DateUtils::dateIsValid($dateString)) {
            throw new BadRequestHttpException("Invalid date string: '${dateString}'");
        }
        $cashUp = $cashUpRepository->getByDate(new DateTime($dateString));
        if (is_null($cashUp)) {
            return new JsonResponse((object) ['date' => $dateString]);
        }
        return new JsonResponse($cashUp->serialise());
    }
}