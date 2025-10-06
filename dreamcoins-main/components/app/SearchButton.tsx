import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchDreams } from "@/hooks/searchDreams";
import { Search } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { DreamCard } from "./DreamCard";
import { GlowPanel } from "../GlowPanel";
import { GlowButton } from "../GlowButton";
import { Button } from "../ui/button";

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { dreams, isLoading, search, hasMore, loadMore, reset } = useSearchDreams();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open) {
      setSearchInput("");
      reset();
    }
  }, [open, reset]);

  const debouncedSearch = useCallback((value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      search(value);
    }, 300);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <>
      <GlowButton
        onClick={() => setOpen(true)}
        contentClassName="flex items-center gap-2"
      >
        <span className="hidden md:block text-white/80">SEARCH</span>
        <Search className="w-4 h-4" />
      </GlowButton>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex flex-col gap-4 bg-transparent border-none p-0 sm:max-w-[600px] focus-visible:outline-none focus-visible:ring-0">
          <GlowPanel className="max-sm:rounded-none">
            <div className="relative flex flex-col gap-4 h-[100svh] sm:max-h-[80vh] sm:h-fit overflow-y-auto max-sm:py-10 p-6">
              <p className="mt-3 text-sm text-center text-white uppercase">
                Search Dreamcoins
              </p>

              <Input
                placeholder="Search by address, name, or ticker..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              />

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4 text-white/60">Loading...</div>
                ) : dreams.length === 0 ? (
                  <div className="text-center py-4 text-white/60">
                    {searchInput ? "No dreamcoins found" : ""}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      {dreams.map((dream) => (
                        <DreamCard key={dream.id} dream={dream} />
                      ))}
                    </div>

                    {hasMore && (
                      <Button
                        variant="outline"
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                        onClick={() => loadMore()}
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </GlowPanel>
        </DialogContent>
      </Dialog>
    </>
  );
}
