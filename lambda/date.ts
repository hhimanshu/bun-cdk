export default {
    async handler(request: Request): Promise<Response | undefined> {
        console.log(JSON.stringify(request));
        const localeTime = new Date().toLocaleTimeString();
        const response = JSON.stringify({ time: localeTime });
        return new Response(response, {
            status: 200,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            }
        })
    },
  }