"use client";

import { motion } from "framer-motion";

export default function WikiPack() {
  return (
    <div
      className="fixed inset-0 bg-[#080808] flex flex-col items-center justify-center"
      style={{ bottom: "57px" }}>
      <img src="/pack.png" alt="WikiPack" className="w-52 object-contain" />
    </div>
  );
}
