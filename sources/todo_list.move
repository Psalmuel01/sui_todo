/// Module: todo_list
module todo_list::todo_list;

use std::string::String;
use sui::event;

// List of todos. Can be managed by the owner and shared with others
public struct TodoList has key, store {
    id: UID,
    items: vector<String>,
}

// Events emitted
public struct TodoListCreated has copy, drop {
    list_id: ID,
    creator: address,
}

public struct ItemAdded has copy, drop {
    list_id: ID,
    item: String,
    item_index: u64,
}

public struct ItemRemoved has copy, drop {
    list_id: ID,
    item: String,
    item_index: u64,
}

// Create a new todo list
public fun new(ctx: &mut TxContext): TodoList {
    let list = TodoList {
        id: object::new(ctx),
        items: vector[],
    };

    event::emit(TodoListCreated {
        list_id: object::id(&list),
        creator: tx_context::sender(ctx),
    });

    list
}

// Add an new todo item
public fun add(list: &mut TodoList, item: String) {
    let index = list.items.length();
    list.items.push_back(item);

    event::emit(ItemAdded {
        list_id: object::id(list),
        item: item,
        item_index: index,
    });
}

// Remove a todo list from the list by index
public fun remove(list: &mut TodoList, index: u64) {
    list.items.remove(index);

    event::emit(ItemRemoved {
        list_id: object::id(list),
        item: list.items[index],
        item_index: index,
    });
}

// Get number of items in the list
public fun length(list: &TodoList): u64 {
    list.items.length()
}
