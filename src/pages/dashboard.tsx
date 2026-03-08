import { LayoutDashboard } from "lucide-react"

export function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome to the School Management System</p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Students", value: "15.00K", color: "from-violet-500 to-purple-500" },
                    { label: "Teachers", value: "2.00K", color: "from-blue-500 to-cyan-500" },
                    { label: "Parents", value: "5.6K", color: "from-pink-500 to-rose-500" },
                    { label: "Earnings", value: "$19.3K", color: "from-amber-500 to-orange-500" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className={`h-11 w-11 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty content area */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Dashboard content will go here.</p>
            </div>
        </div>
    )
}
