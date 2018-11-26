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
                $rotaParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $rota = $rotaParsingService->getUpdatedRotaEntity($request);
                } else {
                    $rota = $rotaParsingService->getNewRotaEntity($request);
                }
                $persistenceService->persist($rota);
                return new JsonResponse([$rota->serialise()]);
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