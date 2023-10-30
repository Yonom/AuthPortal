import { DoctorMessage } from "@authportal/db-types/firestore/doctor";

export class DoctorReport {
  messages: Readonly<DoctorMessage>[] = [];

  addMessage(message: DoctorMessage) {
    this.messages.push(Object.freeze(message));
    return this;
  }

  concat(report: DoctorReport) {
    this.messages = this.messages.concat(report.messages);
    return this;
  }

  freeze() {
    Object.freeze(this.messages);
    Object.freeze(this);

    return this;
  }

  static fromMessage(message: DoctorMessage) {
    return new DoctorReport().addMessage(message).freeze();
  }

  static EMPTY = new DoctorReport().freeze();
}
