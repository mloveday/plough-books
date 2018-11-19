<?php

namespace App\Controller;

use App\Entity\StaffMember;
use App\Entity\StaffRole;
use App\Repository\StaffMemberRepository;
use App\Repository\StaffRoleRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class StaffController {

    public function staffRolesAction(Request $request, StaffRoleRepository $staffRoleRepository) {
        switch($request->getMethod()) {
            case 'GET':
                $staffRoles = $staffRoleRepository->findAll();
                return new JsonResponse(array_map(function (StaffRole $role) { return $role->serialise(); }, $staffRoles)); //TODO: stub response
            case 'POST':
                return new JsonResponse((object) []); //TODO: stub response
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }

    public function staffMembersAction(Request $request, StaffMemberRepository $staffMemberRepository) {
        switch($request->getMethod()) {
            case 'GET':
                $staffMembers = $staffMemberRepository->findAll();
                return new JsonResponse(array_map(function (StaffMember $staffMember) { return $staffMember->serialise(); }, $staffMembers)); //TODO: stub response
            case 'POST':
                return new JsonResponse((object) []); //TODO: stub response
            case 'DELETE':
                return new JsonResponse((object) []); //TODO: stub response
            default:
                throw new BadRequestHttpException("Method not allowed");
        }
    }
}