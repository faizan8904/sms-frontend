import { Bell, ChevronDown, Menu } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface TopbarProps {
    onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 gap-4">
            {/* Hamburger */}
            <button
                onClick={onMenuClick}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Toggle sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">3</span>
                </button>

                {/* User avatar */}
                <button className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                        A
                    </div>
                    <div className="hidden md:flex flex-col items-start text-sm">
                        <span className="font-medium leading-none">Admin</span>
                        <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                    <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
                </button>
            </div>
        </header>
    )
}
