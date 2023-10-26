"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorReport = void 0;
class DoctorReport {
    constructor() {
        this.messages = [];
    }
    addMessage(message) {
        this.messages.push(Object.freeze(message));
        return this;
    }
    concat(report) {
        this.messages = this.messages.concat(report.messages);
        return this;
    }
    freeze() {
        Object.freeze(this.messages);
        Object.freeze(this);
        return this;
    }
    static fromMessage(message) {
        return new DoctorReport().addMessage(message).freeze();
    }
}
exports.DoctorReport = DoctorReport;
DoctorReport.EMPTY = new DoctorReport().freeze();
//# sourceMappingURL=DoctorReport.js.map