import { parseTokenAddress } from "../tokens/web3"

const hash = process.env.TEST_TX_HASH || "0xa4dbc3f497fa98d70baf781f74b7a8bbd76ec8e309071fc5817d471ec195d148"

const address = await parseTokenAddress(hash)
console.log("token address:", address)
