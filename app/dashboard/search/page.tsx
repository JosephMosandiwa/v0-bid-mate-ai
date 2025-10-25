"use client"

import type React from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addTenderToUser } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

interface Tender {
  id: string
  title: string
  organization?: string
  source_name?: string
  publishDate?: string
  publish_date?: string
  closeDate?: string
  close_date?: string
  value?: string
  estimated_value?: string
  category: string
  description: string
  url?: string
  tender_url?: string
  source_level?: string
  source_province?: string
  document_count?: number // Added document_count field
  documents?: Array<{
    id?: string
    title: string
    url: string
    documentType?: string
    format?: string
    description?: string
  }>
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [tenders, setTenders] = useState<Tender[]>([])
  const [aiResponse, setAiResponse] = useState("")
  const [error, setError] = useState("")
  const [searchMode, setSearchMode] = useState<"basic" | "ai">("basic")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [provinceFilter, setProvinceFilter] = useState<string>("all")
  const { toast } = useToast()
  const [addingTender, setAddingTender] = useState<string | null>(null)

  useEffect(() => {
    loadAllTenders()
  }, [])

  const loadAllTenders = async () => {
    setSearching(true)
    setError("")

    try {
      const params = new URLSearchParams({
        q: "", // Empty query to get all tenders
        limit: "50",
      })

      console.log("[v0] Loading all tenders")

      const response = await fetch(`/api/tenders/search?${params.toString()}`)

      console.log("[v0] Load all tenders response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Load all tenders error response:", errorData)
        throw new Error(errorData.details || "Failed to load tenders")
      }

      const results = await response.json()
      console.log("[v0] Load all tenders results:", results)

      if (results.total === 0) {
        setError("No tenders available yet. The database may need to be populated with scraped tenders.")
      }

      setTenders(results.tenders || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load tenders. Please try again."
      setError(errorMessage)
      console.error("[v0] Load all tenders error:", err)
    } finally {
      setSearching(false)
    }
  }

