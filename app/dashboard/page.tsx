import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Sparkles, Clock, AlertCircle, TrendingUp, CheckCircle2, Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/app/actions/tender-actions"
import { formatDistanceToNow, format } from "date-fns"
import { StrategistDashboardWidget } from "@/components/strategist/dashboard-widget"

export default async function DashboardPage() {
  const { stats } = await getDashboardStats()

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with your tenders today.</p>
      </div>

      {/* Stats Grid - Responsive grid with improved mobile layout */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{stats?.totalTenders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">AI Analyzed</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{stats?.analyzedTenders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Documents processed</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Closing Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{stats?.closingSoon || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">{stats?.recentActivity?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategist Widget in a new section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Strategist Widget - takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <StrategistDashboardWidget />
        </div>

        {/* Quick Actions - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Quick Actions</h2>
            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard/tenders/new">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Tender</span>
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border hover:border-primary transition-colors cursor-pointer">
              <Link href="/dashboard/search" className="block">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Search className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Search Tenders</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Find relevant government tenders from eTenders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="sm">
                    Start Search
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-border hover:border-primary transition-colors cursor-pointer">
              <Link href="/dashboard/tenders/new" className="block">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                    <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Upload & Analyze</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    AI-powered analysis and form generation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="sm">
                    Analyze Now
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="border-border hover:border-primary transition-colors cursor-pointer">
              <Link href="/dashboard/tenders" className="block">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <CardTitle className="text-base md:text-lg">My Tenders</CardTitle>
                  <CardDescription className="text-xs md:text-sm">View and manage all submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-transparent" variant="outline" size="sm">
                    View Tenders
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Upcoming Deadlines</h2>
            <Badge variant="destructive" className="ml-auto text-xs">
              {stats.upcomingDeadlines.length} urgent
            </Badge>
          </div>
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.upcomingDeadlines.map((tender) => (
              <Card key={tender.id} className="border-destructive/50 hover:border-destructive transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm md:text-base line-clamp-2 flex-1">{tender.title}</CardTitle>
                    <Calendar className="h-4 w-4 text-destructive flex-shrink-0" />
                  </div>
                  <CardDescription className="text-xs line-clamp-1">{tender.organization}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Closes:</span>
                    <Badge variant="destructive" className="text-xs">
                      {tender.close_date
                        ? formatDistanceToNow(new Date(tender.close_date), { addSuffix: true })
                        : "Unknown"}
                    </Badge>
                  </div>
                  {tender.close_date && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tender.close_date), "MMM dd, yyyy")}
                    </p>
                  )}
                  <Button asChild size="sm" className="w-full bg-transparent" variant="outline">
                    <Link href={`/dashboard/tenders/${tender.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <Card className="border-border">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 md:gap-4">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === "analyzed" ? "bg-primary" : "bg-secondary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.type === "analyzed" ? "Tender analyzed" : "Tender saved"}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.organization}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
                      <Link
                        href={
                          activity.type === "analyzed"
                            ? `/dashboard/custom-tenders/${activity.id}`
                            : `/dashboard/tenders/${activity.id}`
                        }
                      >
                        View
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <Card className="border-border">
            <CardContent className="p-8 md:p-12 text-center">
              <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm md:text-base text-muted-foreground mb-4">
                No activity yet. Start by searching or uploading a tender.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild size="sm">
                  <Link href="/dashboard/search">Search Tenders</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/tenders/new">Upload Tender</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">Getting Started</h2>
        <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm md:text-base">Search eTender Portal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground">
                Find government tenders from the South African eTender portal matching your criteria.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm md:text-base">AI Document Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground">
                Upload tender documents for automatic extraction of requirements, deadlines, and compliance needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm md:text-base">Smart Form Generation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs md:text-sm text-muted-foreground">
                Get auto-generated response forms based on analyzed tender requirements for faster submissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
