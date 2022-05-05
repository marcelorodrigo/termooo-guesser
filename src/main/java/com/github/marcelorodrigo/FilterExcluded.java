package com.github.marcelorodrigo;

import java.util.List;
import java.util.regex.Pattern;

public class FilterExcluded {

    public List<String> filter(final List<String> words, final String toExcludePattern) {
        final var regex = "((?!" + toExcludePattern.replace(",", "|") + ").)*$";
        return words.stream()
                .filter(Pattern.compile(regex).asMatchPredicate())
                .toList();
    }
}
