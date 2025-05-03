"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  FileText,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardProvider";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Receipt } from "lucide-react";

export default function DashboardPage() {
  const { contacts, quotes = [], activity = [] } = useDashboard();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col mb-8">
        <h1 className="flex gap-2 items-center text-2xl font-bold">
          Dashboard
        </h1>
      </header>
      <main>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          <Button
            asChild
            variant="outline"
            className="h-16 md:h-24  flex-col gap-2 cursor-pointer"
          >
            <Link href="/quotes/create-quote">
              <Receipt className="h-6 w-6 text-primary" />
              <span>Create New Quote</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-16 md:h-24 flex-col gap-2 cursor-pointer"
          >
            <Link href="/contacts">
              <Users className="h-6 w-6 text-primary" />
              <span>View Contacts</span>
            </Link>
          </Button>
        </div>

        {/* Total Quotes & Contacts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quotes
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contacts
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         

          {/* Pending Quotes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
            </CardContent>
          </Card>

          {/* Sent Quotes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Mail className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
            </CardContent>
          </Card>

          {/* Completed Quotes Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
            </CardContent>
          </Card>

          {/* Jobs Lost Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jobs Lost</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-secondary">
                    {activity.type === "email" && <Mail className="h-4 w-4" />}
                    {activity.type === "call" && <Phone className="h-4 w-4" />}
                    {activity.type === "note" && (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {activity.contact} • {activity.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline">View All Activity</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
