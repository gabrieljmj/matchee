export class UnhandledMatchExpression extends Error {
  constructor(value: any) {
    super(
      `No matching expression found for value ${value}. Maybe try adding a default value.`
    );
  }
}