  const handleBasicSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setError("")
    setTenders([])

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: "50",
      })

      if (levelFilter !== "all") {
        params.append("level", levelFilter)
      }

      if (provinceFilter !== "all") {
        params.append("province", provinceFilter)
      }

      console.log("[v0] Searching with params:", params.toString())

      const response = await fetch(`/api/tenders/search?${params.toString()}`)

      console.log("[v0] Search response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Search error response:", errorData)
        throw new Error(errorData.details || "Failed to search tenders")
      }

      const results = await response.json()
      console.log("[v0] Search results:", results)

      if (results.total === 0 && !searchQuery && levelFilter === "all" && provinceFilter === "all") {
        setError("No tenders available yet. The database may need to be populated with scraped tenders.")
      }

      setTenders(results.tenders || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search tenders. Please try again."
      setError(errorMessage)
      console.error("[v0] Search error:", err)
    } finally {
      setSearching(false)
    }
  }

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return

    setSearching(true)
    setError("")
    setAiResponse("")
    setTenders([])

    try {
      const response = await fetch("/api/ai-tender-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery }),
      })

      if (!response.ok) {
        throw new Error("Failed to search tenders")
      }

      const results = await response.json()
      setAiResponse(results.response || "")
      setTenders(results.tenders || [])
    } catch (err) {
      setError("Failed to search tenders. Please try again.")
      console.error("[v0] AI search error:", err)
    } finally {
      setSearching(false)
    }
  }

  const handleAddTender = async (tender: Tender) => {
    setAddingTender(tender.id)

    const organization = tender.organization || tender.source_name || "Unknown Organization"
    const publishDate = tender.publishDate || tender.publish_date || new Date().toISOString().split("T")[0]
    const closeDate = tender.closeDate || tender.close_date || publishDate
    const value = tender.value || tender.estimated_value
    const url = tender.url || tender.tender_url

    try {
      const result = await addTenderToUser({
        tenderId: tender.id,
        title: tender.title,
        organization,
        publishDate,
        closeDate,
        value,
        category: tender.category,
        description: tender.description,
        url,
        documents: tender.documents,
      })

      if (result.success) {
        toast({
          title: "Tender added",
          description: `${tender.title} has been added to your tenders`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add tender",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error adding tender:", error)
      toast({
        title: "Error",
        description: "Failed to add tender",
        variant: "destructive",
      })
    } finally {
      setAddingTender(null)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Search Tenders</h1>
        <p className="text-sm md:text-base text-muted-foreground">Find relevant government tenders from 100+ sources</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={searchMode === "basic" ? "default" : "outline"}
          onClick={() => setSearchMode("basic")}
          className={searchMode !== "basic" ? "bg-transparent" : ""}
          size="sm"
        >
          <Search className="h-4 w-4 mr-2" />
          Basic Search
        </Button>
        <Button
          variant={searchMode === "ai" ? "default" : "outline"}
          onClick={() => setSearchMode("ai")}
          className={searchMode !== "ai" ? "bg-transparent" : ""}
          size="sm"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </div>

      {searchMode === "basic" ? (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Basic Search</CardTitle>
            <CardDescription className="text-sm">
              Search for tenders by keywords, category, or organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBasicSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="e.g., medical supplies, IT services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={searching} className="w-full sm:w-auto">
                  {searching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Provincial">Provincial</SelectItem>
                    <SelectItem value="Metro">Metro</SelectItem>
                    <SelectItem value="SOE">SOE</SelectItem>
                    <SelectItem value="Public Entity">Public Entity</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="Gauteng">Gauteng</SelectItem>
                    <SelectItem value="Western Cape">Western Cape</SelectItem>
                    <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                    <SelectItem value="Free State">Free State</SelectItem>
                    <SelectItem value="Limpopo">Limpopo</SelectItem>
                    <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                    <SelectItem value="North West">North West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>BidMate AI Assistant</CardTitle>
            </div>
            <CardDescription>
              Describe what you're looking for in natural language and let AI find relevant tenders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., I'm looking for construction tenders in Gauteng province worth more than R5 million that close in the next 30 days..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              rows={4}
            />
            <Button onClick={handleAiSearch} disabled={searching || !aiQuery.trim()} className="w-full">
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Search with AI
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}

            {aiResponse && (
              <div className="mt-4 p-4 rounded-lg bg-background border border-border">
                <div className="flex items-start gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary mt-1" />
                  <p className="text-sm font-medium text-foreground">AI Response</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tenders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">
              {searchQuery || levelFilter !== "all" || provinceFilter !== "all"
                ? `Found ${tenders.length} ${tenders.length === 1 ? "Tender" : "Tenders"}`
                : `All Tenders (${tenders.length})`}
            </h2>
          </div>

          <div className="grid gap-4">
            {tenders.map((tender) => {
              const organization = tender.organization || tender.source_name || "Unknown Organization"
              const closeDate = tender.closeDate || tender.close_date
              const value = tender.value || tender.estimated_value
              const url = tender.url || tender.tender_url

              return (
                <Card key={tender.id} className="border-border hover:border-primary transition-colors">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <Link href={`/dashboard/scraped-tenders/${tender.id}`} className="flex-1 min-w-0">
                            <CardTitle className="text-base md:text-lg hover:text-primary transition-colors cursor-pointer break-words">
                              {tender.title}
                            </CardTitle>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-primary/10 text-primary text-xs">{tender.category || "General"}</Badge>
                          {tender.source_level && (
                            <Badge variant="outline" className="text-xs">
                              {tender.source_level}
                            </Badge>
                          )}
                          {tender.source_province && (
                            <Badge variant="secondary" className="text-xs">
                              {tender.source_province}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap text-xs md:text-sm">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{organization}</span>
                            </span>
                            {closeDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                Closes: {new Date(closeDate).toLocaleDateString()}
                              </span>
                            )}
                            {value && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 flex-shrink-0" />
                                {value}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm line-clamp-2">{tender.description}</p>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {tender.document_count ?? 0}{" "}
                              {(tender.document_count ?? 0) === 1 ? "document" : "documents"}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" asChild className="bg-transparent w-full sm:w-auto">
                          <Link href={`/dashboard/scraped-tenders/${tender.id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        {url && (
                          <Button variant="outline" size="sm" asChild className="bg-transparent w-full sm:w-auto">
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Original Listing
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleAddTender(tender)}
                          disabled={addingTender === tender.id}
                          className="w-full sm:w-auto"
                        >
                          {addingTender === tender.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to My Tenders
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!searching && tenders.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No Tenders Found</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              {searchQuery || levelFilter !== "all" || provinceFilter !== "all"
                ? "Try adjusting your search terms or filters"
                : "No tenders available yet. Please run the scraper to populate the database."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
