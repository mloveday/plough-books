<?php

namespace App\Controller;

use App\Entity\StaffMember;
use App\Entity\StaffRole;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use App\Service\Parsing\StaffMemberParsingService;
use App\Service\Parsing\StaffRoleParsingService;
use App\Service\PersistenceService;
use App\Util\RequestValidator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaffController {

    public function staffRolesAction(Request $request, RequestValidator $requestValidator, StaffRoleRepository $staffRoleRepository, StaffRoleParsingService $roleParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $staffRoles = $staffRoleRepository->findAll();
                return new JsonResponse(array_map(function (StaffRole $role) { return $role->serialise(); }, $staffRoles));
            case 'POST':
                $requestValidator->validateRequestFields($request->request->all(), ['role', 'status', 'type', 'orderInRota']);
                if ($request->request->has('id')) {
                    $role = $roleParsingService->getUpdatedStaffRoleEntity($request->request->all());
                } else {
                    $role = $roleParsingService->getNewStaffRoleEntity($request->request->all());
                }
                $persistenceService->persist($role);
                return new JsonResponse($role->serialise());
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function staffMembersAction(Request $request, RequestValidator $requestValidator, StaffMemberRepository $staffMemberRepository, StaffMemberParsingService $staffMemberParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $staffMembers = $staffMemberRepository->findAll();
                return new JsonResponse(array_map(function (StaffMember $staffMember) { return $staffMember->serialise(); }, $staffMembers));
            case 'POST':
                $requestValidator->validateRequestFields($request->request->all(), ['name', 'status', 'currentHourlyRate', 'role']);
                $requestValidator->validateRequestNestedFields($request->request->get('role'), ['id'], 'role');
                if ($request->request->has('id')) {
                    $staffMember = $staffMemberParsingService->getUpdatedStaffMemberEntity($request->request->all());
                } else {
                    $staffMember = $staffMemberParsingService->getNewStaffMemberEntity($request->request->all());
                }
                $persistenceService->persist($staffMember);
                return new JsonResponse($staffMember->serialise());
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}