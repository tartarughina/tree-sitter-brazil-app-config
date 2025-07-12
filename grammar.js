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
      field('key', $.string),
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

    // Non-quoted strings can't contain whitespace or special characters unless escaped
    _non_quoted_string: _ => /(?:\\[\s#,;{}=+()]|[^\s#,;{}=+()])+/,

    // Links have the format @configKey
    _link_string: _ => /@(?:\\[\s#,;{}=+()]|[^\s#,;{}=+()])+/,

    // Comments start with # and continue to the end of the line
    comment: _ => token(prec(-10, /#[^\n]*/)),
  }
});
