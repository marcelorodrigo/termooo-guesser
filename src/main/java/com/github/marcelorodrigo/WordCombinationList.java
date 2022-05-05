package com.github.marcelorodrigo;

import java.util.List;
import java.util.stream.Stream;

public class WordCombinationList {

    public List<WordCombination> getList() {
        return list;
    }

    private final List<WordCombination> list;

    public WordCombinationList(String combination){
        this.list = Stream.of(combination.split(","))
                .map(WordCombination::new)
                .toList();
    }
}
