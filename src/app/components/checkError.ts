type error = {
  error: string;
};

export function isErrorResponse(response: any): response is error {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof response.error === "string"
  );
}
