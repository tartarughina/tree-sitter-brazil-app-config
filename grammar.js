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
    source_file: $ => repeat($.config),

    config: $ => seq(
      field('key', $.key),
      field('assignment', choice('=', '+=')),
      field('value', $._value),
      ';',
    ),

    property: $ => seq(
      field('key', $.string),
      field('assignment', choice('=', '+=')),
      field('value', $._value),
      ';',
    ),

    key: $ => seq(
      field('stage', $._pubsub),
      token.immediate('.'),
      field('realm', $._pubsub),
      repeat1(seq(
        token.immediate('.'),
        $.identifier
      ))
    ),

    _value: $ => choice(
      prec(2, $.number),
      prec(2, $.boolean),
      prec(1, $.dictionary),
      prec(1, $.list),
      prec(1, $.string)
    ),

    dictionary: $ => seq(
      '{',
      repeat($.property),
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

    _non_quoted_string: _ => token(prec(-1, /(?:\\[\s#,;{}=+().]|\\[.\s#,;{}=+()]|[^.\s#,;{}=+()])+/)),

    _link_string: _ => token(prec(-2, /@(?:\\[\s#,;{}=+()]|[^\s#,;{}=+()])+/)),

    number: _ => /-?\d+(\.\d+)?([eE][+-]?\d+)?/,

    boolean: _ => /"?(true|false)"?/,

    _pubsub: $ => choice(
      $.wildcard,
      $.identifier
    ),

    wildcard: _ => '*', // A simple rule for the wildcard character

    identifier: _ => /[a-zA-Z0-9_-]+/, // Adjusted regex for characters allowed in segments

    comment: _ => token(prec(-10, /#[^\n]*/)),
  }
});
