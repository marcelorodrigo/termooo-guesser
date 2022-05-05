package com.github.marcelorodrigo;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

public class FilterExact {
    public List<String> filter(final List<String> words, final List<WordCombination> exact) {
        final var filtered = new AtomicReference<>(words);
        exact.forEach(wordCombination -> filtered.set(filtered.get().stream()
                .filter(word -> word.substring(wordCombination.getPosition() - 1, wordCombination.getPosition()).equals(wordCombination.getCharacter()))
                .toList()));
        return filtered.get();
    }
}
