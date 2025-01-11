export const handler = async (event: any) => {
    console.log("Event: ", event);
    return { statusCode: 200, body: "Hello from Lambda written in TypeScript!" };
  };