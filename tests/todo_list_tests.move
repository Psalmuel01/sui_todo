#[test_only]
module todo_list::todo_list_tests;

use todo_list::todo_list::{new, add, remove, length, TodoList};

// const ENotImplemented: u64 = 0;
const ELengthAfterFirstAdd: u64 = 100;
const ELengthAfterSecondAdd: u64 = 101;
const ELengthAfterRemove: u64 = 102;
const ENotLengthAfterRemove: u64 = 103;

#[test]
fun test_todo_list(): TodoList {
    let mut ctx = tx_context::dummy();
    let mut list = new(&mut ctx);

    // Add an item and check length
    add(&mut list, b"first task".to_ascii_string());
    assert!(length(&list) == 1, ELengthAfterFirstAdd);

    // Add another item and check length
    add(&mut list, b"second task".to_ascii_string());
    assert!(length(&list) == 2, ELengthAfterSecondAdd);

    // Remove the item and check length
    remove(&mut list, 0);
    assert!(length(&list) == 1, ELengthAfterRemove);

    // Unpack to consume the value and avoid the 'drop' error
    list
}

#[test, expected_failure(abort_code = ::todo_list::todo_list_tests::ENotLengthAfterRemove)]
fun test_todo_list_fail(): TodoList {
    let mut ctx = tx_context::dummy();
    let mut list = new(&mut ctx);

    // Add an item and check length
    add(&mut list, b"first task".to_ascii_string());
    assert!(length(&list) == 2, ENotLengthAfterRemove);
    list
}
