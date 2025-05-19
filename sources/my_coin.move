module my_coin::my_coin;

use sui::coin::{Self, Coin, TreasuryCap};
use sui::event;
#[test_only]
use sui::test_scenario;

// use sui::url;

public struct MY_COIN has drop {}

public struct MintEvent has copy, drop {
    amount: u64,
    recipient: address,
}

public struct BurnEvent has copy, drop {
    amount: u64,
}

fun init(witness: MY_COIN, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency<MY_COIN>(
        witness,
        2,
        b"MY",
        b"My Coin",
        b"My coin description",
        option::none(),
        // option::some(url::new_unsafe_from_bytes(b"https://example.com")),
        ctx,
    );
    // transfer::public_freeze_object(metadata);
    transfer::public_transfer(metadata, tx_context::sender(ctx));
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
}

public entry fun mint(
    treasury_cap: &mut TreasuryCap<MY_COIN>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    event::emit(MintEvent { amount, recipient });
    transfer::public_transfer(coin, recipient)
}

public entry fun burn(treasury_cap: &mut TreasuryCap<MY_COIN>, coin: Coin<MY_COIN>) {
    let amount = coin::value(&coin);
    coin::burn(treasury_cap, coin);
    event::emit(BurnEvent { amount });
}

#[test]
public fun test_mint() {
    let user = @0xA;
    let receiver = @0xB;
    let num_coins = 10;

    let mut scenario_val = test_scenario::begin(user);
    let scenario = &mut scenario_val;
    {
        let ctx = test_scenario::ctx(scenario);
        init(MY_COIN {}, ctx)
    };

    test_scenario::next_tx(scenario, user);
    {
        let mut treasuryCap = test_scenario::take_from_sender<TreasuryCap<MY_COIN>>(scenario);
        mint(&mut treasuryCap, num_coins, receiver, test_scenario::ctx(scenario));
        test_scenario::return_to_sender(scenario, treasuryCap);
    };

    test_scenario::next_tx(scenario, receiver);
    {
        let my_coin = test_scenario::take_from_sender<Coin<MY_COIN>>(scenario);
        assert!(coin::value(&my_coin) == num_coins, 3);
        test_scenario::return_to_sender(scenario, my_coin);
    };
    test_scenario::end(scenario_val);
}

#[test]
public fun test_burn() {
    let user = @0xA;
    let num_coins = 10;

    let mut scenario_val = test_scenario::begin(user);
    let scenario = &mut scenario_val;
    {
        let ctx = test_scenario::ctx(scenario);
        init(MY_COIN {}, ctx)
    };

    test_scenario::next_tx(scenario, user);
    {
        let mut treasuryCap = test_scenario::take_from_sender<TreasuryCap<MY_COIN>>(scenario);
        mint(&mut treasuryCap, num_coins, user, test_scenario::ctx(scenario));
        test_scenario::return_to_sender(scenario, treasuryCap);
    };

    test_scenario::next_tx(scenario, user);
    {
        let mut treasuryCap = test_scenario::take_from_sender<TreasuryCap<MY_COIN>>(scenario);
        let my_coin = test_scenario::take_from_sender<Coin<MY_COIN>>(scenario);

        let supply_before_burn = coin::total_supply(&treasuryCap);
        assert!(supply_before_burn == 10, 3);

        burn(&mut treasuryCap, my_coin);

        let supply_after_burn = coin::total_supply(&treasuryCap);
        assert!(supply_after_burn == 0, 3);

        test_scenario::return_to_sender(scenario, treasuryCap);
    };
    test_scenario::end(scenario_val);
}
