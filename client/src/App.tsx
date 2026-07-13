import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  MenCollection,
  WomenCollection,
  HatsCollection,
  HoodiesCollection,
  BeachCollection,
  LimitedDropCollection,
} from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Community from "./pages/Community";
import FoundingCrew from "./pages/FoundingCrew";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/customers"} component={AdminCustomers} />
      <Route path={"/admin/settings"} component={AdminSettings} />
      <Route path={"/"} component={Home} />
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path={"/collections/men"} component={MenCollection} />
                <Route path={"/collections/women"} component={WomenCollection} />
                <Route path={"/collections/hats"} component={HatsCollection} />
                <Route path={"/collections/hoodies"} component={HoodiesCollection} />
                <Route path={"/collections/beach"} component={BeachCollection} />
                <Route path={"/collections/limited-drop"} component={LimitedDropCollection} />
                <Route path={"/products/:handle"} component={ProductDetail} />
                <Route path={"/wishlist"} component={Wishlist} />
                <Route path={"/community"} component={Community} />
                <Route path={"/founding-crew"} component={FoundingCrew} />
                <Route path={"/404"} component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
