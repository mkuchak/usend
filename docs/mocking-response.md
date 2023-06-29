---
outline: deep
---

<script setup>
import { nanoid } from "nanoid";
import { useStorage } from '@vueuse/core'

const domain = useStorage('domain', null);
</script>

# Mocking Response

Although there is no specific API test or dummy endpoint available to run a sandbox testing environment without sending real emails, you can still utilize libraries to mock HTTP calls. One recommended library for this purpose in Node.js is [Nock](https://www.npmjs.com/package/nock). With Nock, you can intercept HTTP requests and mock their responses, allowing you to simulate API behavior and test your code without actually making real requests. This can be particularly useful when developing and testing integrations with APIs like Usend.

## Why Nock?

It provides a straightforward and flexible API for defining mock endpoints and controlling the behavior of the mock server. With it, you can simulate API responses and test your code without relying on a live API or sending actual requests. Fell free to choose any other library that suits your needs.

## Setting Up Mocking Response

To mock the response of the Usend API endpoint `https://api.usend.email/send` using the `POST` method, you can refer to the code snippet below. The following example code showcases a test scenario where we mock the Usend API response for the `signInUseCase` function, allowing you to simulate the API call and verify the expected behavior.

```ts-vue{29-30,32-35,43-45}
import nock from "nock";
import { Usend } from "usend-email";

async function signInUseCase(input: { email: string }): Promise<void> {
  const accessCode = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
    .replace(/(\d{3})(\d{3})/, "$1-$2"); // E.g. 123-456

  // Store the access code in the database
  // ...

  const usend = new Usend();

  await usend.sendEmail({
    from: "noreply@{{ domain || "example.com" }}",
    to: input.email,
    subject: "Your access code has arrived!",
    text: `Your access code is ${accessCode}, please use it to login.`,
  });
}

// Disable all real network connections and then enable them after the test
beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

describe("Usend API Test", () => {
  it("should mock Usend API response", async () => {
    // Declare a variable to store the payload that was sent to Usend API
    let payload = "";

    // Mock the Usend API response and prepare to store the payload
    nock("https://api.usend.email")
      .post("/send", (body: string) => ((payload = body), true))
      .reply(202);

    // Fake user email
    const input = { email: "fake-user@example.com" };

    // Run the use case
    await signInUseCase(input);

    // Check the payload that was sent to Usend API and extract the access code
    const accessCode =
      JSON.parse(payload).content[0].value.match(/\d{3}-\d{3}/)[0];

    // Compare the access code with the expected value to make sure it works
    expect(accessCode).toBeTypeOf("string");
    expect(accessCode).toHaveLength(7);
  });
});
```

### Explanation

The code provided demonstrates a test scenario for the `signInUseCase` function. Within the test, we mock the Usend API response using `nock`. The `nock` library intercepts the API request and replies with a mock response. By capturing the payload sent to the Usend API, we can extract and validate the access code. This allows us to simulate the Usend API behavior and ensure the expected functionality of the code under test.

By leveraging the ability to mock the Usend API response, you can confidently test your code in isolation, ensuring that it behaves as expected in various scenarios without relying on a live API or making actual network requests.

### Custom Vendor

If you are utilizing a custom vendor, you have the flexibility to mock the response of your custom vendor API endpoint. Simply replace the URL with your own `vendorUrl`, for example, `https://usend-vendor.xxxxx.workers.dev/send`. This allows you to simulate the behavior of your custom vendor and test your integration with Usend accordingly.
