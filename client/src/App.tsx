import { useEffect, type ComponentType } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SectionCollection, AllApparelCollection } from "./pages/Collections";
import {
  CUSTOMER_NAV_SECTIONS,
  LEGACY_COLLECTION_REDIRECTS,
} from "@shared/commerce/sections";
import ProductDetail from "./pages/ProductDetail";
import Community from "./pages/Community";
import FoundingCrew from "./pages/FoundingCrew";
import CartPage from "./pages/Cart";
import ReturnsPage from "./pages/Returns";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import OpenSoon from "./pages/OpenSoon";
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  ShippingPage,
  TermsPage,
} from "./pages/Info";
import { SHOP_OPEN } from "./const";

function withPreview(path: string) {
  try {
    const on =
      sessionStorage.getItem("wk-preview") === "1" ||
      new URLSearchParams(window.location.search).get("preview") === "wkcrew26";
    if (!on) return path;
  } catch {
    return path;
  }
  const u = new URL(path, window.location.origin);
  u.searchParams.set("preview", "wkcrew26");
  return u.pathname + u.search + u.hash;
}

function RedirectHome() {
  if (typeof window !== "undefined") {
    window.location.replace(withPreview("/"));
  }
  return null;
}

// Stable component per section so routes never remount on re-render.
const SECTION_COMPONENTS: Record<string, ComponentType> = Object.fromEntries(
  CUSTOMER_NAV_SECTIONS.map(section => [
    section.handle,
    () => <SectionCollection handle={section.handle} />,
  ])
);

function LegacyCollectionRedirect({ to }: { to: string }) {
  if (typeof window !== "undefined") {
    window.location.replace(withPreview(to));
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
  const [location] = useLocation();
  useEffect(() => {
    document.getElementById("app-scroll")?.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route>
        {() => (
          <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
            <Header />
            <div id="app-scroll" className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex min-h-full flex-col">
                <main className="flex-1">
                  <Switch>
                    <Route path={"/"} component={Home} />
                    {CUSTOMER_NAV_SECTIONS.map(section => (
                      <Route
                        key={section.handle}
                        path={`/collections/${section.handle}`}
                      >
                        {() => (
                          <ShopRoute
                            open={SECTION_COMPONENTS[section.handle]}
                          />
                        )}
                      </Route>
                    ))}
                    {Object.entries(LEGACY_COLLECTION_REDIRECTS).map(
                      ([legacy, to]) => (
                        <Route key={legacy} path={`/collections/${legacy}`}>
                          {() => <LegacyCollectionRedirect to={to} />}
                        </Route>
                      )
                    )}
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
                    <Route path={"/about"} component={AboutPage} />
                    <Route path={"/faq"} component={FaqPage} />
                    <Route path={"/shipping"} component={ShippingPage} />
                    <Route path={"/contact"} component={ContactPage} />
                    <Route path={"/privacy"} component={PrivacyPage} />
                    <Route path={"/terms"} component={TermsPage} />
                    <Route
                      path={"/checkout/success"}
                      component={CheckoutSuccess}
                    />
                    <Route path={"/404"} component={NotFound} />
                    <Route component={NotFound} />
                  </Switch>
                </main>
                <Footer />
              </div>
            </div>
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
