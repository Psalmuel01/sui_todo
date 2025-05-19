module my_coin::my_nft;

use std::string::{utf8, String};
use sui::event;
use sui::url::{Self, Url};

public struct MY_NFT has key, store {
    id: UID,
    name: String,
    description: String,
    url: Url,
}

public struct NFTMinted has copy, drop {
    object_id: ID,
    creator: address,
    name: String,
}

public struct NFTTransferred has copy, drop {
    object_id: ID,
    sender: address,
    recipient: address,
}

public struct NFTUpdated has copy, drop {
    object_id: ID,
    new_description: String,
}

public struct NFTBurned has copy, drop {
    object_id: ID,
    burner: address,
}

#[allow(lint(self_transfer))]
public fun mint_to_sender(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    let nft = MY_NFT {
        id: object::new(ctx),
        name: utf8(name),
        description: utf8(description),
        url: url::new_unsafe_from_bytes(url),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, sender);
}

public fun transfer(nft: MY_NFT, recipient: address, ctx: &mut TxContext) {
    let object_id = object::id(&nft);
    transfer::public_transfer(nft, recipient);
    event::emit(NFTTransferred {
        object_id,
        sender: ctx.sender(),
        recipient,
    });
}

public fun update_description(nft: &mut MY_NFT, new_description: vector<u8>, _: &mut TxContext) {
    nft.description = utf8(new_description);
    event::emit(NFTUpdated {
        object_id: object::id(nft),
        new_description: nft.description,
    })
}

public fun burn(nft: MY_NFT, ctx: &mut TxContext) {
    let object_id = object::id(&nft);
    let MY_NFT { id, .. } = nft;
    id.delete();
    event::emit(NFTBurned {
        object_id,
        burner: ctx.sender(),
    })
}

public fun name(nft: &MY_NFT): &String {
    &nft.name
}

public fun description(nft: &MY_NFT): &String {
    &nft.description
}

public fun url(nft: &MY_NFT): &Url {
    &nft.url
}
