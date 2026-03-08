import { useLocation } from "react-router-dom"

interface PlaceholderPageProps {
    title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
    const location = useLocation()

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{location.pathname}</p>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">Content for <span className="font-semibold text-foreground">{title}</span> will go here.</p>
            </div>
        </div>
    )
}
