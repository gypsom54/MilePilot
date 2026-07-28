import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSensitiveHeaderName,
  redactHeaders,
  redactPayload,
} from "../../../services/crawl/dist/index.js";

describe("Crawl Intelligence redaction", () => {
  it("redacts sensitive headers", () => {
    const redacted = redactHeaders({
      Authorization: "Bearer secret",
      Cookie: "session=abc",
      "Set-Cookie": "token=xyz",
      "Content-Type": "text/html",
    });
    assert.equal(redacted.Authorization, "[REDACTED]");
    assert.equal(redacted.Cookie, "[REDACTED]");
    assert.equal(redacted["Set-Cookie"], "[REDACTED]");
    assert.equal(redacted["Content-Type"], "text/html");
  });

  it("redacts nested sensitive payload keys and confidential bodies", () => {
    const redacted = redactPayload({
      statusCode: 200,
      headers: { authorization: "secret", accept: "text/html" },
      password: "p@ss",
      apiKey: "key",
      sessionToken: "tok",
      formValues: { email: "a@b.c" },
      responseBody: "<html>secret</html>",
      title: "Home",
    });
    assert.equal(redacted.password, "[REDACTED]");
    assert.equal(redacted.apiKey, "[REDACTED]");
    assert.equal(redacted.sessionToken, "[REDACTED]");
    assert.equal(redacted.formValues, "[REDACTED]");
    assert.equal(redacted.responseBody, "[REDACTED]");
    assert.equal(redacted.title, "Home");
    assert.equal(redacted.headers.authorization, "[REDACTED]");
    assert.equal(redacted.headers.accept, "text/html");
  });

  it("identifies sensitive header names", () => {
    assert.equal(isSensitiveHeaderName("Authorization"), true);
    assert.equal(isSensitiveHeaderName("content-type"), false);
  });
});
