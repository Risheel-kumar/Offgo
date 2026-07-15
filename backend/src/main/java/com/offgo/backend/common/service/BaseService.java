package com.offgo.backend.common.service;

import java.util.List;
import java.util.UUID;

public interface BaseService<REQ, RES> {

    RES create(REQ request);

    RES update(UUID id, REQ request);

    RES getById(UUID id);

    List<RES> getAll();

    void delete(UUID id);
}