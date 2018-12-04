<?php

namespace App\Controller;

use App\Entity\Rota;
use App\Repository\RotaRepository;
use App\Service\Parsing\RotaParsingService;
use App\Service\PersistenceService;
use App\Util\DateUtils;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaController {

    public function rotaAction(Request $request, RotaParsingService $rotaParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'POST':
                $requestBody = $request->request->all();
                if ($request->request->has(RotaParsingService::PARAM__ID)) {
                    $rota = $rotaParsingService->getUpdatedRotaEntity($requestBody, RotaParsingService::UPDATE_SHIFTS_AND_STATUS);
                } else {
                    $rota = $rotaParsingService->getNewRotaEntity($requestBody);
                }
                $persistenceService->persist($rota);
                return new JsonResponse([$rota->serialise()]);
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function weeklyPlanningAction(Request $request, RotaParsingService $rotaParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'POST':
                $errors = [];
                $rotas = [];
                foreach ($request->request->all() as $rotaRequest) {
                    try {
                        if (array_key_exists(RotaParsingService::PARAM__ID, $rotaRequest)) {
                            $rotas[] = $rotaParsingService->getUpdatedRotaEntity($rotaRequest, RotaParsingService::UPDATE_CONSTANTS_AND_NON_NESTED);
                        } else {
                            $rotas[] = $rotaParsingService->getNewRotaEntity($rotaRequest);
                        }
                    } catch (BadRequestHttpException $e) {
                        $errors[] = $e;
                    }
                }
                if (count($errors) > 0) {
                    throw new BadRequestHttpException(json_encode(array_map(function (BadRequestHttpException $e) { return $e->getMessage(); }, $errors)));
                }
                $persistenceService->persistAll($rotas);
                return new JsonResponse(array_map(function (Rota $rota) { return $rota->serialise(); }, $rotas));
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function rotaDateAction($dateString, RotaRepository $rotaRepository) {
        if (!DateUtils::dateIsValid($dateString)) {
            throw new BadRequestHttpException("Invalid date string: '${dateString}'");
        }
        $rotas = $rotaRepository->getWeekByDate(new DateTime($dateString));
        if (is_null($rotas)) {
            return new JsonResponse([(object) ['date' => $dateString]]);
        }
        return new JsonResponse(array_map(function(Rota $rota) { return $rota->serialise(); }, $rotas->toArray()));
    }
}