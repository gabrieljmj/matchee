export class UnhandledMatchExpression extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(value: any) {
    super(
      `No matching expression found for value ${value}. Maybe try adding a default value.`,
    );
  }
}
