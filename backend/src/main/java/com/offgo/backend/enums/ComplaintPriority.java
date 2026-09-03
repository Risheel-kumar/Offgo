package com.offgo.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ComplaintPriority {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL;

    @JsonCreator
    public static ComplaintPriority fromValue(String value) {
        if (value == null) {
            return MEDIUM;
        }

        String normalized = value.trim();
        for (ComplaintPriority priority : values()) {
            if (priority.name().equalsIgnoreCase(normalized)
                    || priority.name().replace('_', ' ').equalsIgnoreCase(normalized)
                    || priority.toString().equalsIgnoreCase(normalized)) {
                return priority;
            }
        }

        return MEDIUM;
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
