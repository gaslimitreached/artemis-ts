import {Abi} from "viem";

async function toAbi(path: string): Promise<Abi> {
  return JSON.parse(await Bun.file(path).text()) as Abi
}

export { toAbi };
