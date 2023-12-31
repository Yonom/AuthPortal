"use client";

import {
  DoctorMessage,
  FirestoreDoctorReportDocument,
} from "@authportal/db-types/firestore/doctor";

export const withDoctorReport = <T extends DoctorMessage["type"]>(
  messageType: T,
  ErrorComponent: React.FC<{
    message: DoctorMessage & { type: T };
  }>,
): React.FC<{ report: FirestoreDoctorReportDocument | null | undefined }> => {
  return function WrappedComponent({ report }) {
    // Find the error message of the specified type in the report.
    const message = report?.messages.find((msg) => msg.type === messageType);

    // If an error message of the specified type is found, display the ErrorComponent.
    if (message) {
      return (
        <ErrorComponent message={message as DoctorMessage & { type: T }} />
      );
    }

    return null;
  };
};
