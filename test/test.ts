function add(a: number, b: number): number {
  return a + b;
}
// Test the add function
test("add function should return the sum of two numbers", () => {
  // Arrange
  const a = 5;
  const b = 10;

  // Act
  const result = add(a, b);

  // Assert
  expect(result).toBe(15);
});
