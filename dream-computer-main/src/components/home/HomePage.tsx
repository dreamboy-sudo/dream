import { AnimatePresence, motion } from "motion/react";
import Background from "../computer/Background";
import { Wordmark } from "./Wordmark";
import Link from "next/link";
import { AgentsButton } from "./AgentsButton";
import { TokenLauncherButton } from "./TokenLauncherButton";
import { DreamKitButton } from "./DreamKitButton";
import { AgentLauncherButton } from "./AgentLauncherButton";
import { FundButton } from "./FundButton";
import { ChainButton } from "./ChainButton";
import { ExternalLink } from "../ExternalLink";
import { DREAM_UNISWAP_URL } from "@/lib/constants";
import Image from "next/image";

export function HomePage() {
  return (
    <>
      {/* Initial reveal stuff */}
      <AnimatePresence>
        <motion.div
          key="top"
          initial={{ y: 0 }}
          animate={{ y: -1000, transition: { delay: 0.05, duration: 0.65, ease: "linear" } }}
          exit={{ y: 0 }}
          className="fixed left-0 top-0 right-0 bottom-1/2 bg-black z-40"
          style={{ willChange: "transform" }}
        ></motion.div>
      </AnimatePresence>
      <AnimatePresence>
        <motion.div
          key="bottom"
          initial={{ y: 0 }}
          animate={{ y: 1000, transition: { delay: 0.05, duration: 0.65, ease: "linear" } }}
          exit={{ y: 0 }}
          className="fixed top-1/2 left-0 right-0 bottom-0 bg-black z-40"
          style={{ willChange: "transform" }}
        ></motion.div>
      </AnimatePresence>

      {/* Sky background */}
      <div
        className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden bg-center bg-cover bg-no-repeat z-10"
        style={{
          backgroundImage: 'url("/images/sky-bg.jpg")',
        }}
      />

      {/* Animated background */}
      <Background className="fixed inset-x-3 bottom-3 top-15 rounded-[36px] pointer-events-none overflow-hidden mix-blend-multiply z-10" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.5 } }}
          exit={{ opacity: 0, y: 10 }}
          className="flex flex-col items-center w-full max-md:pt-12 py-20 z-10"
        >
          <Wordmark className="max-md:w-[300px]" />
          <p className="mt-4 md:mt-8 font-garamond font-light text-center text-3xl md:text-6xl shrink-0 px-8 md:px-20">
            The first AI owned & operated company
          </p>
          <div className="mt-8 md:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-10 md:gap-y-5 max-w-4/5 md:max-w-3/5 lg:max-w-[800px]">
            <Link href="/agents" className="rounded-full">
              <AgentsButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
            <Link href="/dreamcoins" className="rounded-full">
              <TokenLauncherButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
            <Link href="/dreamkit" className="rounded-full">
              <DreamKitButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
            <Link href="/launchpad" className="rounded-full">
              <AgentLauncherButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
            <Link href="/fund" className="rounded-full">
              <FundButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
            <Link href="/chain" className="rounded-full">
              <ChainButton className="drop-shadow-pill rounded-full max-md:w-[150px] max-md:h-[150px]" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
          exit={{ opacity: 0 }}
          className="fixed lg:absolute max-lg:bottom-6 max-lg:right-6 lg:top-6 lg:right-8 z-10"
        >
          <ExternalLink href={DREAM_UNISWAP_URL}>
            <Image priority alt="buy dream" src="/images/home-buy-dream.png" width={149} height={50} />
          </ExternalLink>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
