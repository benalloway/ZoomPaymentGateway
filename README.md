# Welcome to the Zoom Payment Gateway!
This is a POC for building a payment gateway to stand in front of a professional zoom account, to allow users to bring their own payment gateways to paywall zoom webinars, instead of being limited to the 2 options Zoom provides (stripe & Paypal). 

- List upcoming webinars for a zoom account
- Allow for payment authorization & charging for entry into webinar
- Allow for registration to webinar



## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
