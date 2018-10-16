<?php

namespace App\Util;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RequestValidator
{
    public function validateRequestFields(Request $request, array $fields)
    {
        $missingRequestFields = [];
        foreach ($fields as $field) {
            if (!$request->request->has($field)) {
                $missingRequestFields[] = $field;
            }
        }
        if (count($missingRequestFields) > 0) {
            throw new BadRequestHttpException("Must include field(s) '".join("', '",$missingRequestFields)."' in body");
        }
    }
}