# Wishlist Email Relay Setup

You can route wishlist submissions to a private email address without exposing it in frontend HTML/JS by using a backend relay endpoint.

## 1. Deploy the Worker

Use [tools/cloudflare-wishlist-relay.js](../tools/cloudflare-wishlist-relay.js) as a Cloudflare Worker.

## 2. Set Worker Secrets

Set these secrets in Cloudflare Worker settings:

- `RESEND_API_KEY`: API key from Resend
- `WISHLIST_TO_EMAIL`: destination email (for example, your private inbox)
- `WISHLIST_FROM_EMAIL`: verified sender in Resend (example: `SelNexa Wishlist <noreply@selnexahealth.com>`)
- `ALLOWED_ORIGIN`: your site origin (example: `https://www.selnexahealth.com`)

## 3. Point the Frontend to the Worker Endpoint

Edit [js/form-endpoints.js](../js/form-endpoints.js):

```js
window.SELNEXA_WISHLIST_ENDPOINT = "https://your-worker-subdomain.workers.dev";
```

Optionally route all booking submissions through the same endpoint:

```js
window.SELNEXA_SCHEDULING_ENDPOINT = "https://your-worker-subdomain.workers.dev";
```

## 4. Verify End-to-End

1. Open the Book Demo form.
2. Check the `Join the early-access wishlist` option.
3. Submit the form.
4. Confirm email arrives in the configured inbox.

## Why this keeps your email private

Visitors only see the Worker URL in network requests. The real recipient email is stored as a server-side secret and never exposed in page source.
