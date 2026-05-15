import { Model } from "@nozbe/watermelondb";

export class Visitation extends Model {
  static table = "visitation_logs";

  get visitDate(): Date {
    const rawValue = this.asModel._getRaw("visit_date");
    return new Date(rawValue as number);
  }
  set visitDate(date: Date) {
    const rawValue = date.getTime();
    this.asModel._setRaw("visit_date", rawValue);
  }

  get createdAt(): Date {
    const rawValue = this.asModel._getRaw("created_at");
    return new Date(rawValue as number);
  }
  set createdAt(date: Date) {
    const rawValue = date.getTime();
    this.asModel._setRaw("created_at", rawValue);
  }
}
