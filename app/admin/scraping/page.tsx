"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  RefreshCw,
  Search,
  TrendingUp,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminNav } from "@/components/admin-nav"

interface TenderSource {
  id: number
  name: string
  level: string
  province: string | null
  tender_page_url: string
  is_active: boolean
  scraping_enabled: boolean
  last_scraped_at: string | null
  last_scrape_status: string | null
  total_tenders_scraped: number
  scraping_frequency_hours: number
}

interface ScrapingStats {
  totalSources: number
  activeSources: number
  totalTenders: number
  activeTenders: number
  tendersByLevel: Record<string, number>
  recentScrapes: Array<{
    id: number
    name: string
    last_scraped_at: string
    last_scrape_status: string
    total_tenders_scraped: number
  }>
}

export default function ScrapingAdminPage() {
  const [sources, setSources] = useState<TenderSource[]>([])
  const [stats, setStats] = useState<ScrapingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sourcesRes, statsRes] = await Promise.all([fetch("/api/scraping/sources"), fetch("/api/scraping/stats")])

      if (sourcesRes.ok) {
        const sourcesData = await sourcesRes.json()
        setSources(sourcesData.sources || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load scraping data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleScraping = async (sourceId: number, enabled: boolean) => {
    try {
      const response = await fetch("/api/scraping/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId,
          updates: { scraping_enabled: enabled },
        }),
      })

      if (!response.ok) throw new Error("Failed to update source")

      toast({
        title: "Success",
        description: `Scraping ${enabled ? "enabled" : "disabled"} for source`,
      })

      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update source",
        variant: "destructive",
      })
    }
  }

  const handleScrapeSource = async (sourceId: number) => {
    setScraping(sourceId)
    try {
      const response = await fetch("/api/scraping/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to trigger scraping")
      }

      const result = await response.json()

      toast({
        title: "Scraping Complete",
        description: `Scraped ${result.scrapedCount || 0} tenders`,
      })

      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape source",
        variant: "destructive",
      })
    } finally {
      setScraping(null)
    }
  }

  const handleScrapeAll = async () => {
    setScraping(-1)
    try {
      const response = await fetch("/api/scraping/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scrapeAll: true }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to trigger scraping")
      }

      const result = await response.json()

      toast({
        title: "Scraping Complete",
        description: `Scraped ${result.totalScraped || 0} tenders from all sources`,
      })

      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to scrape all sources",
        variant: "destructive",
      })
    } finally {
      setScraping(null)
    }
  }

  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      searchQuery === "" ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.tender_page_url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = levelFilter === "all" || source.level === levelFilter

    return matchesSearch && matchesLevel
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Scraping Administration</h1>
          <p className="text-muted-foreground">Manage tender sources and scraping operations</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSources}</div>
                <p className="text-xs text-muted-foreground">{stats.activeSources} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTenders}</div>
                <p className="text-xs text-muted-foreground">{stats.activeTenders} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Scrapes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentScrapes.length}</div>
                <p className="text-xs text-muted-foreground">Last 10 operations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.recentScrapes.length > 0
                    ? Math.round(
                        (stats.recentScrapes.filter((s) => s.last_scrape_status === "success").length /
                          stats.recentScrapes.length) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">From recent scrapes</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Scraping Actions</CardTitle>
            <CardDescription>Trigger scraping operations for all or individual sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleScrapeAll} disabled={scraping !== null} size="lg">
              {scraping === -1 ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scraping All Sources...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scrape All Active Sources
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tender Sources</CardTitle>
            <CardDescription>Manage individual tender sources and their scraping configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
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
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Scraped</TableHead>
                    <TableHead>Tenders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">{source.province || "All"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{source.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {source.scraping_enabled ? (
                            <Badge className="bg-green-500/10 text-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Pause className="h-3 w-3 mr-1" />
                              Disabled
                            </Badge>
                          )}
                          {source.last_scrape_status === "success" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {source.last_scrape_status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {source.last_scraped_at ? new Date(source.last_scraped_at).toLocaleString() : "Never"}
                      </TableCell>
                      <TableCell>{source.total_tenders_scraped}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleScraping(source.id, !source.scraping_enabled)}
                          >
                            {source.scraping_enabled ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleScrapeSource(source.id)}
                            disabled={scraping === source.id || !source.scraping_enabled}
                          >
                            {scraping === source.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Scraping...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Scrape
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredSources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sources found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
