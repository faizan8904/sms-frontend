import { classes } from "@/db/class_db"
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react"

export function ClassPage() {
    return (
        <div className="flex flex-col gap-6 p-1 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-violet-600">
                        <BookOpen className="w-6 h-6" />
                        Classes
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage academic classes (1 to 10)</p>
                </div>
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 shadow-sm">
                    <Plus className="w-4 h-4" />
                    New Class
                </button>
            </div>

            <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                        <tr>
                            <th className="px-6 py-4 font-bold">ID</th>
                            <th className="px-6 py-4 font-bold">Class Name</th>
                            <th className="px-6 py-4 font-bold text-center">Order Rank</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {classes.map((c) => (
                            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{c.id}</td>
                                <td className="px-6 py-4 font-bold text-foreground">{c.name}</td>
                                <td className="px-6 py-4 text-center">{c.order}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-muted-foreground hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all border border-transparent hover:border-violet-100"><Edit className="w-4 h-4" /></button>
                                        <button className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
