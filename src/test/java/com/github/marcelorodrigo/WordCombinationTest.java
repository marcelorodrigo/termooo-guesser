package com.github.marcelorodrigo;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class WordCombinationTest {

    @ParameterizedTest
    @ValueSource(strings = {"a1", "c5", "d3", "e2", "f4"})
    void optimisticTest(final String data) {
        final var result = new WordCombination(data);
        assertEquals(data.substring(0, 1), result.getCharacter());
        assertEquals(Long.valueOf(data.substring(1, 2)), result.getPosition());

    }

    @ParameterizedTest
    @ValueSource(strings = {"", "n", "aa", "22", "a6", "b0", "x99", "doesntWork", "K", "A1", "F5"})
    void pessimisticTest(final String data) {
        assertThrows(IllegalArgumentException.class, () -> new WordCombination(data));

    }

}