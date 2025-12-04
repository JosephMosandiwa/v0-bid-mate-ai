"use client"

import { useState } from "react"
import { Plus, FileSpreadsheet, Calculator, TrendingUp, Trash2, Edit2, Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface BOQItem {
  id: string
  description: string
  unit: string
  quantity: number
  rate: number
  amount: number
  aiSuggested?: number
}

interface BOQ {
  id: string
  name: string
  tender_id?: string
  items: BOQItem[]
  total: number
  status: "draft" | "submitted" | "won" | "lost"
  created_at: string
  tenders?: { title: string; reference_number: string }
}

interface BOQPageClientProps {
  initialBoqs: BOQ[]
  userId: string
}

export function BOQPageClient({ initialBoqs, userId }: BOQPageClientProps) {
  const [boqs, setBoqs] = useState<BOQ[]>(initialBoqs)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedBoq, setSelectedBoq] = useState<BOQ | null>(null)
  const [newBoqName, setNewBoqName] = useState("")
  const [editingItems, setEditingItems] = useState<BOQItem[]>([
    { id: "1", description: "", unit: "each", quantity: 1, rate: 0, amount: 0 },
  ])

  const addItem = () => {
    setEditingItems([
      ...editingItems,
      { id: Date.now().toString(), description: "", unit: "each", quantity: 1, rate: 0, amount: 0 },
    ])
  }

  const updateItem = (id: string, field: keyof BOQItem, value: string | number) => {
    setEditingItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = Number(updated.quantity) * Number(updated.rate)
          }
          return updated
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setEditingItems((items) => items.filter((item) => item.id !== id))
  }

  const getAISuggestion = async (itemId: string, description: string) => {
    // Mock AI pricing suggestion
    const suggestedRate = Math.floor(Math.random() * 5000) + 500
    setEditingItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, aiSuggested: suggestedRate }
        }
        return item
      }),
    )
    toast.success(`AI suggests R${suggestedRate.toLocaleString()} based on market rates`)
  }

  const calculateTotal = () => {
    return editingItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "submitted":
        return "default"
      case "won":
        return "default"
      case "lost":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Bill of Quantities</h1>
          <p className="text-muted-foreground">Create and manage BOQs with AI-powered pricing suggestions</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New BOQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Bill of Quantities</DialogTitle>
              <DialogDescription>Add line items and get AI-powered pricing suggestions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="boqName">BOQ Name</Label>
                <Input
                  id="boqName"
                  value={newBoqName}
                  onChange={(e) => setNewBoqName(e.target.value)}
                  placeholder="e.g., Cleaning Services Q1 2025"
                  className="mt-1"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate (R)</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            placeholder="Item description"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                            className="h-8 w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                            className="h-8 w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                              className="h-8 w-24"
                            />
                            {item.description && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => getAISuggestion(item.id, item.description)}
                                className="h-8 w-8 p-0"
                                title="Get AI pricing suggestion"
                              >
                                <Sparkles className="w-4 h-4 text-primary" />
                              </Button>
                            )}
                          </div>
                          {item.aiSuggested && (
                            <p className="text-xs text-muted-foreground mt-1">
                              AI: R{item.aiSuggested.toLocaleString()}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.amount)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={addItem} className="gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total (excl. VAT)</p>
                  <p className="text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("BOQ saved successfully")
                  setIsCreating(false)
                }}
              >
                Save BOQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total BOQs</p>
              <p className="text-2xl font-bold">{boqs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(boqs.reduce((sum, boq) => sum + (boq.total || 0), 0))}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Win Rate</p>
              <p className="text-2xl font-bold">
                {boqs.filter((b) => b.status === "won").length > 0
                  ? Math.round(
                      (boqs.filter((b) => b.status === "won").length /
                        boqs.filter((b) => ["won", "lost"].includes(b.status)).length) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOQ List */}
      {boqs.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold mb-2">No BOQs yet</h3>
            <p className="text-muted-foreground mb-4">Create your first Bill of Quantities to start pricing tenders</p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create BOQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Your BOQs</CardTitle>
            <CardDescription>Manage and track your pricing documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Linked Tender</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boqs.map((boq) => (
                  <TableRow key={boq.id}>
                    <TableCell className="font-medium">{boq.name}</TableCell>
                    <TableCell>
                      {boq.tenders ? (
                        <span className="text-sm">{boq.tenders.reference_number}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not linked</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(boq.total || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(boq.status)}>{boq.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(boq.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
