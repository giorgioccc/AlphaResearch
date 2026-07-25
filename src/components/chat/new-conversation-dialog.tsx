'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Building2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Company {
  id: string;
  ticker: string;
  name: string;
  sector: string | null;
  exchange: string;
}

interface NewConversationDialogProps {
  onCreated: () => void;
}

export function NewConversationDialog({
  onCreated,
}: NewConversationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const searchCompanies = useCallback(async (q: string) => {
    if (q.length < 1) {
      setCompanies([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/companies?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        setCompanies((await res.json()) as Company[]);
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => searchCompanies(query), 300);
    return () => clearTimeout(timeout);
  }, [query, searchCompanies]);

  function handleReset() {
    setQuery('');
    setCompanies([]);
    setSelectedCompany(null);
    setIsCreating(false);
  }

  async function handleCreate() {
    setIsCreating(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany?.id,
        }),
      });

      if (res.ok) {
        const conversation = (await res.json()) as { id: string };
        setOpen(false);
        handleReset();
        onCreated();
        router.push(`/chat/${conversation.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) handleReset();
      }}
    >
      <DialogTrigger
        render={<Button variant="ghost" size="icon" className="size-7" />}
      >
        <Plus className="size-4" />
        <span className="sr-only">New conversation</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
          <DialogDescription>
            Start a general conversation or select a company for focused
            research.
          </DialogDescription>
        </DialogHeader>

        {selectedCompany ? (
          <div className="bg-muted flex items-center gap-3 rounded-lg px-3 py-2">
            <Building2 className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {selectedCompany.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {selectedCompany.ticker} · {selectedCompany.exchange}
                {selectedCompany.sector && ` · ${selectedCompany.sector}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setSelectedCompany(null)}
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <Command shouldFilter={false} className="rounded-lg border">
            <CommandInput
              placeholder="Search companies by name or ticker..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {query.length > 0 && !isSearching && companies.length === 0 && (
                <CommandEmpty>No companies found.</CommandEmpty>
              )}
              {companies.length > 0 && (
                <CommandGroup heading="Companies">
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.id}
                      onSelect={() => {
                        setSelectedCompany(company);
                        setQuery('');
                        setCompanies([]);
                      }}
                    >
                      <Search className="text-muted-foreground size-4" />
                      <span className="font-medium">{company.ticker}</span>
                      <span className="text-muted-foreground">
                        {company.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        )}

        <DialogFooter>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating
              ? 'Creating...'
              : selectedCompany
                ? `Start research on ${selectedCompany.ticker}`
                : 'Start general conversation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
