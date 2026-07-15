package com.offgo.backend.common.pagination;

import lombok.Data;

@Data
public class PageRequestDto {

    private int page = 0;

    private int size = 10;

    private String sortBy = "id";

    private String direction = "asc";

}