<?php

namespace App\Controller;

use App\Entity\RotaStaffingTemplate;
use App\Repository\RotaStaffingTemplateRepository;
use App\Service\Parsing\RotaStaffingTemplateParsingService;
use App\Service\PersistenceService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaStaffingTemplatesController {

    public function rotaStaffingTemplatesAction(Request $request, RotaStaffingTemplateRepository $rotaStaffingTemplatesRepository, RotaStaffingTemplateParsingService $rotaStaffingTemplatesParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $rotaStaffingTemplates = $rotaStaffingTemplatesRepository->findAll();
                return new JsonResponse(array_map(function (RotaStaffingTemplate $rotaStaffingTemplate) { return $rotaStaffingTemplate->serialise(); }, $rotaStaffingTemplates));
            case 'POST':
                $rotaStaffingTemplatesParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $rotaStaffingTemplates = $rotaStaffingTemplatesParsingService->getUpdatedRotaStaffingTemplateEntity($request->request->all());
                } else {
                    $rotaStaffingTemplates = $rotaStaffingTemplatesParsingService->getNewRotaStaffingTemplateEntity($request->request->all());
                }
                $persistenceService->persist($rotaStaffingTemplates);

                $rotaStaffingTemplates = $rotaStaffingTemplatesRepository->findAll();
                return new JsonResponse(array_map(function (RotaStaffingTemplate $rotaStaffingTemplate) { return $rotaStaffingTemplate->serialise(); }, $rotaStaffingTemplates));
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}