"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  MessageSquare,
  Calendar,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  X,
  Save,
  CalendarCheck
} from "lucide-react";
import { toast } from "sonner";
import { useSession, authClient } from "@/lib/auth-client";

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  featuredProperties: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalTestimonials: number;
  totalPartners: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalContacts: number;
  unreadContacts: number;
  totalFaqs: number;
  publishedFaqs: number;
  totalGalleryItems: number;
  publishedGalleryItems: number;
}

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editType, setEditType] = useState<string>("");

  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    }
  }

  // Fetch data based on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let setter: any = null;

      switch (activeTab) {
        case "properties":
          endpoint = "/api/properties?limit=50";
          setter = setProperties;
          break;
        case "blogs":
          endpoint = "/api/blog-posts?limit=50";
          setter = setBlogPosts;
          break;
        case "testimonials":
          endpoint = "/api/testimonials?limit=50";
          setter = setTestimonials;
          break;
        case "partners":
          endpoint = "/api/partners?limit=50";
          setter = setPartners;
          break;
        case "bookings":
          endpoint = "/api/bookings?limit=50";
          setter = setBookings;
          break;
        case "contacts":
          endpoint = "/api/contacts?limit=50";
          setter = setContacts;
          break;
        case "faqs":
          endpoint = "/api/faqs?limit=50";
          setter = setFaqs;
          break;
        case "gallery":
          endpoint = "/api/gallery-items?limit=50";
          setter = setGalleryItems;
          break;
      }

      if (endpoint && setter) {
        const res = await fetch(endpoint);
        const data = await res.json();
        setter(data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ALL useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (!isPending && !session?.user) {
      console.log("isPending", isPending);
      console.log("session", session?.user);
      router.push("/adminstration/login?redirect=/adminstration/admin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchStats();
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user && activeTab !== "dashboard") {
      fetchData();
    }
  }, [activeTab, session?.user]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  // Add new item
  const handleAdd = (type: string) => {
    console.log("handleAdd called with type:", type);
    setIsCreating(true);
    setEditType(type);
    
    // Create empty template based on type
    const templates: Record<string, any> = {
      properties: {
        title: "",
        location: "",
        price: "",
        bedrooms: 0,
        bathrooms: 0,
        area: "",
        status: "Active",
        description: "",
        image: "",
        images: [],
        featured: false,
        type: "Residential",
        category: "Sale"
      },
      blogs: {
        title: "",
        author: "",
        category: "",
        excerpt: "",
        content: "",
        published: false,
        image: "",
        date: new Date().toISOString().split('T')[0],
        readTime: "5 min read"
      },
      testimonials: {
        name: "",
        role: "",
        rating: 5,
        content: "",
        image: ""
      },
      partners: {
        name: "",
        website: "",
        logo: ""
      },
      bookings: {
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: "",
        status: "Pending"
      },
      faqs: {
        question: "",
        answer: "",
        category: "General",
        published: false,
        order_index: 0
      },
      gallery: {
        title: "",
        category: "",
        image: "",
        description: "",
        published: false
      }
    };
    
    const template = templates[type] || {};
    console.log("Setting template:", template);
    setEditingItem(template);
    setShowModal(true);
    toast.info(`Creating new ${type.slice(0, -1)}...`);
  };

  // Edit item
  const handleEdit = (item: any, type: string) => {
    setIsCreating(false);
    setEditingItem(item);
    setEditType(type);
    setShowModal(true);
  };

  // Save edited or new item
  const handleSaveEdit = async () => {
    if (!editingItem) {
      console.error("No editing item");
      toast.error("No item to save");
      return;
    }

    // Validation
    if (isCreating) {
      if (editType === "properties" && (!editingItem.title || !editingItem.location || !editingItem.price)) {
        toast.error("Please fill in all required fields (Title, Location, Price)");
        return;
      }
      if (editType === "blogs" && (!editingItem.title || !editingItem.author || !editingItem.content)) {
        toast.error("Please fill in all required fields (Title, Author, Content)");
        return;
      }
      if (editType === "testimonials" && (!editingItem.name || !editingItem.role || !editingItem.image || !editingItem.content)) {
        toast.error("Please fill in all required fields (Name, Role, Image, Content)");
        return;
      }
      if (editType === "partners" && (!editingItem.name || !editingItem.logo)) {
        toast.error("Please fill in all required fields (Name, Logo)");
        return;
      }
      if (editType === "faqs" && (!editingItem.question || !editingItem.answer)) {
        toast.error("Please fill in all required fields (Question, Answer)");
        return;
      }
      if (editType === "gallery" && (!editingItem.title || !editingItem.image)) {
        toast.error("Please fill in all required fields (Title, Image)");
        return;
      }
    }

    setIsSaving(true);
    console.log("Saving item:", { isCreating, editType, editingItem });

    try {
      const endpoints: Record<string, string> = {
        properties: "/api/properties",
        blogs: "/api/blog-posts",
        testimonials: "/api/testimonials",
        partners: "/api/partners",
        bookings: "/api/bookings",
        contacts: "/api/contacts",
        faqs: "/api/faqs",
        gallery: "/api/gallery-items",
      };

      const method = isCreating ? "POST" : "PUT";
      const url = isCreating 
        ? endpoints[editType]
        : `${endpoints[editType]}?id=${editingItem.id}`;

      console.log("Making request:", { method, url });

      const token = localStorage.getItem("bearer_token");
      console.log("Token present:", !!token);

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(editingItem),
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Response data:", data);
        toast.success(isCreating ? "Item created successfully!" : "Item updated successfully!");
        setShowModal(false);
        setEditingItem(null);
        setIsCreating(false);
        await fetchData();
        await fetchStats();
      } else {
        const error = await res.json();
        console.error("Error response:", error);
        toast.error(error.error || error.message || "Failed to save item");
      }
    } catch (error) {
      console.error("Catch error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item
  const handleDelete = async (id: number, type: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const endpoints: Record<string, string> = {
        properties: "/api/properties",
        blogs: "/api/blog-posts",
        testimonials: "/api/testimonials",
        partners: "/api/partners",
        bookings: "/api/bookings",
        contacts: "/api/contacts",
        faqs: "/api/faqs",
        gallery: "/api/gallery-items",
      };

      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`${endpoints[type]}?id=${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (res.ok) {
        toast.success("Item deleted successfully");
        fetchData();
        fetchStats();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // Update booking status
  const handleUpdateBookingStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success("Status updated successfully");
        fetchData();
        fetchStats();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // Update contact status
  const handleUpdateContactStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/contacts?id=${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success("Status updated successfully");
        fetchData();
        fetchStats();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to logout");
    } else {
      localStorage.removeItem("bearer_token");
      router.push("/adminstration/login");
    }
  };

  // View contact message
  const handleViewMessage = (message: string) => {
    setEditingItem({ message });
    setEditType("view-message");
    setShowModal(true);
  };

  const statCards = [
    { 
      label: "Total Properties", 
      value: stats?.totalProperties || 0, 
      icon: Home, 
      color: "bg-blue-500" 
    },
    { 
      label: "Active Listings", 
      value: stats?.activeProperties || 0, 
      icon: LayoutDashboard, 
      color: "bg-green-500" 
    },
    { 
      label: "Consultations", 
      value: stats?.totalBookings || 0, 
      icon: Calendar, 
      color: "bg-purple-500" 
    },
    { 
      label: "Contact Submissions", 
      value: stats?.totalContacts || 0, 
      icon: MessageSquare, 
      color: "bg-orange-500" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2332] text-white fixed h-full">
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold text-[#D4AF37] mb-8">
            Winst Admin
          </h2>
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "properties", icon: Home, label: "Properties" },
              { id: "blogs", icon: FileText, label: "Blog Posts" },
              { id: "gallery", icon: ImageIcon, label: "Gallery" },
              { id: "testimonials", icon: Users, label: "Testimonials" },
              { id: "partners", icon: Users, label: "Partners" },
              { id: "bookings", icon: Calendar, label: "Bookings" },
              { id: "contacts", icon: MessageSquare, label: "Contacts" },
              { id: "faqs", icon: MessageSquare, label: "FAQs" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-[#D4AF37] text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="font-display text-3xl font-bold text-[#1a2332] mb-2">
                {activeTab === "dashboard" && "Dashboard Overview"}
                {activeTab === "properties" && "Manage Properties"}
                {activeTab === "blogs" && "Blog Management"}
                {activeTab === "gallery" && "Gallery Management"}
                {activeTab === "testimonials" && "Testimonials"}
                {activeTab === "partners" && "Partners"}
                {activeTab === "bookings" && "Consultation Bookings"}
                {activeTab === "contacts" && "Contact Submissions"}
                {activeTab === "faqs" && "FAQs Management"}
              </h1>
              <p className="text-gray-600">Welcome back, {session.user.name || session.user.email}</p>
            </div>
            
            {/* Add New Button */}
            {activeTab !== "dashboard" && activeTab !== "contacts" && (
              <Button
                onClick={() => handleAdd(activeTab)}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            )}
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                      <p className="font-display text-3xl font-bold text-[#1a2332]">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-lg mb-4">Blog Posts</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Total: {stats?.totalBlogPosts || 0}</p>
                    <p className="text-sm text-gray-600">Published: {stats?.publishedBlogPosts || 0}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-lg mb-4">Bookings</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Pending: {stats?.pendingBookings || 0}</p>
                    <p className="text-sm text-gray-600">Confirmed: {stats?.confirmedBookings || 0}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-lg mb-4">Contacts</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Unread: {stats?.unreadContacts || 0}</p>
                    <p className="text-sm text-gray-600">Total: {stats?.totalContacts || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Management */}
          {activeTab === "properties" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{property.title}</td>
                            <td className="py-3 px-4">{property.location}</td>
                            <td className="py-3 px-4 font-semibold text-[#D4AF37]">{property.price}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                property.status === "Active" 
                                  ? "bg-green-100 text-green-800" 
                                  : property.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {property.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleEdit(property, "properties")}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(property.id, "properties")}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Blog Posts Management */}
          {activeTab === "blogs" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{post.title}</td>
                          <td className="py-3 px-4">{post.author}</td>
                          <td className="py-3 px-4">{post.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              post.published 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(post, "blogs")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(post.id, "blogs")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Management */}
          {activeTab === "testimonials" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{testimonial.name}</td>
                          <td className="py-3 px-4">{testimonial.role}</td>
                          <td className="py-3 px-4">{"⭐".repeat(testimonial.rating)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(testimonial, "testimonials")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(testimonial.id, "testimonials")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Partners Management */}
          {activeTab === "partners" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Website</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partners.map((partner) => (
                        <tr key={partner.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{partner.name}</td>
                          <td className="py-3 px-4">{partner.website || "N/A"}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(partner, "partners")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(partner.id, "partners")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bookings Management */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Property Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {booking.name}
                              {booking.googleCalendarEventId && (
                                  <CalendarCheck className="w-4 h-4 text-green-600" role="img" aria-label="Google Calendar event created" />
                                )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{booking.email}</td>
                          <td className="py-3 px-4 text-sm">{booking.phone}</td>
                          <td className="py-3 px-4 text-sm">
                            <div>{booking.date}</div>
                            <div className="text-gray-500">{booking.time}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">{booking.propertyType || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-none ${
                                booking.status === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : booking.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(booking, "bookings")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(booking.id, "bookings")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Contacts Management */}
          {activeTab === "contacts" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{contact.name}</td>
                          <td className="py-3 px-4">{contact.email}</td>
                          <td className="py-3 px-4">{contact.phone}</td>
                          <td className="py-3 px-4">{contact.subject}</td>
                          <td className="py-3 px-4">
                            <select
                              value={contact.status}
                              onChange={(e) => handleUpdateContactStatus(contact.id, e.target.value)}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 border-none"
                            >
                              <option value="Unread">Unread</option>
                              <option value="Read">Read</option>
                              <option value="Responded">Responded</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleViewMessage(contact.message)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View message"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(contact.id, "contacts")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* FAQs Management */}
          {activeTab === "faqs" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Question</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map((faq) => (
                        <tr key={faq.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{faq.question}</td>
                          <td className="py-3 px-4">{faq.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              faq.published 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {faq.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleEdit(faq, "faqs")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button 
                                onClick={() => handleDelete(faq.id, "faqs")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gallery Management */}
          {activeTab === "gallery" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(item, "gallery")}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, "gallery")}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-display text-2xl font-bold text-[#1a2332]">
                {editType === "view-message" 
                  ? "View Message" 
                  : isCreating 
                    ? `Add New ${editType.slice(0, -1).charAt(0).toUpperCase() + editType.slice(1, -1)}` 
                    : `Edit ${editType.slice(0, -1).charAt(0).toUpperCase() + editType.slice(1, -1)}`}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setIsCreating(false);
                  setEditingItem(null);
                }} 
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {editType === "view-message" ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{editingItem?.message}</p>
                </div>
              ) : (
                <EditForm 
                  item={editingItem} 
                  type={editType} 
                  onChange={setEditingItem}
                  onSave={handleSaveEdit}
                  onCancel={() => {
                    setShowModal(false);
                    setIsCreating(false);
                    setEditingItem(null);
                  }}
                  isCreating={isCreating}
                  isSaving={isSaving}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Edit Form Component
function EditForm({ item, type, onChange, onSave, onCancel, isCreating, isSaving }: any) {
  if (!item) return null;

  const handleChange = (field: string, value: any) => {
    onChange({ ...item, [field]: value });
  };

  // Handle adding a new image URL to the images array
  const handleAddImage = () => {
    const images = item.images || [];
    onChange({ ...item, images: [...images, ""] });
  };

  // Handle removing an image URL from the images array
  const handleRemoveImage = (index: number) => {
    const images = item.images || [];
    const newImages = images.filter((_: any, i: number) => i !== index);
    onChange({ ...item, images: newImages });
  };

  // Handle updating a specific image URL in the images array
  const handleImageChange = (index: number, value: string) => {
    const images = item.images || [];
    const newImages = [...images];
    newImages[index] = value;
    onChange({ ...item, images: newImages });
  };

  return (
    <div className="space-y-4">
      {/* Properties Form */}
      {type === "properties" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={item.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="text"
              value={item.price || ""}
              onChange={(e) => handleChange("price", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                value={item.bedrooms || 0}
                onChange={(e) => handleChange("bedrooms", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                value={item.bathrooms || 0}
                onChange={(e) => handleChange("bathrooms", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
            <input
              type="text"
              value={item.area || ""}
              onChange={(e) => handleChange("area", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={item.type || "Residential"}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={item.category || "Sale"}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={item.status || "Active"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Image URL (Featured)</label>
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://example.com/primary-image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          
          {/* Multiple Images Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Additional Images (Gallery)</label>
              <Button
                type="button"
                onClick={handleAddImage}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white text-xs px-3 py-1"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Image
              </Button>
            </div>
            <div className="space-y-2">
              {(item.images || []).map((img: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`https://example.com/image-${index + 1}.jpg`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    variant="outline"
                    className="px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!item.images || item.images.length === 0) && (
                <p className="text-sm text-gray-500 italic">No additional images. Click "Add Image" to add gallery images.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={item.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.featured || false}
                onChange={(e) => handleChange("featured", e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm font-medium text-gray-700">Featured Property</span>
            </label>
          </div>
        </>
      )}

      {/* Blog Posts Form */}
      {type === "blogs" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
            <input
              type="text"
              value={item.author || ""}
              onChange={(e) => handleChange("author", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={item.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
              <input
                type="text"
                value={item.readTime || ""}
                onChange={(e) => handleChange("readTime", e.target.value)}
                placeholder="e.g., 5 min read"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://example.com/blog-image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={item.excerpt || ""}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={item.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.published || false}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
        </>
      )}

      {/* Testimonials Form */}
      {type === "testimonials" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={item.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={item.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://example.com/testimonial-image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={item.rating || 5}
              onChange={(e) => handleChange("rating", parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={item.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
        </>
      )}

      {/* Partners Form */}
      {type === "partners" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={item.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="text"
              value={item.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="text"
              value={item.logo || ""}
              onChange={(e) => handleChange("logo", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
        </>
      )}

      {/* Bookings Form */}
      {type === "bookings" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={item.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={item.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={item.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={item.date || ""}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <select
                value={item.time || ""}
                onChange={(e) => handleChange("time", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={item.propertyType || ""}
                onChange={(e) => handleChange("propertyType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="estate">Estate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
              <select
                value={item.budget || ""}
                onChange={(e) => handleChange("budget", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select budget</option>
                <option value="$0 - $5M">$0 - $5M</option>
                <option value="$5M - $10M">$5M - $10M</option>
                <option value="$10M - $20M">$10M - $20M</option>
                <option value="$20M+">$20M+</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
            <input
              type="text"
              value={item.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, State, or Region"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={item.message || ""}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={3}
              placeholder="Client's message or requirements"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
            <textarea
              value={item.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={2}
              placeholder="Internal notes (not visible to client)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={item.status || "Pending"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              💡 Setting status to "Confirmed" will automatically create a Google Calendar event (if configured)
            </p>
          </div>
          {item.googleCalendarEventId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CalendarCheck className="w-4 h-4" />
                <span className="font-medium">Google Calendar Event Created</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Event ID: {item.googleCalendarEventId}</p>
            </div>
          )}
        </>
      )}

      {/* FAQs Form */}
      {type === "faqs" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <input
              type="text"
              value={item.question || ""}
              onChange={(e) => handleChange("question", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={item.answer || ""}
              onChange={(e) => handleChange("answer", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={item.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.published || false}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
        </>
      )}

      {/* Gallery Form */}
      {type === "gallery" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={item.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={item.image || ""}
              onChange={(e) => handleChange("image", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={item.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={item.published || false}
                onChange={(e) => handleChange("published", e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          onClick={onCancel}
          variant="outline"
          className="px-6"
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="px-6 bg-[#D4AF37] hover:bg-[#B8941F] text-white"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isCreating ? "Creating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? "Create" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}