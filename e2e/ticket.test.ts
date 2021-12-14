// Copyright (c) The Diem Core Contributors
// SPDX-License-Identifier: Apache-2.0
//
// This file is generated on new project creation.

import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";

import { delay } from "https://deno.land/std@0.114.0/async/delay.ts";

import * as devapi from "../main/devapi.ts";
import * as main from "../main/mod.ts";
import * as context from "../main/context.ts";
import * as mv from "../main/move.ts";
import * as helpers from "../main/helpers.ts"


Deno.test("Test Assert", () => {
  assert("Hello");
});

Deno.test("Resell success", async () => {

  let reseller = await context.UserContext.fromDisk("test");
  let buyer= await context.UserContext.fromDisk("third");
  let owner= context.defaultUserContext;
  let typeArguments: string[] = [];

  console.log("\n reseller balance:", await devapi.resourcesWithName("Balance", reseller.address));
  console.log("\n buyer balance:", await devapi.resourcesWithName("Balance", buyer.address));
  console.log("creator balance:", await devapi.resourcesWithName("Balance", owner.address));

  await delay(5000);

  console.log("\n publish coin:");

  // Publish
  let scriptFunctionPublish: string = context.defaultUserContext.address + "::BasicCoin::publish_balance_script";
  let args_publish: any[] = [];

  let txn_publish_seller = await helpers.invokeScriptFunctionForContext(reseller, scriptFunctionPublish, typeArguments, args_publish);
  txn_publish_seller = await devapi.waitForTransaction(txn_publish_seller.hash);

  let txn_publish_buyer = await helpers.invokeScriptFunctionForContext(buyer, scriptFunctionPublish, typeArguments, args_publish);
  txn_publish_buyer = await devapi.waitForTransaction(txn_publish_buyer.hash);

  let txn_publish_owner = await helpers.invokeScriptFunction(scriptFunctionPublish, typeArguments, args_publish);
  txn_publish_owner = await devapi.waitForTransaction(txn_publish_owner.hash);

  assert(txn_publish_seller.success);
  assert(txn_publish_buyer.success);

  console.log("reseller balance:", await devapi.resourcesWithName("Balance", reseller.address));
  console.log("buyer balance:", await devapi.resourcesWithName("Balance", buyer.address));
  console.log("creator balance:", await devapi.resourcesWithName("Balance", owner.address));


  await delay(5000);

  console.log("\n mint coin:");

  // Mint
  let scriptFunctionMint: string = context.defaultUserContext.address + "::BasicCoin::mint_script";

  let args_min_seller: any[] = [mv.Address(reseller.address), mv.U64("500")];
  let args_min_buyer: any[] = [mv.Address(buyer.address), mv.U64("500")];


  let txn_mint_seller = await helpers.invokeScriptFunction(scriptFunctionMint, typeArguments, args_min_seller);
  txn_mint_seller = await devapi.waitForTransaction(txn_mint_seller.hash);

  let txn_mint_buyer = await helpers.invokeScriptFunction(scriptFunctionMint, typeArguments, args_min_buyer);
  txn_mint_buyer = await devapi.waitForTransaction(txn_mint_buyer.hash);


  assert(txn_mint_seller.success);
  assert(txn_mint_buyer.success);


  console.log("reseller balance, after mint:", await devapi.resourcesWithName("Balance", reseller.address));
  console.log("buyer balance, after mint:", await devapi.resourcesWithName("Balance", buyer.address));

  // Create event

  await delay(10000);

  console.log("\n create event with 5 tickets with price 50; each ticket can be sold for 2 times; the highest price to be resold is 100");

  let scriptFunctionCreateEvent: string = context.defaultUserContext.address + "::Tickets::create_event_script";
  let args_create_event: any[] = [mv.U64("50"), mv.U64("5"), mv.U64("2"), mv.U64("100")];
  let txn_create_event =  await helpers.invokeScriptFunction(scriptFunctionCreateEvent, typeArguments, args_create_event);
  txn_create_event = await devapi.waitForTransaction(txn_create_event.hash);

  console.log("event created, after transaction:", (await devapi.resourcesWithName("EventCollection", owner.address))[0].data);
  console.log("tickets created, after transaction:", (await devapi.resourcesWithName("TicketsForSale", owner.address))[0].data);

  let creation_num = (await devapi.resourcesWithName("EventCollection", owner.address))[0].data.events[0].id.creation_num;

  // Transfer money

  /*console.log("\n transfer money");

  let scriptFunctionTransfer: string = context.defaultUserContext.address + "::BasicCoin::transfer_script";
  let args_transfer: any[] = [mv.Address(context.defaultUserContext.address), mv.U64("100")];
  let txn_transfer =  await helpers.invokeScriptFunctionForContext(reseller, scriptFunctionTransfer, typeArguments, args_transfer);

  txn_transfer = await devapi.waitForTransaction(txn_transfer.hash);

  assert(txn_transfer.success);
*/

  // Buy tickets

  console.log("\n reseller buys a ticket from the event creator at the price 50");

  console.log("tickets owned by the reseller, before transaction:", (await devapi.resourcesWithName("OwnedTickets", reseller.address)));

  await delay(10000);



  let scriptFunctionPurchaseEvent: string = context.defaultUserContext.address + "::Tickets::purchase_script";
  let args_purchase_event: any[] = [mv.Address(owner.address), mv.Address(owner.address), mv.U64(creation_num), mv.U64("0")];
  let txn_reseller_purchase =  await helpers.invokeScriptFunctionForContext(reseller,
    scriptFunctionPurchaseEvent, typeArguments, args_purchase_event);
    txn_reseller_purchase = await devapi.waitForTransaction(txn_reseller_purchase.hash);

  assert(txn_reseller_purchase.success);

  console.log("tickets to be sold by the creator, after transaction:", (await devapi.resourcesWithName("TicketsForSale", owner.address))[0].data);
  console.log("creator balance, after transaction:", await devapi.resourcesWithName("Balance", owner.address));



  console.log("tickets owned by the reseller, after transaction:", (await devapi.resourcesWithName("OwnedTickets", reseller.address))[0].data);
  console.log("reseller balance, after transaction:", await devapi.resourcesWithName("Balance", reseller.address));

  await delay(10000);


  // List Resell

  console.log("list for sale by the reseller");

  console.log("tickets to be sold by the reseller, before transaction:", (await devapi.resourcesWithName("TicketsForSale", reseller.address))[0]);

  let scriptFunctionListForResell: string = context.defaultUserContext.address + "::Tickets::list_for_sale_script";
  let args_for_sell_event: any[] = [mv.Address(owner.address), mv.U64(creation_num), mv.U64("100"), mv.U64("0")];
  let txn_for_resell = await helpers.invokeScriptFunctionForContext(reseller,
    scriptFunctionListForResell, typeArguments, args_for_sell_event);
  txn_for_resell = await devapi.waitForTransaction(txn_for_resell.hash);

  assert(txn_for_resell.success);

  console.log("tickets to be sold by the reseller, after transaction:", (await devapi.resourcesWithName("TicketsForSale", reseller.address))[0].data);

  await delay(5000);


  // Buy

  console.log("\n buyer purchases a ticket from the event creator at the price 100");

  console.log("tickets owned by the buyer, before transaction:", (await devapi.resourcesWithName("OwnedTickets", buyer.address))[0]);



  let args_purchase_buyer_event: any[] = [mv.Address(reseller.address), mv.Address(owner.address), mv.U64(creation_num), mv.U64("0")];

  let txn_buyer_purchase =  await helpers.invokeScriptFunctionForContext(buyer,
    scriptFunctionPurchaseEvent, typeArguments, args_purchase_buyer_event);
  txn_buyer_purchase = await devapi.waitForTransaction(txn_buyer_purchase.hash);

  assert(txn_buyer_purchase.success);


  console.log("tickets to be sold by the reseller, after transaction:", (await devapi.resourcesWithName("TicketsForSale", reseller.address))[0]);
  console.log("reseller balance, after transaction:", await devapi.resourcesWithName("Balance", reseller.address));


  console.log("tickets owned by the buyer, after transaction:", (await devapi.resourcesWithName("OwnedTickets", buyer.address))[0].data);
  console.log("buyer balance, after transaction:", await devapi.resourcesWithName("Balance", buyer.address));

  await delay(5000);


  // The buyer tries to list it for sale, will fail

  console.log("list for sale by the buyer");

  console.log("tickets to be sold by the buyer, before transaction:", (await devapi.resourcesWithName("TicketsForSale", buyer.address)));

  //let scriptFunctionListForResellBuyer: string = context.defaultUserContext.address + "::Tickets::list_for_sale_script";
  //let args_for_sell_event: any[] = [mv.Address(owner.address), mv.U64(creation_num), mv.U64("100"), mv.U64("0")];
  let txn_for_resell_buyer = await helpers.invokeScriptFunctionForContext(buyer,
    scriptFunctionListForResell, typeArguments, args_for_sell_event);
    txn_for_resell_buyer = await devapi.waitForTransaction(txn_for_resell_buyer.hash);

  //assert(txn_for_resell_buyer.fail);

  console.log("tickets to be sold by the buyer, after transaction:", (await devapi.resourcesWithName("TicketsForSale", buyer.address)));
});
