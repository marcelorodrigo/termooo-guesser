package com.github.marcelorodrigo;

import net.sourceforge.argparse4j.ArgumentParsers;
import net.sourceforge.argparse4j.inf.ArgumentParserException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.LogManager;
import java.util.logging.Logger;
import java.util.stream.Stream;

import static java.util.Objects.nonNull;

public class Termo {
    private static final Logger LOGGER = Logger.getAnonymousLogger();

    static {
        try (var stream = Termo.class.getClassLoader().getResourceAsStream("logging.properties");) {
            LogManager.getLogManager().readConfiguration(stream);
        } catch (IOException e) {
            System.setProperty("java.util.logging.ConsoleHandler.formatter", "java.util.logging.SimpleFormatter");
            System.setProperty("java.util.logging.SimpleFormatter.format", "%5$s %n");
        }
    }

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
                .epilog("And maybe you can now guess the term.ooo!");
        argumentParser.addArgument("-exclude")
                .metavar("combinations")
                .help("Characters to exclude")
                .required(false);
        argumentParser.addArgument("-include")
                .metavar("combinations")
                .help("Characters to include, but not in the right position")
                .required(false);
        argumentParser.addArgument("-found")
                .metavar("combinations")
                .help("Characters found in the right position")
                .required(false);


        try {
            LOGGER.info("Starting up ...");
            final var arguments = argumentParser.parseArgs(args);
            var possibleWords = Files.readAllLines(Paths.get("src/main/resources/words.txt"));

            final var toExclude = arguments.getString("exclude");
            if (nonNull(toExclude)) {
                LOGGER.info("Removing words with letters: " + toExclude);
                possibleWords = new FilterExcluded().filter(possibleWords, toExclude);
            }

            final var includeParams = arguments.getString("include");
            if (nonNull(includeParams)) {
                final var includeList = parseParams(includeParams);
                LOGGER.info("Looking for words that doesn't contains words in positions: " + includeList);
                possibleWords = new FilterIncluded().filter(possibleWords, includeList);
            }

            final var foundParams = arguments.getString("found");
            if (nonNull(foundParams)) {
                final var foundList = parseParams(foundParams);
                System.out.print("Looking for words with exactly positions: ");
                foundList.forEach(System.out::print);
                System.out.println();
                possibleWords = new FilterExact().filter(possibleWords, foundList);
            }

            if (possibleWords.isEmpty()) {
                argumentParser.printHelp();
            } else {
                LOGGER.info("Possible words: " + possibleWords);
            }
            LOGGER.info("Processing complete!");
        } catch (ArgumentParserException e) {
            LOGGER.warning(e.getMessage());
        } catch (IOException e) {
            LOGGER.severe(e.getMessage());
        }

    }

    private static List<WordCombination> parseParams(final String params) {
        return Stream.of(params.split(","))
                .map(WordCombination::new)
                .toList();
    }

}
