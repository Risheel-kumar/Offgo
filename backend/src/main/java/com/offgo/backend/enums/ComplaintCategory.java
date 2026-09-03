package com.offgo.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ComplaintCategory {
    VEHICLE_ISSUE,
    DRIVER_BEHAVIOUR,
    EMPLOYEE_BEHAVIOUR,
    ROUTE_ISSUE,
    DELAY,
    MAINTENANCE,
    SAFETY,
    SUGGESTION,
    OTHER;

    @JsonCreator
    public static ComplaintCategory fromValue(String value) {
        if (value == null) {
            return OTHER;
        }

        String normalized = value.trim();
        for (ComplaintCategory category : values()) {
            if (category.name().equalsIgnoreCase(normalized)
                    || category.name().replace('_', ' ').equalsIgnoreCase(normalized)
                    || category.toString().equalsIgnoreCase(normalized)) {
                return category;
            }
        }

        return OTHER;
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
