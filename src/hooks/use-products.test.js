/**
 * ========================== Hello there! ==========================
 * => You have to test the `useProducts` in 3 cases:-
 *    1- The initial state where no fetch is triggered
 *    2- The successful state where the data has returned
 *    3- The error state where the error has returned
 *
 * => Hint: you will have to use the msw to complete this test,
 *          and you can override a successful response with an error response using the following code,
 *          this will allow you to test the error case. (place it inside the `it` scope in the error case testing)
 *          server.use(
 *            http.get("http://localhost:7700/v1/products", () => {
 *              return HttpResponse.json({ message: "Fetch error" });
 *            })
 *          );
 *
 * => Successful response shape:
 *    { data: [{ id: "1", name: "product 1", price: 100 }] }
 * => Error response shape:
 *    { message: "Fetch error" }
 *
 * ========================== Good luck ^-^ ==========================
 */

import { renderHook, act } from "@testing-library/react-hooks";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import useProducts from "./use-products";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

describe("useProducts", () => {
  const mockedREsponse = {
    data: [{ id: "1", name: "product 1", price: 100 }],
  };
  const server = setupServer(
    http.get("http://localhost:7700/v1/products", () => {
      return HttpResponse.json(mockedREsponse);
    })
  );

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it("The initial state where no fetch is triggered", () => {
    const { result } = renderHook(() => useProducts());
    const { loading, error, products } = result.current;

    expect(error).toBe(null);
    expect(loading).toBe(false);
    expect(products).toBe(null);
  });

  it("The successful state where the data has returned", async () => {
    const { result } = renderHook(() => useProducts());
    const { startFetching } = result.current;

    await act(async () => {
      startFetching();
    });

    const { loading, error, products } = result.current;

    expect(error).toBe(null);
    expect(loading).toBe(false);
    expect(products).toEqual(mockedREsponse);
  });

  it("The error state where the error has returned", async () => {
    server.use(
      http.get("http://localhost:7700/v1/products", () => {
        return HttpResponse.json({ message: "Fetch error" });
      })
    );
  
    const { result } = renderHook(() => useProducts());
    const { startFetching } = result.current;
  
    await act(async () => {
      startFetching();
    });
  
  
    const { loading, error, products } = result.current;
  
    expect(error).toBe("Fetch error"); 
    expect(loading).toBe(false);
    expect(products).toBe(null);
  });
  
});
