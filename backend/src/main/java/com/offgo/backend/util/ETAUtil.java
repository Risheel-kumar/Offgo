package com.offgo.backend.util;

public class ETAUtil {

    private ETAUtil() {
    }

    public static int calculateETA(
            double remainingDistanceKm,
            double averageSpeedKmPerHour) {

        if (averageSpeedKmPerHour <= 0) {
            return Integer.MAX_VALUE;
        }

        return (int) Math.ceil(
                (remainingDistanceKm / averageSpeedKmPerHour) * 60
        );
    }

}