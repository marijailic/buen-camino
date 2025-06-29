<?php

namespace App\Services;

class HaversineService
{
    public static function calculateDistance(
        float $lat1,
        float $lon1,
        float $lat2,
        float $lon2
    ): float {
        $R = 6371.0;

        $toRadians = fn ($deg) => $deg * (M_PI / 180);

        $dLat = $toRadians($lat2 - $lat1);
        $dLon = $toRadians($lon2 - $lon1);

        $a = pow(sin($dLat / 2), 2) +
            cos($toRadians($lat1)) * cos($toRadians($lat2)) *
            pow(sin($dLon / 2), 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $R * $c;
    }
}
