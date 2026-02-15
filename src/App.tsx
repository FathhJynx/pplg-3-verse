import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import SmoothScroll from "./components/layout/SmoothScroll";
import Background3D from "./components/layout/Background3D";
import LoadingScreen from "./components/layout/LoadingScreen";
import ScrollToTop from "./components/layout/ScrollToTop";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const StudentDetail = lazy(() => import("./pages/StudentDetail"));
const Menfess = lazy(() => import("./pages/Menfess"));
const MenfessDetail = lazy(() => import("./pages/MenfessDetail"));
const RadioSection = lazy(() => import("./components/features/radio/RadioSection"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Background3D />
      <SmoothScroll>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen onComplete={() => { }} />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student/:id" element={<StudentDetail />} />
              <Route path="/menfess" element={<Menfess />} />
              <Route path="/menfess/:id" element={<MenfessDetail />} />
              <Route path="/radio" element={<RadioSection />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SmoothScroll>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
