import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, Users, TrendingUp } from "lucide-react";

const Admin = () => {
  const [stats, setStats] = useState({
    totalBoxes: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingRedemptions: 0,
  });
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchRedemptions();
  }, []);

  const checkAuth = async () => {
    // Demo mode: allow access without auth
    return;
  };

  const fetchStats = async () => {
    try {
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, transaction_type");

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id");

      const { data: redemptions } = await supabase
        .from("redemptions")
        .select("status");

      const totalBoxes = transactions?.filter(t => t.transaction_type === "box_purchase").length || 0;
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalUsers = profiles?.length || 0;
      const pendingRedemptions = redemptions?.filter(r => r.status === "pending").length || 0;

      setStats({
        totalBoxes,
        totalRevenue,
        totalUsers,
        pendingRedemptions,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching stats",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRedemptions = async () => {
    try {
      const { data, error } = await supabase
        .from("redemptions")
        .select(`
          id,
          status,
          delivery_fee,
          shipping_address,
          created_at,
          telegram_id,
          cards (name, rarity)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRedemptions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                For demo purposes, this is made public, but this will only be available to... you guessed it... admins
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Boxes Sold
                </CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalBoxes}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">⭐ {stats.totalRevenue.toFixed(0)} Stars</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Redemptions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.pendingRedemptions}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Recent Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell>{redemption.telegram_id}</TableCell>
                      <TableCell>{redemption.cards?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={redemption.status === "pending" ? "default" : "secondary"}
                        >
                          {redemption.status}
                        </Badge>
                      </TableCell>
                      <TableCell>⭐ {redemption.delivery_fee} Stars</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {redemption.shipping_address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
