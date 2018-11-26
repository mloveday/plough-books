<?php

namespace App\Controller;

use App\Entity\Rota;
use App\Repository\RotaRepository;
use App\Service\Parsing\RotaParsingService;
use App\Service\PersistenceService;
use App\Util\DateUtils;
use App\Util\RequestValidator;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaController {

    public function rotaAction(Request $request, RequestValidator $requestValidator, RotaParsingService $rotaParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'POST':
                $requestValidator->validateRequestFields($request->request->all(), ['date', 'forecastRevenue', 'targetLabourRate', 'constants', 'status', 'plannedShifts', 'actualShifts']);
                $requestValidator->validateRequestNestedFields($request->request->get('constants'), [], 'constants');
                foreach($request->request->get('plannedShifts') as $index => $plannedShift) {
                    $requestValidator->validateRequestNestedFields($plannedShift, ['staffMember', 'status', 'hourlyRate', 'startTime', 'endTime', 'totalBreaks', 'type'], "plannedShifts[${index}]");
                }
                foreach($request->request->get('actualShifts') as $index => $actualShift) {
                    $requestValidator->validateRequestNestedFields($actualShift, ['staffMember', 'status', 'hourlyRate', 'startTime', 'endTime', 'totalBreaks', 'type'], "actualShifts[${index}]");
                }
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