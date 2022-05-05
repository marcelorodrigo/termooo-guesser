package com.github.marcelorodrigo;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FilterExcludedTest {
    private final List<String> words = List.of("areia", "porta", "termo", "turme", "ursao", "topar");
    private final List<String> expectedResult = List.of("areia", "termo");

    @Test
    void filter() {
        final var excludePattern = "p,u";
        final var filtered = new FilterExcluded().filter(words, excludePattern);
        assertEquals(expectedResult, filtered);
    }
}