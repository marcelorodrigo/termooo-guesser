package com.github.marcelorodrigo;

import org.junit.jupiter.api.Test;

class TermoTest {

    @Test
    void main() {
        final var arguments = new String[]{"-include", "a1", "-exclude", "c", "-found", "b2"};
        Termo.main(arguments);
    }
}