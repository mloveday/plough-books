<?php

namespace App\Service\Parsing;

use App\Entity\RotaStaffingTemplate;
use App\Repository\RotaStaffingTemplateRepository;
use App\Util\RequestValidator;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RotaStaffingTemplateParsingService {

    /** @var RotaStaffingTemplateRepository */
    private $rotaStaffingTemplateRepository;
    /** @var RequestValidator */
    private $requestValidator;

    public function __construct(RotaStaffingTemplateRepository $rotaStaffingTemplateRepository, RequestValidator $requestValidator) {
        $this->rotaStaffingTemplateRepository = $rotaStaffingTemplateRepository;
        $this->requestValidator = $requestValidator;
    }

    public function validateRequestFields(array $request) {
        $this->requestValidator->validateRequestFields($request, [
            'staffLevels',
            'revenue',
            'workType',
            'status',
            'dayOfWeek',
        ]);
    }

    public function getNewRotaStaffingTemplateEntity(array $rotaStaffingTemplate) {
        if (array_key_exists('id', $rotaStaffingTemplate)) {
            throw new BadRequestHttpException("New RotaStaffingTemplate entity in request should not have an id");
        }
        return $this->updateRotaStaffingTemplateEntity($rotaStaffingTemplate, new RotaStaffingTemplate());
    }

    public function getUpdatedRotaStaffingTemplateEntity(array $rotaStaffingTemplate) {
        if (!array_key_exists('id', $rotaStaffingTemplate)) {
            throw new BadRequestHttpException("Existing RotaStaffingTemplate entity in request has no id");
        }
        $entity = $this->rotaStaffingTemplateRepository->findOneBy(['id' => $rotaStaffingTemplate['id']]);
        if (is_null($entity)) {
            throw new BadRequestHttpException("RotaStaffingTemplate with id ${$rotaStaffingTemplate['id']} does not exist");
        }
        return $this->updateRotaStaffingTemplateEntity($rotaStaffingTemplate, $entity);
    }

    private function updateRotaStaffingTemplateEntity(array $rotaStaffingTemplate, RotaStaffingTemplate $entity) {
        return $entity
            ->setStaffLevels($rotaStaffingTemplate['staffLevels'])
            ->setRevenue((float)$rotaStaffingTemplate['revenue'])
            ->setWorkType($rotaStaffingTemplate['workType'])
            ->setStatus($rotaStaffingTemplate['status'])
            ->setDayOfWeek((float)$rotaStaffingTemplate['dayOfWeek']);
    }
}