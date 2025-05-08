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
  Receipt,
  ReceiptText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/context/DashboardProvider";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn, cardVariants } from "@/lib/motion";

export default function DashboardPage() {
  const { contacts, quotes = [], activity = [], formatSum, installs = [] } = useDashboard();

  const quotesSum = quotes.reduce((acc, curr) => acc + curr.total, 0);
  const pendingQuotes = quotes.filter(
    (quote) => quote.status === "pending"
  ).length;
  const sentQuotes = quotes.filter((quote) => quote.status === "sent").length;
  const pendingInstalls = installs.filter((install) => install.status !== "completed").length
  const completedInstalls = installs.filter((install) => install.status === "completed").length
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="container mx-auto px-4 py-8"
    >
      {/* Header */}
      <motion.header variants={fadeIn} className="flex flex-col mb-8">
        <h1 className="flex gap-2 items-center text-2xl font-bold">
          Dashboard
        </h1>
      </motion.header>

      <main>
        {/* Quick Actions */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 pb-4"
        >
          <motion.div variants={fadeIn}>
            <Button
              asChild
              variant="outline"
              className="h-16 md:h-24 flex-col gap-2 cursor-pointer w-full"
              whilehover={{ scale: 1.02 }}
              whiletap={{ scale: 0.98 }}
            >
              <Link href="/quotes/create-quote">
                <ReceiptText className="h-6 w-6 text-primary" />
                <span>Create New Quote</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Button
              asChild
              variant="outline"
              className="h-16 md:h-24 flex-col gap-2 cursor-pointer w-full"
              whilehover={{ scale: 1.02 }}
              whiletap={{ scale: 0.98 }}
            >
              <Link href="/contacts">
                <Users className="h-6 w-6 text-primary" />
                <span>View Contacts</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
        >
          <motion.div variants={cardVariants}>
            <Card className="group hover:border-primary transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <h1 className="flex gap-1">
                      <span className="hidden md:block">Total</span> Quotes
                    </h1>
                    <ReceiptText className="h-4 w-4 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-2xl font-bold">
                  <span>{quotes.length}</span>
                  <span className="text-muted-foreground text-base md:text-base self-end">
                    ${formatSum(quotesSum)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-primary transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <h1 className="flex gap-1">
                      {" "}
                      <span className="hidden md:block">Total</span> Contacts
                    </h1>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-emerald-400 transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  <div className="flex flex-row items-center justify-between pb-2">
                    <h1 className="flex gap-1 group-hover:decoration-amber-500">
                      <span className="hidden md:block">Total</span> Invoices
                    </h1>
                    <Receipt className="h-4 w-4 text-emerald-400 group-hover:rotate-y-360 transition-all duration-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-emerald-400 transition-all duration-500">
              <CardHeader >
                <CardTitle className="text-sm font-medium">
                  <div className="flex flex-row items-center justify-between pb-2">
                 <h1 className="flex gap-1"><span className="hidden md:block">Total</span> Revenue</h1> 
                 <DollarSign className="h-4 w-4 text-emerald-400 group-hover:rotate-y-360 transition-all duration-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-muted-foreground">
                  $0
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants}>
            <Card className="group hover:border-yellow-500 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-yellow-500">
                  Pending Quotes
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingQuotes}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-blue-500 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-500">
                  Sent Quotes
                </CardTitle>
                <Mail className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sentQuotes}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-yellow-500 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-yellow-500">
                  Installs Pending
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
           
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingInstalls}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="group hover:border-green-500 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-500">
                  Installs Completed
                </CardTitle>
          
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedInstalls}</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeIn}>
          <Card className="mb-8 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div className="space-y-4">
                {activity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 rounded-full bg-secondary">
                      {activity.type === "email" && (
                        <Mail className="h-4 w-4" />
                      )}
                      {activity.type === "call" && (
                        <Phone className="h-4 w-4" />
                      )}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      whilehover={{ scale: 1.05 }}
                      whiletap={{ scale: 0.95 }}
                    >
                      View
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                variant="outline"
                whilehover={{ scale: 1.05 }}
                whiletap={{ scale: 0.95 }}
              >
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
