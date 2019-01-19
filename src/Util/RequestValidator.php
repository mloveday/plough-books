<?php

namespace App\Util;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RequestValidator
{
    public function validateRequestFields(array $request, array $fields)
    {
        $missingRequestFields = $this->getMissingFields($request, $fields);
        if (count($missingRequestFields) > 0) {
            throw new BadRequestHttpException("Must include field(s) '".join("', '",$missingRequestFields)."' in body");
        }
    }

    public function validateRequestNestedFields(array $request, array $fields, string $fieldName)
    {
        $missingRequestFields = $this->getMissingFields($request, $fields);
        if (count($missingRequestFields) > 0) {
            throw new BadRequestHttpException("Must include field(s) '".join("', '",$missingRequestFields)."' in field " . $fieldName);
        }
    }

    private function getMissingFields(array $request, array $fields): array {
        $missingRequestFields = [];
        foreach ($fields as $field) {
            if (!array_key_exists($field, $request)) {
                $missingRequestFields[] = $field;
            }
        }
        return $missingRequestFields;
    }
}