<?php

namespace App\Controller;

use App\Entity\Holiday;
use App\Repository\HolidayRepository;
use App\Service\Parsing\HolidayParsingService;
use App\Service\PersistenceService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class HolidaysController {

    public function holidaysAction(Request $request, HolidayRepository $holidaysRepository, HolidayParsingService $holidaysParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $allHolidays = $holidaysRepository->findAll();
                return new JsonResponse(array_map(function (Holiday $holidays) { return $holidays->serialise(); }, $allHolidays));
            case 'POST':
                $holidaysParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $holidays = $holidaysParsingService->getUpdatedHolidayEntity($request->request->all());
                } else {
                    $holidays = $holidaysParsingService->getNewHolidayEntity($request->request->all());
                }
                $persistenceService->persist($holidays);

                $allHolidays = $holidaysRepository->findAll();
                return new JsonResponse(array_map(function (Holiday $holidays) { return $holidays->serialise(); }, $allHolidays));
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}