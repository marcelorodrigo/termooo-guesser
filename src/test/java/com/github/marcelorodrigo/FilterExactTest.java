package com.github.marcelorodrigo;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class FilterExactTest {

    private final List<String> words = List.of("areia", "porta", "turma", "amero", "ursao", "limao", "amora");
    private final List<String> expectedResult = List.of("areia", "amora");
    private final List<WordCombination> exactList = List.of(
            new WordCombination("a1"),
            new WordCombination("a5")
    );

    @Test
    void filter() {
        final var filtered = new FilterExact().filter(words, exactList);
        assertEquals(expectedResult, filtered);
    }

}