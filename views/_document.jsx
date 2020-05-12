import React from "react";
import { Document, Head, Main } from "@react-ssr/express";

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <title>KAGGLE</title>
        </Head>
        <body>
          <Main />
        </body>
      </html>
    );
  }
}
