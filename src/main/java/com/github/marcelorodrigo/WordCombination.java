package com.github.marcelorodrigo;

import java.util.regex.Pattern;

public class WordCombination {
    final int position;
    final String character;

    public WordCombination(final String data) {
        validate(data);
        this.character = data.substring(0, 1);
        this.position = Integer.parseInt(data.substring(1, 2));
    }

    private void validate(final String data) {
        if (!Pattern.compile("^[a-z][1-5]$").matcher(data).matches()) {
            throw new IllegalArgumentException(data + " is not a valid parameter.");
        }
    }

    public int getPosition() {
        return position;
    }

    public String getCharacter() {
        return character;
    }

    @Override
    public String toString() {
        return "[" + character + position + "]";
    }
}
