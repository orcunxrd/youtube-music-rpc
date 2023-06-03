import setRpc from "./setRpc.js";
import { convertSeconds } from "../helpers/index.js";

export default async (data) => {
  console.log(data);
  
  if (!global.initialize) {
    await setRpc(data);
    global.initialize = true;
  }
  
  global.rpcSettings.state = `Listening to Music (${convertSeconds(data.now)} / ${convertSeconds(data.max)})`;
  global.rpc.setActivity(global.rpcSettings);
};