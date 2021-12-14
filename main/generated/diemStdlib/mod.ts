
import { Serializer, Deserializer } from '../serde/mod.ts';
import { BcsSerializer, BcsDeserializer } from '../bcs/mod.ts';
import { Optional, Seq, Tuple, ListTuple, unit, bool, int8, int16, int32, int64, int128, uint8, uint16, uint32, uint64, uint128, float32, float64, char, str, bytes } from '../serde/mod.ts';

import * as DiemTypes from '../diemTypes/mod.ts';

/**
 * Structured representation of a call into a known Move script.
 */
export abstract class ScriptCall {
}

/**
 * Structured representation of a call into a known Move script function.
 */
export abstract class ScriptFunctionCall {
}


export class ScriptFunctionCallVariantCreateEventScript extends ScriptFunctionCall {

constructor (public price: uint64, public supply: uint64, public max_resell_times: uint64, public max_resell_price: uint64) {
  super();
}

}

export class ScriptFunctionCallVariantListForSaleScript extends ScriptFunctionCall {

constructor (public creator: DiemTypes.AccountAddress, public creation_num: uint64, public list_price: uint64, public ticket_id: uint64) {
  super();
}

}

export class ScriptFunctionCallVariantMintScript extends ScriptFunctionCall {

constructor (public mint_addr: DiemTypes.AccountAddress, public amount: uint64) {
  super();
}

}

export class ScriptFunctionCallVariantPublishBalanceScript extends ScriptFunctionCall {
constructor () {
  super();
}

}

export class ScriptFunctionCallVariantPurchaseScript extends ScriptFunctionCall {

constructor (public seller_addr: DiemTypes.AccountAddress, public creator: DiemTypes.AccountAddress, public creation_num: uint64, public ticket_id: uint64) {
  super();
}

}

export class ScriptFunctionCallVariantTransferScript extends ScriptFunctionCall {

constructor (public to: DiemTypes.AccountAddress, public amount: uint64) {
  super();
}

}

export interface TypeTagDef {
  type: Types;
  arrayType?: TypeTagDef;
  name?: string;
  moduleName?: string;
  address?: string;
  typeParams?: TypeTagDef[];
}

export interface ArgDef {
  readonly name: string;
  readonly type: TypeTagDef;
  readonly choices?: string[];
  readonly mandatory?: boolean;
}

export interface ScriptDef {
  readonly stdlibEncodeFunction: (...args: any[]) => DiemTypes.Script;
  readonly stdlibDecodeFunction: (script: DiemTypes.Script) => ScriptCall;
  readonly codeName: string;
  readonly description: string;
  readonly typeArgs: string[];
  readonly args: ArgDef[];
}

export interface ScriptFunctionDef {
  readonly stdlibEncodeFunction: (...args: any[]) => DiemTypes.TransactionPayload;
  readonly description: string;
  readonly typeArgs: string[];
  readonly args: ArgDef[];
}

export enum Types {
  Boolean,
  U8,
  U64,
  U128,
  Address,
  Array,
  Struct
}


