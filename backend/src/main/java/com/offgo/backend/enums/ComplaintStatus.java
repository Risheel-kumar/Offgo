package com.offgo.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ComplaintStatus {
    PENDING,
    OPEN,
    ASSIGNED,
    IN_PROGRESS,
    COMPLETED,
    RESOLVED,
    CLOSED;

    @JsonCreator
    public static ComplaintStatus fromValue(String value) {
        if (value == null) {
            return PENDING;
        }

        String normalized = value.trim();
        for (ComplaintStatus status : values()) {
            if (status.name().equalsIgnoreCase(normalized)
                    || status.name().replace('_', ' ').equalsIgnoreCase(normalized)
                    || status.toString().equalsIgnoreCase(normalized)) {
                return status;
            }
        }

        return PENDING;
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}
