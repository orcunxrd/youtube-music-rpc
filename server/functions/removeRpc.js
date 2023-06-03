export default async () => {
  console.log('Removing RPC...');
  global.rpc.clearActivity();  
}