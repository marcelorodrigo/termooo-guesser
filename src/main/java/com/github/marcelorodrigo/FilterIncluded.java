package com.github.marcelorodrigo;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

public class FilterIncluded {
    public List<String> filter(final List<String> words, final List<WordCombination> include) {
        var filtered = new AtomicReference<>(words);
        include.forEach(wordCombination -> filtered.set(filtered.get().stream()
                .filter(word -> word.contains(wordCombination.getCharacter()) &&
                        !word.substring(wordCombination.getPosition() - 1, wordCombination.getPosition()).equals(wordCombination.getCharacter()))
                .toList()));
        return filtered.get();
    }
}
