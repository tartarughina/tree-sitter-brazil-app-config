/**
 * @file A parser for Brazil Config files (.cfg)
 * @author tartarughina <riccardo.strina@icloud.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "brazil_app_config",

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($.pair),

    pair: $ => seq(
      field('key', $.wildcard_string), // Key can now be a wildcard string if it matches the pattern
      field('assignment', choice('=', '+=')),
      field('value', $._value),
      ';',
    ),

    _value: $ => choice(
      $.dictionary,
      $.list,
      $.string
    ),

    dictionary: $ => seq(
      '{',
      repeat($.pair),
      '}'
    ),

    list: $ => seq(
      '(',
      optional($._elements),
      ')'
    ),

    _elements: $ => seq(
      $._value,
      repeat(seq(',', $._value)),
      optional(',')
    ),

    string: $ => choice(
      $._quoted_string,
      $._non_quoted_string,
      $._link_string
    ),

    _quoted_string: _ => /"(?:\\"|[^"])*"/,

    _non_quoted_string: _ => /(?:\\[\s#,;{}=+().]|\\[.\s#,;{}=+()]|[^.\s#,;{}=+()])+/,

    wildcard_string: $ => prec(1, seq( // Use 'prec' to give this rule higher precedence
      // if its initial part could also be a _non_quoted_string.
      // This ensures it's chosen when it looks like a wildcard pattern.
      $.wildcard_segment, // Start with a segment (can be wildcard or identifier)
      repeat(seq(
        token.immediate('.'), // Match the dot literally, immediately after the previous segment
        $.wildcard_segment    // Followed by another segment
      ))
    )),

    wildcard_segment: $ => choice(
      $.wildcard,
      $.identifier_segment
    ),

    wildcard: _ => '*', // A simple rule for the wildcard character

    // This should match a segment within a wildcard string (e.g., 'master', 'JavaMediaClient2', 'dev')
    // It should NOT contain '.', '*', or the main delimiters (;,=,+,(),{})
    identifier_segment: _ => /[a-zA-Z0-9_-]+/, // Adjusted regex for characters allowed in segments
    // (letters, numbers, underscore, hyphen)


    // Links have the format @configKey
    _link_string: _ => /@(?:\\[\s#,;{}=+()]|[^\s#,;{}=+()])+/,

    // Comments start with # and continue to the end of the line
    comment: _ => token(prec(-10, /#[^\n]*/)),
  }
});
