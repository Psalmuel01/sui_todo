# Todo List Smart Contract

A simple todo list implementation on Sui blockchain that allows creating and managing todo lists.

## Features

- Create new todo lists
- Add items to a todo list
- Remove items from a todo list
- Get the length of a todo list
- Events emitted for list creation, item addition and removal

## Contract Structure

### TodoList Module (`todo_list.move`)

The main module implements:

- `TodoList` - Main struct for storing todo items
- Event structs for tracking changes:
  - `TodoListCreated`
  - `ItemAdded`
  - `ItemRemoved`
- Functions:
  - `new()` - Create a new todo list
  - `add()` - Add an item
  - `remove()` - Remove an item by index
  - `length()` - Get number of items

### Build

To build the Move package, run:

```bash
sui move build
```

### Tests (`todo_list_tests.move`)

Test module includes:

- `test_todo_list()` - Tests basic functionality:
  - Creating a new list
  - Adding items
  - Removing items
  - Checking length
- `test_todo_list_fail()` - Tests failure case with incorrect length assertion

To test, run:

```bash
sui move test
```

## Example Usage

Create a new todo list:

```bash
sui client ptb \
--gas-budget 100000000 \
--assign sender @$MY_ADDRESS \
--move-call $PACKAGE_ID::todo_list::new \
--assign list \
--transfer-objects "[list]" sender
```
