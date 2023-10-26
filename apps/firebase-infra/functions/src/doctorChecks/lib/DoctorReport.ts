type DoctorMessage =
  | {
      type:
        | "config/missing"
        | "config/malformed"
        | "config/invalid-api-key"
        | "config/auth-not-enabled"
        | "provider/none-configured"
        | "domain/none-configured"
        | "client/none-configured";
    }
  | {
      type: "internal-error";
      message: string;
      stack?: string;
    }
  | {
      type: "provider/not-enabled";
      provider_id: string;
    }
  | {
      type:
        | "domain/not-whitelisted-for-oauth"
        | "domain/helper-domain-mismatch";
      domain: string;
    }
  | {
      type: "provider/redirect-uri-not-whitelisted";
      domain: string;
      helper_domain: string;
      provider_id: string;
    }
  | {
      type: "client/no-redirect-uris";
      client_id: string;
    };

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
