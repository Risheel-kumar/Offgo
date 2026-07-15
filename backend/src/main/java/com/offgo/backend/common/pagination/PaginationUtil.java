package com.offgo.backend.common.pagination;

import org.springframework.data.domain.Page;

public class PaginationUtil {

    private PaginationUtil() {}

    public static <T> PageResponse<T> fromPage(Page<T> page) {

        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();

    }

}