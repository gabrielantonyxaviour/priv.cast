"use client";
import Head from "next/head";
import ComposerAction from "@/components/Composer";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>priv.cast | Home</title>
      </Head>
      <main style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="max-w-[800px] mx-auto h-screen ">
          <ComposerAction />
        </div>
      </main>
    </>
  );
}