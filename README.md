# tree-sitter-brazil-config

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for Amazon's Brazil Config files (.cfg).

## About Brazil Config

Brazil Config is a configuration file format used extensively within Amazon's internal build and deployment systems. It provides a structured way to define key-value pairs with support for nested structures like dictionaries and lists.

## Features

This grammar supports all Brazil Config syntax features:

- **Key-Value Pairs**: Basic configuration entries with keys and values
- **Assignment Operators**: Both standard assignment (`=`) and append (`+=`) operators
- **Scalar Values**: String literals (quoted and non-quoted)
- **Container Types**: Lists and dictionaries (maps) with nested support
- **Comments**: Line comments starting with `#`
- **Special Syntax**: Support for domain/realm notation (e.g., `*.*.key`)
- **Links**: References to other configuration values using `@` syntax

## Installation

### For Tree-sitter CLI

```bash
npm install tree-sitter-brazil-config
```

### For Neovim with nvim-treesitter

Add to your Neovim configuration:

```lua
require'nvim-treesitter.configs'.setup {
  ensure_installed = { "brazil_app_config" },
  -- ... other config
}
```

## Usage

### With Tree-sitter CLI

```bash
# Parse a Brazil Config file
tree-sitter parse example.cfg

# Test the grammar
tree-sitter test
```

### Example Brazil Config Code

```
# Basic key-value pairs
*.*.key1 = value1;

# Lists
*.*.key2 = (value2, value3);

# Dictionaries
*.*.key3 = {
    key4 = value4;
    key5 = value5;
};

# Nested structures
map1 = {
    key1 = value1;
    key2 = { 
        key3 = value3;
    };
};

# Append operator
*.*.map += {
    key2 = "bar";
};
```

## Grammar Development

### Building

```bash
# Generate the parser
tree-sitter generate

# Run tests
tree-sitter test

# Test with a specific file
tree-sitter parse path/to/file.cfg
```

### Testing

The grammar includes comprehensive tests covering all Brazil Config syntax features and edge cases. Tests are located in `test/corpus/`.

## Structure

- `grammar.js`: The main grammar definition
- `test/corpus/*.txt`: Test files for different syntax features
- `src/`: Generated parser code
- `bindings/`: Language bindings

## Resources

- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
