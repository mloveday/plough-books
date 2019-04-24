<?php

namespace App\Util;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class RequestAuthorization {
    public static function getToken(Request $request) {
        $header = $request->headers->get('Auth');
        $regex = '/^Bearer (.*)$/';
        $matches = [];
        $result = preg_match($regex, $header, $matches);
        if ($result === 1) {
            return $matches[1];
        }
        throw new UnauthorizedHttpException('','Auth header (of form Bearer <token>) is required for authentication');
    }
}