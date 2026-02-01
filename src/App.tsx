import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Rentals from "./pages/Rentals";
import VehicleDetail from "./pages/VehicleDetail";
import Trekking from "./pages/Trekking";
import TrekDetail from "./pages/TrekDetail";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";

// User pages
import UserLogin from "./pages/auth/Login";
import UserDashboard from "./pages/user/Dashboard";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import VehicleList from "./pages/admin/vehicles/VehicleList";
import VehicleForm from "./pages/admin/vehicles/VehicleForm";
import TrekList from "./pages/admin/treks/TrekList";
import TrekForm from "./pages/admin/treks/TrekForm";
import UserManagement from "./pages/admin/users/UserManagement";
import BookingList from "./pages/admin/bookings/BookingList";
import MessageList from "./pages/admin/messages/MessageList";
import GalleryManager from "./pages/admin/gallery/GalleryManager";
import SettingsPage from "./pages/admin/settings/SettingsPage";
import TestimonialList from "./pages/admin/testimonials/TestimonialList";
import BannerManager from "./pages/admin/banners/BannerManager";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rentals/:id" element={<VehicleDetail />} />
            <Route path="/trekking" element={<Trekking />} />
            <Route path="/trekking/:id" element={<TrekDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* User Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="banners" element={<BannerManager />} />
              <Route path="vehicles" element={<VehicleList />} />
              <Route path="vehicles/new" element={<VehicleForm />} />
              <Route path="vehicles/:id" element={<VehicleForm />} />
              <Route path="treks" element={<TrekList />} />
              <Route path="treks/new" element={<TrekForm />} />
              <Route path="treks/:id" element={<TrekForm />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="bookings" element={<BookingList />} />
              <Route path="messages" element={<MessageList />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="testimonials" element={<TestimonialList />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
