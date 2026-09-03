package com.offgo.backend.dto.request.route;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReorderRouteStopsRequest {

    @NotNull
    @NotEmpty
    private List<UUID> stopIdsInOrder;
}
