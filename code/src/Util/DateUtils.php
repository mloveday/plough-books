<?php

namespace App\Util;

use DateTime;

class DateUtils {

    public static function dateIsValid(string $date): bool {
        $dateTime = DateTime::createFromFormat('Y-m-d', $date);
        return self::noParseErrors() && self::dateTimeIsDateTimeObject($dateTime);
    }

    private static function noParseErrors(): bool {
        $errors = DateTime::getLastErrors();
        return empty($errors['warning_count']);
    }

    private static function dateTimeIsDateTimeObject($dateTime): bool {
        return $dateTime !== false;
    }
}