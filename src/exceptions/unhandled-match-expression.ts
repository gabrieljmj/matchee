export class UnhandledMatchExpression extends Error {
  constructor(value: unknown) {
    super(
      `No matching expression found for value ${value}. Maybe try adding a default value.`,
    );

    this.name = 'UnhandledMatchExpression';
  }
}
