# faro-nextThis is a [Next.js](https://nextjs.org/) application bootstrapped using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started with Faro-Next

To run the development server, please following instructions: 
### NOTE USE ONLY YARN DON'T USE NPM OR PNPM

```bash
yarn dev


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running localhost in HTTPS to get thru MAGIC AUTH
1. Follow the instructions from here to install mkcert and installting localcert 
https://www.makeswift.com/blog/accessing-your-local-nextjs-dev-server-using-https
# NOTE: Do the install from root directory in separate terminal. Also, do sudo npm install -g local-sll-proxy
2. After install run this command from terminal:
npx local-ssl-proxy --key localhost-key.pem --cert localhost.pem --source 3001 --target 3000
3. Now you can run the site in https in port 3001. it will be proxied to 3000


You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. 


## Prod URLs
US - https://store.faro.xyz/store/farostorefront
JP - https://jp.faro.xyz/store/aruarucitypassport
DEV - https://store-dev.faro.xyz/store/farostorefront

