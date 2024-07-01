const mockMessages = [
  {
    value: JSON.stringify([
      {
        customerId: 1,
        orderId: 1,
        id: 1,
        name: "Product 1",
        details: "Details 1",
        stock: 10,
      },
      {
        customerId: 1,
        orderId: 1,
        id: 2,
        name: "Product 2",
        details: "Details 2",
        stock: 5,
      },
    ]),
  },
];

export const consumeMessages = jest.fn().mockResolvedValue(mockMessages);