export class Stdlib {
  private static fromHexString(hexString: string): Uint8Array { return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));}

  /**

   */
  static encodeCreateEventScriptScriptFunction(price: bigint, supply: bigint, max_resell_times: bigint, max_resell_price: bigint): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    serializer.serializeU64(price);
    const price_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(supply);
    const supply_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(max_resell_times);
    const max_resell_times_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(max_resell_price);
    const max_resell_price_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [price_serialized, supply_serialized, max_resell_times_serialized, max_resell_price_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("Tickets"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("create_event_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**

   */
  static encodeListForSaleScriptScriptFunction(creator: DiemTypes.AccountAddress, creation_num: bigint, list_price: bigint, ticket_id: bigint): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    creator.serialize(serializer);
    const creator_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(creation_num);
    const creation_num_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(list_price);
    const list_price_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(ticket_id);
    const ticket_id_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [creator_serialized, creation_num_serialized, list_price_serialized, ticket_id_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("Tickets"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("list_for_sale_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**
   * Mint `amount` tokens to `mint_addr`. Mint must be approved by the module owner.
   */
  static encodeMintScriptScriptFunction(mint_addr: DiemTypes.AccountAddress, amount: bigint): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    mint_addr.serialize(serializer);
    const mint_addr_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(amount);
    const amount_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [mint_addr_serialized, amount_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("BasicCoin"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("mint_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**

   */
  static encodePublishBalanceScriptScriptFunction(): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    const args: Seq<bytes> = [];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("BasicCoin"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("publish_balance_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**

   */
  static encodePurchaseScriptScriptFunction(seller_addr: DiemTypes.AccountAddress, creator: DiemTypes.AccountAddress, creation_num: bigint, ticket_id: bigint): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    seller_addr.serialize(serializer);
    const seller_addr_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    creator.serialize(serializer);
    const creator_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(creation_num);
    const creation_num_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(ticket_id);
    const ticket_id_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [seller_addr_serialized, creator_serialized, creation_num_serialized, ticket_id_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("Tickets"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("purchase_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  /**

   */
  static encodeTransferScriptScriptFunction(to: DiemTypes.AccountAddress, amount: bigint): DiemTypes.TransactionPayload {
    const tyArgs: Seq<DiemTypes.TypeTag> = [];
    var serializer = new BcsSerializer();
    to.serialize(serializer);
    const to_serialized: bytes = serializer.getBytes();
    var serializer = new BcsSerializer();
    serializer.serializeU64(amount);
    const amount_serialized: bytes = serializer.getBytes();
    const args: Seq<bytes> = [to_serialized, amount_serialized];
    const module_id: DiemTypes.ModuleId = new DiemTypes.ModuleId(new DiemTypes.AccountAddress([[150], [144], [120], [20], [79], [202], [25], [99], [83], [20], [237], [195], [118], [66], [114], [177]]), new DiemTypes.Identifier("BasicCoin"));
    const function_name: DiemTypes.Identifier = new DiemTypes.Identifier("transfer_script");
    const script = new DiemTypes.ScriptFunction(module_id, function_name, tyArgs, args);
    return new DiemTypes.TransactionPayloadVariantScriptFunction(script);
  }

  static decodeCreateEventScriptScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantCreateEventScript {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const price: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[1]);
      const supply: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[2]);
      const max_resell_times: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[3]);
      const max_resell_price: bigint = deserializer.deserializeU64();

      return new ScriptFunctionCallVariantCreateEventScript(
        price,
        supply,
        max_resell_times,
        max_resell_price
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodeListForSaleScriptScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantListForSaleScript {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const creator: DiemTypes.AccountAddress = DiemTypes.AccountAddress.deserialize(deserializer);

      var deserializer = new BcsDeserializer(script_fun.value.args[1]);
      const creation_num: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[2]);
      const list_price: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[3]);
      const ticket_id: bigint = deserializer.deserializeU64();

      return new ScriptFunctionCallVariantListForSaleScript(
        creator,
        creation_num,
        list_price,
        ticket_id
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodeMintScriptScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantMintScript {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const mint_addr: DiemTypes.AccountAddress = DiemTypes.AccountAddress.deserialize(deserializer);

      var deserializer = new BcsDeserializer(script_fun.value.args[1]);
      const amount: bigint = deserializer.deserializeU64();

      return new ScriptFunctionCallVariantMintScript(
        mint_addr,
        amount
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodePublishBalanceScriptScriptFunction(_script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantPublishBalanceScript {
  if (_script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      return new ScriptFunctionCallVariantPublishBalanceScript(

      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodePurchaseScriptScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantPurchaseScript {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const seller_addr: DiemTypes.AccountAddress = DiemTypes.AccountAddress.deserialize(deserializer);

      var deserializer = new BcsDeserializer(script_fun.value.args[1]);
      const creator: DiemTypes.AccountAddress = DiemTypes.AccountAddress.deserialize(deserializer);

      var deserializer = new BcsDeserializer(script_fun.value.args[2]);
      const creation_num: bigint = deserializer.deserializeU64();

      var deserializer = new BcsDeserializer(script_fun.value.args[3]);
      const ticket_id: bigint = deserializer.deserializeU64();

      return new ScriptFunctionCallVariantPurchaseScript(
        seller_addr,
        creator,
        creation_num,
        ticket_id
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static decodeTransferScriptScriptFunction(script_fun: DiemTypes.TransactionPayload): ScriptFunctionCallVariantTransferScript {
  if (script_fun instanceof DiemTypes.TransactionPayloadVariantScriptFunction) {
      var deserializer = new BcsDeserializer(script_fun.value.args[0]);
      const to: DiemTypes.AccountAddress = DiemTypes.AccountAddress.deserialize(deserializer);

      var deserializer = new BcsDeserializer(script_fun.value.args[1]);
      const amount: bigint = deserializer.deserializeU64();

      return new ScriptFunctionCallVariantTransferScript(
        to,
        amount
      );
    } else {
      throw new Error("Transaction payload not a script function payload")
    }
  }

  static ScriptArgs: {[name: string]: ScriptDef} = {
  }

  static ScriptFunctionArgs: {[name: string]: ScriptFunctionDef} = {

                CreateEventScript: {
      stdlibEncodeFunction: Stdlib.encodeCreateEventScriptScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "price", type: {type: Types.U64}}, {name: "supply", type: {type: Types.U64}}, {name: "max_resell_times", type: {type: Types.U64}}, {name: "max_resell_price", type: {type: Types.U64}}
      ]
    },
                

                ListForSaleScript: {
      stdlibEncodeFunction: Stdlib.encodeListForSaleScriptScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "creator", type: {type: Types.Address}}, {name: "creation_num", type: {type: Types.U64}}, {name: "list_price", type: {type: Types.U64}}, {name: "ticket_id", type: {type: Types.U64}}
      ]
    },
                

                MintScript: {
      stdlibEncodeFunction: Stdlib.encodeMintScriptScriptFunction,
      description: " Mint `amount` tokens to `mint_addr`. Mint must be approved by the module owner.",
      typeArgs: [],
      args: [
        {name: "mint_addr", type: {type: Types.Address}}, {name: "amount", type: {type: Types.U64}}
      ]
    },
                

                PublishBalanceScript: {
      stdlibEncodeFunction: Stdlib.encodePublishBalanceScriptScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        
      ]
    },
                

                PurchaseScript: {
      stdlibEncodeFunction: Stdlib.encodePurchaseScriptScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "seller_addr", type: {type: Types.Address}}, {name: "creator", type: {type: Types.Address}}, {name: "creation_num", type: {type: Types.U64}}, {name: "ticket_id", type: {type: Types.U64}}
      ]
    },
                

                TransferScript: {
      stdlibEncodeFunction: Stdlib.encodeTransferScriptScriptFunction,
      description: "",
      typeArgs: [],
      args: [
        {name: "to", type: {type: Types.Address}}, {name: "amount", type: {type: Types.U64}}
      ]
    },
                
  }

}


export type ScriptDecoders = {
  User: {
    default: (type: keyof ScriptDecoders['User']) => void;
  };
};
