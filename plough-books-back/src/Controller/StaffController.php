<?php

namespace App\Controller;

use App\Entity\StaffMember;
use App\Entity\StaffRole;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use App\Service\Parsing\StaffMemberParsingService;
use App\Service\Parsing\StaffRoleParsingService;
use App\Service\PersistenceService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaffController {

    public function staffRolesAction(Request $request, StaffRoleRepository $staffRoleRepository, StaffRoleParsingService $roleParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $staffRoles = $staffRoleRepository->findAll();
                return new JsonResponse(array_map(function (StaffRole $role) { return $role->serialise(); }, $staffRoles));
            case 'POST':
                $roleParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $role = $roleParsingService->getUpdatedStaffRoleEntity($request->request->all());
                } else {
                    $role = $roleParsingService->getNewStaffRoleEntity($request->request->all());
                }
                $persistenceService->persist($role);
                $staffRoles = $staffRoleRepository->findAll();
                return new JsonResponse(array_map(function (StaffRole $role) { return $role->serialise(); }, $staffRoles));
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function staffMembersAction(Request $request, StaffMemberRepository $staffMemberRepository, StaffMemberParsingService $staffMemberParsingService, PersistenceService $persistenceService) {
        switch($request->getMethod()) {
            case 'GET':
                $staffMembers = $staffMemberRepository->findAll();
                return new JsonResponse(array_map(function (StaffMember $staffMember) { return $staffMember->serialise(); }, $staffMembers));
            case 'POST':
                $staffMemberParsingService->validateRequestFields($request->request->all());
                if ($request->request->has('id')) {
                    $staffMember = $staffMemberParsingService->getUpdatedStaffMemberEntity($request->request->all());
                } else {
                    $staffMember = $staffMemberParsingService->getNewStaffMemberEntity($request->request->all());
                }
                $persistenceService->persist($staffMember);
                $staffMembers = $staffMemberRepository->findAll();
                return new JsonResponse(array_map(function (StaffMember $staffMember) { return $staffMember->serialise(); }, $staffMembers));
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}