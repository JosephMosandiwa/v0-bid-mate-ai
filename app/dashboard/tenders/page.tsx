"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Search,
  Calendar,
  Building2,
  DollarSign,
  Eye,
  Trash2,
  Plus,
  Pin,
  Heart,
  Star,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import {
  getUserTenders,
  deleteTender,
  toggleTenderPin,
  toggleTenderFavourite,
  toggleTenderWishlist,
} from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

interface UserTender {
  id: string
  tender_id: string
  title: string
  organization: string
  status: string
  close_date: string
  value?: string
  category?: string
  is_pinned: boolean
  is_favourited: boolean
  is_wishlisted: boolean
  created_at: string
  tender_type?: "scraped" | "custom" // Added tender_type to interface
}

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showPinned, setShowPinned] = useState(false)
  const [showFavourited, setShowFavourited] = useState(false)
  const [showWishlisted, setShowWishlisted] = useState(false)
  const [tenders, setTenders] = useState<UserTender[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingTender, setUpdatingTender] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadTenders()
  }, [])

  const loadTenders = async () => {
    setLoading(true)
    const result = await getUserTenders()
    if (result.success) {
      setTenders(result.tenders as UserTender[])
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load tenders",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tender.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter
    const matchesPinned = !showPinned || tender.is_pinned
    const matchesFavourited = !showFavourited || tender.is_favourited
    const matchesWishlisted = !showWishlisted || tender.is_wishlisted
    return matchesSearch && matchesStatus && matchesPinned && matchesFavourited && matchesWishlisted
  })

  const handleTogglePin = async (tenderId: string, currentValue: boolean) => {
    setUpdatingTender(tenderId)
    const result = await toggleTenderPin(tenderId, !currentValue)
    if (result.success) {
      await loadTenders()
      toast({
        title: currentValue ? "Unpinned" : "Pinned",
        description: `Tender ${currentValue ? "unpinned" : "pinned"} successfully`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update tender",
        variant: "destructive",
      })
    }
    setUpdatingTender(null)
  }

  const handleToggleFavourite = async (tenderId: string, currentValue: boolean) => {
    setUpdatingTender(tenderId)
    const result = await toggleTenderFavourite(tenderId, !currentValue)
    if (result.success) {
      await loadTenders()
      toast({
        title: currentValue ? "Removed from favourites" : "Added to favourites",
        description: `Tender ${currentValue ? "removed from" : "added to"} favourites`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update tender",
        variant: "destructive",
      })
    }
    setUpdatingTender(null)
  }

  const handleToggleWishlist = async (tenderId: string, currentValue: boolean) => {
    setUpdatingTender(tenderId)
    const result = await toggleTenderWishlist(tenderId, !currentValue)
    if (result.success) {
      await loadTenders()
      toast({
        title: currentValue ? "Removed from wishlist" : "Added to wishlist",
        description: `Tender ${currentValue ? "removed from" : "added to"} wishlist`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update tender",
        variant: "destructive",
      })
    }
    setUpdatingTender(null)
  }

  const handleDelete = async (tenderId: string) => {
    if (!confirm("Are you sure you want to delete this tender?")) return

    setUpdatingTender(tenderId)
    const result = await deleteTender(tenderId)
    if (result.success) {
      await loadTenders()
      toast({
        title: "Deleted",
        description: "Tender deleted successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete tender",
        variant: "destructive",
      })
    }
    setUpdatingTender(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-accent/10 text-accent"
      case "submitted":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft"
      case "in-progress":
        return "In Progress"
      case "submitted":
        return "Submitted"
      default:
        return status
    }
  }

  const getTenderDetailUrl = (tender: UserTender) => {
    if (tender.tender_type === "custom") {
      return `/dashboard/custom-tenders/${tender.id}`
    }
    // Scraped tenders
    return `/dashboard/tenders/${tender.tender_id}`
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tenders</h1>
          <p className="text-muted-foreground">Manage and track all your tender submissions</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tenders/new">
            <Plus className="h-4 w-4 mr-2" />
            New Tender
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter !== "all" ? "bg-transparent" : ""}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
                className={statusFilter !== "draft" ? "bg-transparent" : ""}
                size="sm"
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "in-progress" ? "default" : "outline"}
                onClick={() => setStatusFilter("in-progress")}
                className={statusFilter !== "in-progress" ? "bg-transparent" : ""}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === "submitted" ? "default" : "outline"}
                onClick={() => setStatusFilter("submitted")}
                className={statusFilter !== "submitted" ? "bg-transparent" : ""}
                size="sm"
              >
                Submitted
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={showPinned ? "default" : "outline"}
                onClick={() => setShowPinned(!showPinned)}
                className={!showPinned ? "bg-transparent" : ""}
                size="sm"
              >
                <Pin className="h-4 w-4 mr-2" />
                Pinned
              </Button>
              <Button
                variant={showFavourited ? "default" : "outline"}
                onClick={() => setShowFavourited(!showFavourited)}
                className={!showFavourited ? "bg-transparent" : ""}
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Favourites
              </Button>
              <Button
                variant={showWishlisted ? "default" : "outline"}
                onClick={() => setShowWishlisted(!showWishlisted)}
                className={!showWishlisted ? "bg-transparent" : ""}
                size="sm"
              >
                <Star className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenders List */}
      <div className="grid gap-4">
        {filteredTenders.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tenders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || showPinned || showFavourited || showWishlisted
                  ? "Try adjusting your filters"
                  : "Get started by searching for tenders"}
              </p>
              {!searchQuery && statusFilter === "all" && !showPinned && !showFavourited && !showWishlisted && (
                <Button asChild>
                  <Link href="/dashboard/search">Search Tenders</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTenders.map((tender) => (
            <Card key={tender.id} className="border-border hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CardTitle className="text-xl">{tender.title}</CardTitle>
                      <Badge className={getStatusColor(tender.status)}>{getStatusLabel(tender.status)}</Badge>
                      {tender.is_pinned && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {tender.is_favourited && (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                          <Heart className="h-3 w-3 mr-1" />
                          Favourite
                        </Badge>
                      )}
                      {tender.is_wishlisted && (
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          <Star className="h-3 w-3 mr-1" />
                          Wishlist
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {tender.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(tender.close_date).toLocaleDateString()}
                      </span>
                      {tender.value && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {tender.value}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleTogglePin(tender.id, tender.is_pinned)}
                      disabled={updatingTender === tender.id}
                      className={tender.is_pinned ? "bg-primary/10 text-primary" : "bg-transparent"}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleFavourite(tender.id, tender.is_favourited)}
                      disabled={updatingTender === tender.id}
                      className={tender.is_favourited ? "bg-red-500/10 text-red-500" : "bg-transparent"}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleWishlist(tender.id, tender.is_wishlisted)}
                      disabled={updatingTender === tender.id}
                      className={tender.is_wishlisted ? "bg-yellow-500/10 text-yellow-500" : "bg-transparent"}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild className="bg-transparent">
                      <Link href={getTenderDetailUrl(tender)}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(tender.id)}
                      disabled={updatingTender === tender.id}
                      className="bg-transparent text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
