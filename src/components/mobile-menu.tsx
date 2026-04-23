import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";

interface NavItem {
  href: string;
  label: string;
  subItems?: { href: string; label: string }[];
}

interface MobileMenuProps {
  navItems: NavItem[];
  currentPath: string;
  user: any;
  isAdmin: boolean;
}

export function MobileMenu({
  navItems,
  currentPath,
  user,
  isAdmin,
}: MobileMenuProps) {
  const isActive = (href: string, exact: boolean = false) => {
    if (href === "/") return currentPath === "/";
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 w-10 md:hidden cursor-pointer items-center justify-center rounded-xl border border-border/60 bg-background/60 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          aria-label="Open Menu"
        >
          <svg
            className="h-5 w-5 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[min(75vw,280px)] rounded-none">
        <div className="mx-auto w-full flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 pt-4 px-4 bg-muted/20">
            <DrawerTitle asChild>
              <a href="/" className="group flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Wuxia Dreams"
                  width="28"
                  height="28"
                  className="h-7 w-7 rounded-md ring-1 ring-border/70"
                  loading="eager"
                />
                <div className="leading-tight text-left">
                  <div className="text-[13px] font-semibold tracking-tight text-foreground">
                    Wuxia Dreams
                  </div>
                  <div className="text-[10px] tracking-0.1em text-muted-foreground">
                    Free novels online
                  </div>
                </div>
              </a>
            </DrawerTitle>
            <DrawerClose asChild>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Close Menu"
              >
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <form action="/novels" method="get">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    name="q"
                    placeholder="Search titles / authors"
                    className="h-10 w-full rounded-xl border border-input bg-background/60 pl-9 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-all"
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.subItems ? (
                  <div key={item.label} className="mb-2 space-y-1">
                    <div className="px-3 py-2 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                      {item.label}
                    </div>
                    <div className="flex flex-col gap-0.5 border-l-2 border-border/40 ml-3 pl-1">
                      {item.subItems.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                            isActive(sub.href, true)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          }`}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                ),
              )}

              {user ? (
                <div className="mt-4 border-t border-border/40 pt-4">
                  <div className="px-3 pb-3 mb-2 border-b border-border/40 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase ring-1 ring-primary/20">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <a
                      href="/admin/users"
                      className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Admin Dashboard
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 flex w-full items-center justify-center rounded-xl bg-destructive/10 px-4 h-10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 cursor-pointer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t border-border/40 pt-4">
                  <a
                    href="/auth/signin"
                    className="flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  >
                    Sign in
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
