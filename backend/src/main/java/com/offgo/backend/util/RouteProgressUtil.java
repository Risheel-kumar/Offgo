package com.offgo.backend.util;

import java.util.List;

import com.offgo.backend.entity.RouteStop;

public class RouteProgressUtil {

    private RouteProgressUtil() {
    }

    public static RouteStop findNearestStop(
            double latitude,
            double longitude,
            List<RouteStop> routeStops) {

        RouteStop nearest = null;
        double minimum = Double.MAX_VALUE;

        for (RouteStop stop : routeStops) {

            double distance =
                    DistanceUtil.calculateDistance(
                            latitude,
                            longitude,
                            stop.getStop().getLatitude(),
                            stop.getStop().getLongitude());

            if (distance < minimum) {

                minimum = distance;
                nearest = stop;

            }

        }

        return nearest;

    }

}