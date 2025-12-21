"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { User, CreditCard, Bell, Shield, Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function AccountPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    job_title: "",
    avatar_url: "",
  })
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    weekly_digest: true,
    tender_matches: true,
    deadline_reminders: true,
  })

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
        loadUserData(currentUser)
      }
    }

    checkUser()
  }, [router])

  const loadUserData = async (currentUser: any) => {
    try {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: profileData.email || currentUser.email || "",
          phone: profileData.phone || "",
          job_title: profileData.job_title || "",
          avatar_url: profileData.avatar_url || "",
        })
      } else {
        setProfile((prev) => ({ ...prev, email: currentUser.email || "" }))
      }

      // Load notification preferences from strategist_user_preferences
      const { data: prefsData } = await supabase
        .from("strategist_user_preferences")
        .select("notification_preferences")
        .eq("user_id", currentUser.id)
        .single()

      if (prefsData?.notification_preferences) {
        setNotifications({
          email_alerts: prefsData.notification_preferences.email_alerts ?? true,
          weekly_digest: prefsData.notification_preferences.weekly_digest ?? true,
          tender_matches: prefsData.notification_preferences.tender_matches ?? true,
          deadline_reminders: prefsData.notification_preferences.deadline_reminders ?? true,
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        job_title: profile.job_title,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const saveNotifications = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase.from("strategist_user_preferences").upsert(
        {
          user_id: user.id,
          notification_preferences: notifications,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (error) throw error
      alert("Notification preferences updated successfully!")
    } catch (error) {
      console.error("Error saving notifications:", error)
      alert("Failed to save preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your personal account preferences and security</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="john@example.com"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed here. Contact support to update.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    value={profile.job_title}
                    onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                    placeholder="Procurement Manager"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>View your subscription plan, usage, and manage billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Full billing management coming soon.</p>
                <Button onClick={() => router.push("/dashboard/billing")}>View Billing Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about tender opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
                <Switch
                  id="email_alerts"
                  checked={notifications.email_alerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_alerts: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tender_matches">Tender Match Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new tenders match your profile</p>
                </div>
                <Switch
                  id="tender_matches"
                  checked={notifications.tender_matches}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, tender_matches: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deadline_reminders">Deadline Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders for upcoming tender deadlines</p>
                </div>
                <Switch
                  id="deadline_reminders"
                  checked={notifications.deadline_reminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, deadline_reminders: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly_digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">Weekly summary of tender opportunities</p>
                </div>
                <Switch
                  id="weekly_digest"
                  checked={notifications.weekly_digest}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weekly_digest: checked })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveNotifications} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    To change your password, you'll need to sign out and use the "Forgot Password" option on the login
                    page.
                  </p>
                  <Button variant="outline" onClick={() => router.push("/login")}>
                    Go to Login
                  </Button>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming soon: Add an extra layer of security to your account.
                  </p>
                  <Button variant="outline" disabled>
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
