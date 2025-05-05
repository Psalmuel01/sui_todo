/// Module: todo_list
module todo_list::todo_list;

use std::ascii::String;

// List of todos. Can be managed by the owner and shared with others
public struct TodoList has key, store {
    id: UID,
    items: vector<String>,
}

// Create a new todo list
public fun new(ctx: &mut TxContext): TodoList {
    let list = TodoList {
        id: object::new(ctx),
        items: vector[],
    };

    list
}

// Add an new todo item
public fun add(list: &mut TodoList, item: String) {
    list.items.push_back(item);
}

// Remove a todo list from the list by index
public fun remove(list: &mut TodoList, index: u64) {
    list.items.remove(index);
}

// Get the number of items in the list
public fun length(list: &TodoList): u64 {
    list.items.length()
}

// sui client ptb \
// --gas-budget 100000000 \
// --assign sender @$MY_ADDRESS \
// --move-call $PACKAGE_ID::todo_list::new \
// --assign list \
// --transfer-objects "[list]" sender
