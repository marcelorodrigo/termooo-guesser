package com.github.marcelorodrigo;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FilterIncludedTest {
    private final List<String> words = List.of("areia", "porta", "termo", "turma", "ursao", "limpo");
    private final List<String> expectedResult = List.of("turma","ursao");
    private final List<WordCombination> includedList = List.of(
            new WordCombination("a1"),
            new WordCombination("u3")
    );

    @Test
    void filter() {
        final var filtered = new FilterIncluded().filter(words, includedList);
        assertEquals(expectedResult, filtered);
    }
}