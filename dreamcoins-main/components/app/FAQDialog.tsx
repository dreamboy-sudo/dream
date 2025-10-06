import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PRIVACY_POLICY_URL, TELEGRAM_URL, TERMS_OF_SERVICE_URL, TWITTER_URL, WOW_URL } from "@/lib/constants";
import { GlowPanel } from "../GlowPanel";
import { ExternalLink } from "../ui/ExternalLink";

export function FAQDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-0">
        <GlowPanel className="max-sm:rounded-none">
          <div className="flex flex-col max-h-[100svh] sm:max-h-[70vh] overflow-auto max-sm:py-10 px-6 sm:p-8 text-white">
            <p className="mt-3 text-sm">
              Dreamcoins is a token launcher built on
              Zora&apos;s{" "}
              <ExternalLink href={WOW_URL}>WOW protocol</ExternalLink>.
            </p>

            <p className="text-white/80 text-sm mt-4">
              <ExternalLink href={TWITTER_URL}>Twitter</ExternalLink> •{" "}
              <ExternalLink href={TELEGRAM_URL}>Telegram</ExternalLink> •{" "}
              <ExternalLink href={TERMS_OF_SERVICE_URL}>Terms</ExternalLink> •{" "}
              <ExternalLink href={PRIVACY_POLICY_URL}>Privacy</ExternalLink>
            </p>

            <div className="space-y-5 mt-6 pt-6 border-t border-white/30">
              <h2 className="text-lg font-bold text-white">
                Frequently Asked Questions
              </h2>
              {[
                {
                  q: "How does this work?",
                  a: "We turn your dreams into tradable pixels. Dreamcoins is a token launcher built on Zora's WOW protocol, with $dream as its native token.",
                },
                {
                  q: "Do you have a token for your project?",
                  a: "We only have one official token, called [$DREAM](https://basescan.org/address/0x98d59767cd1335071a4e9b9d3482685c915131e8).",
                },
                {
                  q: "How are creator fees used?",
                  a: "Following Zora's protocol creator fee, Dreamcoins earn 0.65% by default from each trade on which is directed toward buying and burning $DREAM. Buying and burning will occur periodically. We have plans to automate this process and do it daily in the future. If you enable creator fees when creating your token, you will earn 0.5% of each trade, and 0.15% will be directed toward buying and burning $DREAM.",
                },
                {
                  q: "Can I get creator fees for my token?",
                  a: "Yes, you can enable creator fees when creating your token using Custom Create. If you do, you will earn 0.5% of each trade, and 0.15% will be directed toward buying and burning $DREAM.",
                },
                {
                  q: "Who is Dreamboy?",
                  a: "Dreamboy is our token launching AI agent. You can find him on [X](https://x.com/dreamboybot)."
                },
                {
                  q: "What does Dreamboy do?",
                  a: "Dreamboy can answer questions, banter, and launch tokens for you from Twitter or Farcaster."
                },
                {
                  q: "Who is Dreamgirl?",
                  a: "Dreamgirl is the agentic Creative Director of Dream. You can find her on [X](https://x.com/dreamgirl_agent)."
                },
                {
                  q: "What does Dreamgirl do?",
                  a: "Dreamgirl will talk about the larger aesthetics of the project, and can also communicate with Dreamboy."
                },
                {
                  q: "Does Dreamgirl have a token?",
                  a: "No, she doesn't have an official token."
                },
                {
                  q: "Where can I see how much $DREAM has been bought and burned?",
                  a: "You can see the amount bought and burned on the [token page](https://basescan.org/advanced-filter?fadd=0x98d59767cd1335071a4e9b9d3482685c915131e8&tadd=0x98d59767cd1335071a4e9b9d3482685c915131e8&mtd=0x42966c68%7eBurn).",
                },
                {
                  q: "Which blockchain is this on?",
                  a: "Base.",
                },
                {
                  q: "Are you affiliated with Zora or Wow?",
                  a: "No, we are not affiliated with Zora or Wow. We use the WOW protocol to launch tokens.",
                },
              ].map((faq, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-white text-sm font-semibold">{faq.q}</h3>
                  <p className="text-white text-sm">
                    {faq.a.split(/(\[.*?\]\(.*?\))/).map((part, j) => {
                      const match = part.match(/\[(.*?)\]\((.*?)\)/);
                      if (match) {
                        return (
                          <ExternalLink key={j} href={match[2]}>
                            {match[1]}
                          </ExternalLink>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
              ))}
            </div>

        
            <div className="mt-6 text-white/50 text-sm">
              Built with ❤️ by the Dreams team
            </div>
          </div>
        </GlowPanel>
      </DialogContent>
    </Dialog>
  );
}
