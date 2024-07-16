export class DateValuesObject {
    private date: Date;
  
    constructor(date?: Date | string) {
      if (typeof date === 'string') {
        this.date = new Date(date);
      } else if (date instanceof Date) {
        this.date = date;
      } else {
        this.date = new Date();
      }
    }
  
    toDate(): Date {
      return this.date;
    }
  
    toISOString(): string {
      return this.date.toISOString();
    }
  }
  