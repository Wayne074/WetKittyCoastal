import type { ComponentType } from "react";
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
  AllApparelCollection,
} from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Community from "./pages/Community";
import FoundingCrew from "./pages/FoundingCrew";
import CartPage from "./pages/Cart";
import ReturnsPage from "./pages/Returns";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import OpenSoon from "./pages/OpenSoon";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCustomers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/Settings";
import { SHOP_OPEN } from "./const";

function RedirectHome() {
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
  return null;
}

function ShopRoute({
  open: Open,
  closed: Closed = OpenSoon,
}: {
  open: ComponentType;
  closed?: ComponentType;
}) {
  const Component = SHOP_OPEN ? Open : Closed;
  return <Component />;
}

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
                <Route path={"/collections/men"}>
                  {() => <ShopRoute open={MenCollection} />}
                </Route>
                <Route path={"/collections/women"}>
                  {() => <ShopRoute open={WomenCollection} />}
                </Route>
                <Route path={"/collections/hats"}>
                  {() => <ShopRoute open={HatsCollection} />}
                </Route>
                <Route path={"/collections/hoodies"}>
                  {() => <ShopRoute open={HoodiesCollection} />}
                </Route>
                <Route path={"/collections/beach"}>
                  {() => <ShopRoute open={BeachCollection} />}
                </Route>
                <Route path={"/collections/limited-drop"}>
                  {() => <ShopRoute open={LimitedDropCollection} />}
                </Route>
                <Route path={"/collections/apparel"}>
                  {() => <ShopRoute open={AllApparelCollection} />}
                </Route>
                <Route path={"/products/:handle"}>
                  {() => <ShopRoute open={ProductDetail} />}
                </Route>
                <Route path={"/wishlist"} component={RedirectHome} />
                <Route path={"/community"} component={Community} />
                <Route path={"/founding-crew"} component={FoundingCrew} />
                <Route path={"/events"} component={RedirectHome} />
                <Route path={"/cart"}>
                  {() => <ShopRoute open={CartPage} />}
                </Route>
                <Route path={"/returns"} component={ReturnsPage} />
                <Route path={"/checkout/success"} component={CheckoutSuccess} />
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
      <ThemeProvider defaultTheme="light" switchable>
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
