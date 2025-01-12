import { http, HttpResponse } from "msw";

export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get("http://localhost:7700/v1/products", () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      data: [{ id: "1", name: "product 1", price: 100 }],
    });
  }),
];
