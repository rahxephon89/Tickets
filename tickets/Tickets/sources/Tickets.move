module Sender::Tickets {
    use Std::Signer;
    use Std::GUID;
    use Std::Vector;
    use Std::Option::{Self, Option};
    use Sender::BasicCoin::{Self};

    struct Event has store, drop {
        price: u64, //number of BaseCoin?
        supply: u64,
        owner: address,
        id: GUID::ID,
        max_resell_times: u64,
        max_resell_price: u64,
    }

    struct EventCollection has key, drop {
        events: vector<Event>
    }

    struct Ticket has store, drop{
        event_id: GUID::ID,
        ticket_id: u64,
        transaction_num: u64,
        original_price: u64,
        listing_price: u64,
        creator_addr: address,
    }

    struct TicketsForSale has key {
        tickets: vector<Ticket>
    }

    struct OwnedTickets has key {
        tickets: vector<Ticket>
    }

    const ERROR: u64 = 1;


    fun create_tickets(creator: &signer, event_id: GUID::ID, supply: u64, price: u64) acquires TicketsForSale {

        let creator_addr = Signer::address_of(creator);
        if (!exists<TicketsForSale>(creator_addr)) {
            move_to(creator, TicketsForSale { tickets: Vector::empty<Ticket>() });
        };

        let tickets_for_sale = &mut borrow_global_mut<TicketsForSale>(creator_addr).tickets;

        let i = 0;
        while (i < supply) {
            Vector::push_back(
                tickets_for_sale,
                Ticket {event_id: copy event_id, ticket_id: i, transaction_num: 0, original_price: price, listing_price: price, creator_addr}
            );
            i = i + 1;
        };

    }

    fun index_of_ticket(tickets: &vector<Ticket>, event_id: &GUID::ID, ticket_id: u64): Option<u64> {
        let i = 0;
        let len = Vector::length(tickets);
        while (i < len) {
            let ticket = Vector::borrow(tickets, i); // GUID::eq_id(&ticket.event_id, event_id)
            if (&ticket.event_id == event_id && ticket.ticket_id == ticket_id) {
                return Option::some(i)
            };
            i = i + 1;
        };
        Option::none()
    }

    fun index_of_event(events: &vector<Event>, event_id: &GUID::ID): Option<u64> {
        let i = 0;
        let len = Vector::length(events);
        while (i < len) {
            let event = Vector::borrow(events, i); // GUID::eq_id(&ticket.event_id, event_id)
            if (&event.id == event_id) {
                return Option::some(i)
            };
            i = i + 1;
        };
        Option::none()
    }

    fun list_for_sale(seller: &signer, creator: address, creation_num: u64, list_price: u64, ticket_id: u64) acquires OwnedTickets, TicketsForSale, EventCollection {

        let seller_addr = Signer::address_of(seller);
        if (!exists<TicketsForSale>(seller_addr)) {
            move_to(seller, TicketsForSale { tickets: Vector::empty<Ticket>() });
        };

        let tickets_for_sale = &mut borrow_global_mut<TicketsForSale>(seller_addr).tickets;
        let owned_tickets = &mut borrow_global_mut<OwnedTickets>(seller_addr).tickets;

        let event_id = GUID::create_id(creator, creation_num);

        let idx = index_of_ticket(owned_tickets, &event_id, ticket_id);

        let index = Option::extract(&mut idx);

        let ticket = Vector::remove(owned_tickets, index);
        let events = &borrow_global<EventCollection>(ticket.creator_addr).events;
        let ev_idx = index_of_event(events, &event_id);
        let event_index = Option::extract(&mut ev_idx);
        let event = Vector::borrow(events, event_index);

        assert!(event.max_resell_price >= list_price, ERROR);

        assert!(event.max_resell_times > ticket.transaction_num, ERROR);

        ticket.listing_price = list_price;
        Vector::push_back(tickets_for_sale, ticket);

    }

    fun purchase(buyer: &signer, seller_addr: address, creator: address, creation_num: u64,  ticket_id: u64) acquires TicketsForSale, OwnedTickets{

        let buyer_addr = Signer::address_of(buyer);

        if (!exists<OwnedTickets>(buyer_addr)) {
            move_to(buyer, OwnedTickets { tickets: Vector::empty<Ticket>() });
        };

        let event_id = GUID::create_id(creator, creation_num);

        let buyer_owned_list = &mut borrow_global_mut<OwnedTickets>(buyer_addr).tickets;
        let tickets_for_sale = &mut borrow_global_mut<TicketsForSale>(seller_addr).tickets;

        let idx = index_of_ticket(tickets_for_sale, &event_id, ticket_id);
        let index = Option::extract(&mut idx);
        let ticket = Vector::remove(tickets_for_sale, index);

        BasicCoin::transfer(buyer, seller_addr, ticket.listing_price);

        ticket.transaction_num = ticket.transaction_num + 1;
        Vector::push_back(buyer_owned_list, ticket);

    }


    fun create_event(creator: signer, price: u64, supply: u64, max_resell_times: u64, max_resell_price: u64) acquires EventCollection, TicketsForSale {
        let addr = Signer::address_of(&creator);
        let guid = GUID::create(&creator);
        let id = GUID::id(&guid);
        let ev = Event { price, supply, owner: addr,
        id: copy id, max_resell_times, max_resell_price};

        if (!exists<EventCollection>(Signer::address_of(&creator))) {
            move_to(&creator, EventCollection { events: Vector::empty<Event>() });
        };

        let event_collection = &mut borrow_global_mut<EventCollection>(Signer::address_of(&creator)).events;
        Vector::push_back(
            event_collection,
            ev
        );

        create_tickets(&creator, copy id, supply, price);

    }

    public(script) fun create_event_script(creator: signer, price: u64, supply: u64, max_resell_times:
    u64, max_resell_price: u64) acquires EventCollection, TicketsForSale {
        create_event(creator, price, supply, max_resell_times, max_resell_price);
    }

    public(script) fun purchase_script(buyer: signer, seller_addr: address, creator: address, creation_num: u64,  ticket_id: u64) acquires TicketsForSale, OwnedTickets{
        purchase(&buyer, seller_addr, creator, creation_num, ticket_id);
    }

    public(script) fun list_for_sale_script(seller: signer, creator: address, creation_num: u64, list_price: u64, ticket_id: u64) acquires OwnedTickets, TicketsForSale, EventCollection {
        list_for_sale(&seller, creator, creation_num, list_price, ticket_id);
    }



    // Resell success
    #[test(owner = @0x42, creator = @0x1, buyer = @0x2, reseller = @0x3)]
    fun test_resell_success(owner: signer, creator: signer, buyer: signer, reseller: signer ) acquires EventCollection, TicketsForSale, OwnedTickets {
        let creator_addr = Signer::address_of(&creator);
        let buyer_addr = Signer::address_of(&buyer);
        let reseller_addr = Signer::address_of(&reseller);
        BasicCoin::publish_balance(&creator);
        BasicCoin::publish_balance(&buyer);
        BasicCoin::publish_balance(&reseller);
        BasicCoin::mint(&owner, creator_addr, 500);
        BasicCoin::mint(&owner, reseller_addr, 500);
        BasicCoin::mint(&owner, buyer_addr, 500);
        create_event(creator, 100, 100, 2, 200);
        purchase(&reseller, creator_addr, creator_addr, 0, 3);
        list_for_sale(&reseller, creator_addr, 0, 200, 3);
        purchase(&buyer, reseller_addr, creator_addr, 0, 3);
        assert!(BasicCoin::balance_of(creator_addr) == 600, ERROR);
        assert!(BasicCoin::balance_of(reseller_addr) == 600, ERROR);
        assert!(BasicCoin::balance_of(buyer_addr) == 300, ERROR);
    }

    // Resell failure
    #[test(owner = @0x42, creator = @0x1, buyer = @0x2, reseller = @0x3)]
    #[expected_failure]
    fun test_resell_abort_price_limit(owner: signer, creator: signer, buyer: signer, reseller: signer ) acquires EventCollection, TicketsForSale, OwnedTickets {
        let creator_addr = Signer::address_of(&creator);
        let buyer_addr = Signer::address_of(&buyer);
        let reseller_addr = Signer::address_of(&reseller);
        BasicCoin::publish_balance(&creator);
        BasicCoin::publish_balance(&buyer);
        BasicCoin::publish_balance(&reseller);
        BasicCoin::mint(&owner, creator_addr, 500);
        BasicCoin::mint(&owner, reseller_addr, 500);
        BasicCoin::mint(&owner, buyer_addr, 500);
        create_event(creator, 100, 100, 2, 200);
        purchase(&reseller, creator_addr, creator_addr, 0, 3);
        list_for_sale(&reseller, creator_addr, 0, 300, 3); // Resell price (300) is greater than the limit  (200)
        //purchase(&buyer, reseller_addr, creator_addr, 0, 3);
    }

    // Resell failure
    #[test(owner = @0x42, creator = @0x1, buyer = @0x2, reseller = @0x3)]
    #[expected_failure]
    fun test_resell_abort_time_limit(owner: signer, creator: signer, buyer: signer, reseller: signer ) acquires EventCollection, TicketsForSale, OwnedTickets {
        let creator_addr = Signer::address_of(&creator);
        let buyer_addr = Signer::address_of(&buyer);
        let reseller_addr = Signer::address_of(&reseller);
        BasicCoin::publish_balance(&creator);
        BasicCoin::publish_balance(&buyer);
        BasicCoin::publish_balance(&reseller);
        BasicCoin::mint(&owner, creator_addr, 500);
        BasicCoin::mint(&owner, reseller_addr, 500);
        BasicCoin::mint(&owner, buyer_addr, 500);
        create_event(creator, 100, 100, 1, 200);
        purchase(&reseller, creator_addr, creator_addr, 0, 3);
        list_for_sale(&reseller, creator_addr, 0, 200, 3); // Resell price (300) is greater than the limit  (200)
        purchase(&buyer, reseller_addr, creator_addr, 0, 3);
    }

    // Resell failure
    #[test(owner = @0x42, creator = @0x1, reseller = @0x3)]
    #[expected_failure]
    fun test_resell_abort_money_not_enough(owner: signer, creator: signer, reseller: signer ) acquires EventCollection, TicketsForSale, OwnedTickets {
        let creator_addr = Signer::address_of(&creator);
        let reseller_addr = Signer::address_of(&reseller);
        BasicCoin::publish_balance(&creator);
        BasicCoin::publish_balance(&reseller);
        BasicCoin::mint(&owner, creator_addr, 500);
        BasicCoin::mint(&owner, reseller_addr, 500);
        create_event(creator, 600, 100, 1, 1000);
        purchase(&reseller, creator_addr, creator_addr, 0, 3);
    }

}
