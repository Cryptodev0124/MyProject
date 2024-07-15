import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import MyProject from "../wrappers/MyProject"; // this is the interface class we just implemented

export async function run() {
  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open Counter instance by address
  const counterAddress = Address.parse("EQCS1AkMHYrelr5IgEctn3G1KLBXyCU-6A-UKbCibNzLuTC3"); // replace with your address from step 8
  const counter = new MyProject(counterAddress);
  const counterContract = client.open(counter);

  // call the getter on chain
  const counterValue = await counterContract.getCounter();
  console.log("value:", counterValue.toString());
}
