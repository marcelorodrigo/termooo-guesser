package com.github.marcelorodrigo;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParserException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Pattern;

public class Termo {

    public static void main(String[] args) {
        final var argumentParser = ArgumentParsers.newFor("java -jar termo.jar")
                .includeArgumentNamesAsKeysInResult(true)
                .terminalWidthDetection(true)
                .build()
                .defaultHelp(true)
                .description("""
                        Term.ooo Guesser

                        Combinations should be declared by the letter + position.
                        For more than one combination, you can split them by comma.
                        Example: a1,r2
                        """)
                .epilog("And maybe you can now guess the term.ooogit in!");
        argumentParser.addArgument("-exclude")
                .metavar("combinations")
                .help("Characters to exclude")
                .required(false);
        argumentParser.addArgument("-include")
                .metavar("combinations")
                .help("Characters to include, but not in the right position")
                .type(WordCombinationList.class)
                .required(false);
        argumentParser.addArgument("-found")
                .metavar("combinations")
                .help("Characters found in the right position")
                .type(WordCombinationList.class)
                .required(false);


        try {
            final var arguments = argumentParser.parseArgs(args);
            final var words = Files.readAllLines(Paths.get("src/main/resources/words.txt"));
            List<String> possibleWords = Collections.emptyList();


            final var toExclude = arguments.getString("exclude");
            if (toExclude != null) {
                System.out.println("Removing words with letters: " + toExclude);
                possibleWords = filterExcluded(words, toExclude);
            }

            final var toInclude = arguments.<WordCombinationList>get("include");
            if (Objects.nonNull(toInclude)) {
                System.out.print("Looking for words that doesn't contains words in positions: ");
                toInclude.getList().forEach(System.out::print);
                System.out.println();
                possibleWords = filterInclude(possibleWords, toInclude);
            }

            final var found = arguments.<WordCombinationList>get("found");
            if (Objects.nonNull(found)) {
                System.out.print("Looking for words with exactly positions: ");
                found.getList().forEach(System.out::print);
                System.out.println();
                possibleWords = filterExact(possibleWords, found);
            }

            if (possibleWords.isEmpty()) {
                argumentParser.printHelp();
            } else {
                System.out.println("Possible words: " + possibleWords);
            }
            System.out.println("Processing complete!");
        } catch (ArgumentParserException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    private static List<String> filterExcluded(final List<String> words, final String toExcludePattern) {
        final var regex = "((?!" + toExcludePattern.replace(",", "|") + ").)*$";
        return words.stream()
                .filter(Pattern.compile(regex).asMatchPredicate())
                .toList();
    }

    private static List<String> filterExact(final List<String> words, final WordCombinationList exact) {
        final var filtered = new AtomicReference<>(words);
        exact.getList().forEach(wordCombination -> filtered.set(filtered.get().stream()
                .filter(word -> word.substring(wordCombination.position - 1, wordCombination.position).equals(wordCombination.character))
                .toList()));
        return filtered.get();
    }

    private static List<String> filterInclude(final List<String> words, final WordCombinationList include) {
        var filtered = new AtomicReference<>(words);
        include.getList().forEach(wordCombination -> filtered.set(filtered.get().stream()
                .filter(word -> word.contains(wordCombination.character) &&
                        !word.substring(wordCombination.position - 1, wordCombination.position).equals(wordCombination.character))
                .toList()));
        return filtered.get();
    }
}
