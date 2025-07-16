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
      field('key', $.identifier),
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
      seq(
        '"',
        repeat(choice(
          /[^\\"\n]+/, // Any character except backslash, double quote, or newline
          seq('\\', /[\\'"nrt]/) // Escape sequences
        )),
        '"'
      ),
      seq(
        '@',
        $.identifier
      )
    ),

    number: _ => /-?\d+(\.\d+)?([eE][+-]?\d+)?/,

    boolean: _ => token(prec(1, /(true|false)/)),

    _pubsub: $ => choice(
      $.wildcard,
      $.identifier
    ),

    wildcard: _ => '*',

    identifier: _ => /[\p{XID_Start}_$][\p{XID_Continue}\-_.$]*/,

    comment: _ => token(prec(-10, /#[^\n]*/)),
  }
});
