
// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { 
//   ShoppingCart, 
//   Search, 
//   User, 
//   LogOut, 
//   Package, 
//   Clock, 
//   Star, 
//   Sparkles, 
//   TrendingUp, 
//   Menu, 
//   X,
//   Plus,
//   Minus,
//   Heart,

//   MapPin,
//   Phone,
//   Shield,
//   Truck,
//   Clock4,
//   ThumbsUp,
//   Filter,
//   SlidersHorizontal,
//   BarChart3,

//   DollarSign,
//   ShoppingBag,
//   Eye,
//   Edit,
//   Trash2,
//   Upload,

// } from 'lucide-react';


// // ============================================================================
// // TYPES
// // ============================================================================

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'customer' | 'admin' | 'delivery';
//   address?: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   description?: string;
//   price: number;
//   category: string;
//   imageUrls: string[];
//   isAvailable: boolean;
//   rating: number;
//   preparationTime?: number;
//   ingredients?: string[];
//   spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Very Spicy';
// }

// interface OrderItem {
//   productId: string;
//   quantity: number;
//   price: number;
//   product?: Product;
// }

// interface Order {
//   _id: string;
//   userId: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: string;
//   deliveryAddress: string;
//   estimatedDeliveryTime?: string;
//   createdAt: string;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, address?: string) => Promise<void>;
//   logout: () => void;
// }

// interface Recommendation {
//   productId: string;
//   name: string;
//   score: number;
//   product: Product;
// }
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'customer' | 'admin' | 'delivery';
//   address?: string;
//   createdAt?: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   description?: string;
//   price: number;
//   category: string;
//   imageUrls: string[];
//   isAvailable: boolean;
//   rating: number;
//   preparationTime?: number;
//   ingredients?: string[];
//   spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Very Spicy';
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface OrderItem {
//   productId: string;
//   quantity: number;
//   price: number;
//   product?: Product;
// }

// interface Order {
//   _id: string;
//   userId: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: string;
//   deliveryAddress: string;
//   estimatedDeliveryTime?: string;
//   createdAt: string;
//   user?: User;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, address?: string) => Promise<void>;
//   logout: () => void;
// }

// interface Recommendation {
//   productId: string;
//   name: string;
//   score: number;
//   product: Product;
// }

// interface DashboardStats {
//   totalOrders: number;
//   totalRevenue: number;
//   totalUsers: number;
//   totalProducts: number;
//   monthlyRevenue: number;
//   pendingOrders: number;
// }

// // ============================================================================
// // API SERVICE
// // ============================================================================

// const API_BASE = 'http://localhost:3000/api';

// const api = {
//   async request(endpoint: string, options: RequestInit = {}) {
//     const token = localStorage.getItem('token');
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     const response = await fetch(`${API_BASE}${endpoint}`, {
//       ...options,
//       headers,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Request failed');
//     }

//     return response.json();
//   },

//   // Auth
//   login: (email: string, password: string) =>
//     api.request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     }),

//   register: (name: string, email: string, password: string, address?: string) =>
//     api.request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify({ name, email, password, address }),
//     }),

//   // Products
//   getProducts: () => api.request('/products'),
//   getProduct: (id: string) => api.request(`/products/${id}`),

//   // Orders
//   createOrder: (items: { productId: string; quantity: number }[], deliveryAddress?: string) =>
//     api.request('/orders', {
//       method: 'POST',
//       body: JSON.stringify({ items, deliveryAddress }),
//     }),

//       // Admin Orders
//   getAllOrders: () => api.request('/admin/orders'),
//   getAdminOrder: (id: string) => api.request(`/admin/orders/${id}`),
//   updateOrderStatus: (id: string, status: string) =>
//     api.request(`/admin/orders/${id}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     }),

//   // Admin Products (add these too)
//   createProduct: (productData: FormData) => 
//     api.request('/products', {
//       method: 'POST',
//       body: productData,
//     }),
//   updateProduct: (id: string, productData: FormData) =>
//     api.request(`/products/${id}`, {
//       method: 'PUT',
//       body: productData,
//     }),
//   deleteProduct: (id: string) =>
//     api.request(`/products/${id}`, {
//       method: 'DELETE',
//     }),
//   getOrders: () => api.request('/orders'),
//   getOrder: (id: string) => api.request(`/orders/${id}`),

//    // Admin
//   getDashboardStats: () => api.request('/metrics'),
//   getUsers: () => api.request('/admin/users'),
//   getAllOrders: () => api.request('/admin/orders'),

//     generateEmbeddings: () => 
//     api.request('/ai/generate-all-embeddings', {
//       method: 'POST',
//     }),
//   // AI Features

//   getRecommendations: (query?: string, limit?: number) => {
//     const params = new URLSearchParams();
//     if (query) params.append('query', query);
//     if (limit) params.append('limit', limit.toString());
//     return api.request(`/ai/recommendations?${params}`);
//   },

// };

// // ============================================================================
// // CONTEXT
// // ============================================================================

// const AuthContext = createContext<AuthContextType | null>(null);

// const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   const login = async (email: string, password: string) => {
//     const data = await api.login(email, password);
//     setToken(data.accessToken);
//     setUser(data.user);
//     localStorage.setItem('token', data.accessToken);
//     localStorage.setItem('user', JSON.stringify(data.user));
//   };

//   const register = async (name: string, email: string, password: string, address?: string) => {
//     await api.register(name, email, password, address);
//     await login(email, password);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// // ============================================================================
// // ADMIN COMPONENTS
// // ============================================================================

// const AdminDashboard: React.FC = () => {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalOrders: 0,
//     totalRevenue: 0,
//     totalUsers: 0,
//     totalProducts: 0,
//     monthlyRevenue: 0,
//     pendingOrders: 0
//   });
//   const [recentOrders, setRecentOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // In a real app, you'd have proper admin endpoints
//       const [productsData, ordersData] = await Promise.all([
//         api.getProducts(),
//         api.getAllOrders?.() || api.getOrders()
//       ]);

//       const products = productsData.products || [];
//       const orders = ordersData.orders || [];

//       const dashboardStats: DashboardStats = {
//         totalOrders: orders.length,
//         totalRevenue: orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
//         totalUsers: 0, // You'd get this from users endpoint
//         totalProducts: products.length,
//         monthlyRevenue: orders
//           .filter((order: Order) => {
//             const orderDate = new Date(order.createdAt);
//             const currentMonth = new Date().getMonth();
//             return orderDate.getMonth() === currentMonth;
//           })
//           .reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
//         pendingOrders: orders.filter((order: Order) => 
//           ['PLACED', 'CONFIRMED', 'PREPARING'].includes(order.status)
//         ).length
//       };

//       setStats(dashboardStats);
//       setRecentOrders(orders.slice(0, 5));
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> = 
//     ({ title, value, icon, trend }) => (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
//           {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
//         </div>
//         <div className="p-3 bg-red-50 rounded-xl">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage your restaurant operations</p>
//         </div>
//         <button
//           onClick={() => api.generateEmbeddings()}
//           className="bg-linear-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition shadow-lg shadow-purple-500/25 flex items-center gap-2"
//         >
//           <Sparkles className="w-5 h-5" />
//           Generate AI Embeddings
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard
//           title="Total Revenue"
//           value={`₹${stats.totalRevenue.toLocaleString()}`}
//           icon={<DollarSign className="w-6 h-6 text-red-500" />}
//           trend="+12% this month"
//         />
//         <StatCard
//           title="Total Orders"
//           value={stats.totalOrders}
//           icon={<ShoppingBag className="w-6 h-6 text-red-500" />}
//           trend="+8% this month"
//         />
//         <StatCard
//           title="Total Products"
//           value={stats.totalProducts}
//           icon={<Package className="w-6 h-6 text-red-500" />}
//         />
//         <StatCard
//           title="Pending Orders"
//           value={stats.pendingOrders}
//           icon={<Clock className="w-6 h-6 text-red-500" />}
//         />
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
//         </div>
//         <div className="p-6">
//           {recentOrders.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No orders found
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
//                   <div>
//                     <p className="font-semibold">Order #{order._id.slice(-8)}</p>
//                     <p className="text-sm text-gray-600">
//                       {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
//                       order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {order.status}
//                     </span>
//                     <button className="text-blue-600 hover:text-blue-800">
//                       <Eye className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductManagement: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showProductForm, setShowProductForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const data = await api.getProducts();
//       setProducts(data.products || []);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProduct = async (productId: string) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await api.deleteProduct(productId);
//       setProducts(products.filter(p => p._id !== productId));
//     } catch (error) {
//       alert('Failed to delete product');
//     }
//   };

//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//     setShowProductForm(true);
//   };

//   const ProductForm: React.FC<{ 
//     product?: Product; 
//     onSave: () => void; 
//     onCancel: () => void; 
//   }> = ({ product, onSave, onCancel }) => {
//     const [formData, setFormData] = useState({
//       name: product?.name || '',
//       description: product?.description || '',
//       price: product?.price || 0,
//       category: product?.category || '',
//       preparationTime: product?.preparationTime || 30,
//       spiceLevel: product?.spiceLevel || 'Medium',
//       ingredients: product?.ingredients?.join(', ') || '',
//       isAvailable: product?.isAvailable ?? true
//     });
//     const [images, setImages] = useState<File[]>([]);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setLoading(true);

//       try {
//         const formDataToSend = new FormData();
//         formDataToSend.append('name', formData.name);
//         formDataToSend.append('description', formData.description);
//         formDataToSend.append('price', formData.price.toString());
//         formDataToSend.append('category', formData.category);
//         formDataToSend.append('preparationTime', formData.preparationTime.toString());
//         formDataToSend.append('spiceLevel', formData.spiceLevel);
//         formDataToSend.append('ingredients', formData.ingredients);
//         formDataToSend.append('isAvailable', formData.isAvailable.toString());

//         images.forEach(image => {
//           formDataToSend.append('images', image);
//         });

//         if (product) {
//           await api.updateProduct(product._id, formDataToSend);
//         } else {
//           await api.createProduct(formDataToSend);
//         }

//         onSave();
//         setShowProductForm(false);
//         setEditingProduct(null);
//         fetchProducts();
//       } catch (error) {
//         alert('Failed to save product');
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6 border-b">
//             <h2 className="text-2xl font-bold">
//               {product ? 'Edit Product' : 'Add New Product'}
//             </h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
//                 <input
//                   type="number"
//                   required
//                   min="0"
//                   step="0.01"
//                   value={formData.price}
//                   onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (min)</label>
//                 <input
//                   type="number"
//                   required
//                   min="1"
//                   value={formData.preparationTime}
//                   onChange={(e) => setFormData({...formData, preparationTime: parseInt(e.target.value)})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
//                 <select
//                   value={formData.spiceLevel}
//                   onChange={(e) => setFormData({...formData, spiceLevel: e.target.value as any})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 >
//                   <option value="Mild">Mild</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Spicy">Spicy</option>
//                   <option value="Very Spicy">Very Spicy</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
//                 <select
//                   value={formData.isAvailable.toString()}
//                   onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'true'})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                 >
//                   <option value="true">Available</option>
//                   <option value="false">Unavailable</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 rows={3}
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (comma separated)</label>
//               <input
//                 type="text"
//                 value={formData.ingredients}
//                 onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
//                 placeholder="Tomato, Cheese, Basil, ..."
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images {!product && <span className="text-red-500">*</span>}
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
//                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-gray-600 mb-2">
//                   Upload at least 3 product images
//                 </p>
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => setImages(Array.from(e.target.files || []))}
//                   className="hidden"
//                   id="product-images"
//                 />
//                 <label
//                   htmlFor="product-images"
//                   className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer inline-block"
//                 >
//                   Choose Images
//                 </label>
//                 {images.length > 0 && (
//                   <p className="text-sm text-green-600 mt-2">
//                     {images.length} image(s) selected
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex gap-3 justify-end pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-red-500 hover:text-red-500 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 disabled:bg-gray-400 transition font-semibold"
//               >
//                 {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
//           <p className="text-gray-600 mt-2">Manage your menu items</p>
//         </div>
//         <button
//           onClick={() => setShowProductForm(true)}
//           className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition font-semibold flex items-center gap-2"
//         >
//           <Plus className="w-5 h-5" />
//           Add Product
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">All Products ({products.length})</h2>
//         </div>
//         <div className="p-6">
//           {products.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p>No products found</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {products.map((product) => (
//                 <div key={product._id} className="border border-gray-200 rounded-xl p-4">
//                   <img
//                     src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'}
//                     alt={product.name}
//                     className="w-full h-40 object-cover rounded-lg mb-4"
//                   />
//                   <div className="space-y-2">
//                     <h3 className="font-bold text-lg">{product.name}</h3>
//                     <p className="text-gray-600">₹{product.price} • {product.category}</p>
//                     <div className="flex items-center justify-between">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         product.isAvailable 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {product.isAvailable ? 'Available' : 'Unavailable'}
//                       </span>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEditProduct(product)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProduct(product._id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {showProductForm && (
//         <ProductForm
//           product={editingProduct || undefined}
//           onSave={() => {
//             setShowProductForm(false);
//             setEditingProduct(null);
//             fetchProducts();
//           }}
//           onCancel={() => {
//             setShowProductForm(false);
//             setEditingProduct(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// const OrderManagement: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//  const fetchOrders = async () => {
//     try {
//       const data = await api.getAllOrders(); // ✅ Now this endpoint exists
//       setOrders(data.orders || []);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//       // Fallback to regular orders if admin endpoint fails
//       try {
//         const customerData = await api.getOrders();
//         setOrders(customerData.orders || []);
//       } catch (fallbackError) {
//         console.error('Fallback also failed:', fallbackError);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//  const updateOrderStatus = async (orderId: string, status: string) => {
//     try {
//       await api.updateOrderStatus(orderId, status); // ✅ Now this endpoint exists
//       fetchOrders(); // Refresh orders
//     } catch (error) {
//       alert('Failed to update order status');
//     }
//   };

//   const statusOptions = ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'DELIVERED', 'CANCELLED'];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
//         <p className="text-gray-600 mt-2">Manage and track all orders</p>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">All Orders ({orders.length})</h2>
//         </div>
//         <div className="p-6">
//           {orders.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p>No orders found</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {orders.map((order) => (
//                 <div key={order._id} className="border border-gray-200 rounded-xl p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="font-bold text-lg">Order #{order._id.slice(-8)}</h3>
//                       <p className="text-gray-600">
//                         {new Date(order.createdAt).toLocaleString()} • ₹{order.totalAmount}
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">{order.deliveryAddress}</p>
//                     </div>
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                     >
//                       {statusOptions.map(status => (
//                         <option key={status} value={status}>
//                           {status.replace('_', ' ')}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="border-t pt-4">
//                     <h4 className="font-semibold mb-2">Items:</h4>
//                     <div className="space-y-2">
//                       {order.items.map((item, index) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{item.product?.name || `Product ${item.productId}`}</span>
//                           <span>₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // COMPONENTS
// // ============================================================================

// const LoginForm: React.FC<{ onSuccess: () => void; onSwitchToRegister: () => void }> = ({ onSuccess, onSwitchToRegister }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await login(email, password);
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
//         <p className="text-gray-600">Sign in to your account</p>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
//             <Shield className="w-5 h-5 mr-2" />
//             {error}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center">
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//               Signing in...
//             </div>
//           ) : (
//             'Sign In'
//           )}
//         </button>

//         <div className="text-center">
//           <button
//             type="button"
//             onClick={onSwitchToRegister}
//             className="text-red-500 hover:text-red-600 font-medium"
//           >
//             Don't have an account? Sign up
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const RegisterForm: React.FC<{ onSuccess: () => void; onSwitchToLogin: () => void }> = ({ onSuccess, onSwitchToLogin }) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await register(name, email, password, address);
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
//         <p className="text-gray-600">Join us today</p>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
//             <Shield className="w-5 h-5 mr-2" />
//             {error}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//           <input
//             type="text"
//             placeholder="Enter your full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             placeholder="Create a password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Delivery Address <span className="text-gray-400">(Optional)</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter your delivery address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
//         >
//           {loading ? (
//             <div className="flex items-center justify-center">
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//               Creating account...
//             </div>
//           ) : (
//             'Create Account'
//           )}
//         </button>

//         <div className="text-center">
//           <button
//             type="button"
//             onClick={onSwitchToLogin}
//             className="text-red-500 hover:text-red-600 font-medium"
//           >
//             Already have an account? Sign in
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const ProductCard: React.FC<{ 
//   product: Product; 
//   onAddToCart: (product: Product) => void;
//   onViewDetails: (product: Product) => void;
// }> = ({ product, onAddToCart, onViewDetails }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const spiceLevelColors = {
//     'Mild': 'bg-green-100 text-green-800',
//     'Medium': 'bg-yellow-100 text-yellow-800',
//     'Spicy': 'bg-orange-100 text-orange-800',
//     'Very Spicy': 'bg-red-100 text-red-800'
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-100 group">
//       <div className="relative overflow-hidden">
//         <img
//           src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'}
//           alt={product.name}
//           className={`w-full h-48 object-cover transition duration-500 group-hover:scale-105 ${
//             imageLoaded ? 'opacity-100' : 'opacity-0'
//           }`}
//           onLoad={() => setImageLoaded(true)}
//         />
//         {!imageLoaded && (
//           <div className="absolute inset-0 bg-gray-200 animate-pulse" />
//         )}

//         {/* Favorite Button */}
//         <button
//           onClick={() => setIsFavorite(!isFavorite)}
//           className={`absolute top-3 right-3 p-2 rounded-full transition ${
//             isFavorite 
//               ? 'bg-red-500 text-white' 
//               : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
//           }`}
//         >
//           <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
//         </button>

//         {/* Rating Badge */}
//         <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//           <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//           {product.rating.toFixed(1)}
//         </div>

//         {/* Spice Level */}
//         {product.spiceLevel && (
//           <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${spiceLevelColors[product.spiceLevel]}`}>
//             {product.spiceLevel}
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
//           <span className="text-lg font-bold text-red-500">₹{product.price}</span>
//         </div>

//         <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>

//         {product.description && (
//           <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
//         )}

//         {product.preparationTime && (
//           <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
//             <Clock4 className="w-3 h-3" />
//             {product.preparationTime} min
//           </div>
//         )}

//         <div className="flex gap-2">
//           <button
//             onClick={() => onViewDetails(product)}
//             className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition font-medium"
//           >
//             View Details
//           </button>
//           <button
//             onClick={() => onAddToCart(product)}
//             disabled={!product.isAvailable}
//             className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductModal: React.FC<{
//   product: Product | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onAddToCart: (product: Product) => void;
// }> = ({ product, isOpen, onClose, onAddToCart }) => {
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);

//   if (!isOpen || !product) return null;

//   const spiceLevelColors = {
//     'Mild': 'bg-green-100 text-green-800 border-green-200',
//     'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     'Spicy': 'bg-orange-100 text-orange-800 border-orange-200',
//     'Very Spicy': 'bg-red-100 text-red-800 border-red-200'
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="relative">
//           {/* Header */}
//           <div className="flex justify-between items-center p-6 border-b">
//             <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg transition"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Images */}
//               <div className="space-y-4">
//                 <div className="rounded-xl overflow-hidden bg-gray-100">
//                   <img
//                     src={product.imageUrls[selectedImage] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'}
//                     alt={product.name}
//                     className="w-full h-80 object-cover"
//                   />
//                 </div>
//                 <div className="flex gap-2 overflow-x-auto">
//                   {product.imageUrls.map((url, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSelectedImage(index)}
//                       className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
//                         selectedImage === index ? 'border-red-500' : 'border-gray-200'
//                       }`}
//                     >
//                       <img
//                         src={url}
//                         alt={`${product.name} ${index + 1}`}
//                         className="w-full h-full object-cover"
//                       />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Details */}
//               <div className="space-y-6">
//                 {/* Price and Rating */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-3xl font-bold text-red-500">₹{product.price}</span>
//                   <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
//                     <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                     <span className="font-semibold">{product.rating.toFixed(1)}</span>
//                   </div>
//                 </div>

//                 {/* Category and Spice Level */}
//                 <div className="flex gap-3">
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
//                     {product.category}
//                   </span>
//                   {product.spiceLevel && (
//                     <span className={`border px-3 py-1 rounded-full text-sm font-medium ${spiceLevelColors[product.spiceLevel]}`}>
//                       {product.spiceLevel}
//                     </span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {product.description && (
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-600 leading-relaxed">{product.description}</p>
//                   </div>
//                 )}

//                 {/* Ingredients */}
//                 {product.ingredients && product.ingredients.length > 0 && (
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {product.ingredients.map((ingredient, index) => (
//                         <span
//                           key={index}
//                           className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
//                         >
//                           {ingredient}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Preparation Time */}
//                 {product.preparationTime && (
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock4 className="w-5 h-5" />
//                     <span>Preparation time: {product.preparationTime} minutes</span>
//                   </div>
//                 )}

//                 {/* Quantity Selector */}
//                 <div className="flex items-center gap-4">
//                   <span className="font-semibold text-gray-700">Quantity:</span>
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                     <span className="text-lg font-bold w-8 text-center">{quantity}</span>
//                     <button
//                       onClick={() => setQuantity(quantity + 1)}
//                       className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                     >
//                       <Plus className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button
//                   onClick={() => {
//                     for (let i = 0; i < quantity; i++) {
//                       onAddToCart(product);
//                     }
//                     onClose();
//                   }}
//                   disabled={!product.isAvailable}
//                   className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-bold text-lg shadow-lg shadow-red-500/25 flex items-center justify-center gap-3"
//                 >
//                   <ShoppingCart className="w-6 h-6" />
//                   Add {quantity} to Cart - ₹{(product.price * quantity).toFixed(2)}
//                 </button>

//                 {/* Features */}
//                 <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Truck className="w-4 h-4 text-green-500" />
//                     Free delivery
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-gray-600">
//                     <Shield className="w-4 h-4 text-blue-500" />
//                     Food safety
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Cart: React.FC<{
//   items: CartItem[];
//   onUpdateQuantity: (id: string, quantity: number) => void;
//   onCheckout: () => void;
//   onContinueShopping: () => void;
// }> = ({ items, onUpdateQuantity, onCheckout, onContinueShopping }) => {
//   const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const deliveryFee = total > 299 ? 0 : 40;
//   const tax = total * 0.05;
//   const finalTotal = total + deliveryFee + tax;

//   if (items.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
//         <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
//         <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
//         <button
//           onClick={onContinueShopping}
//           className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
//         >
//           Start Ordering
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
//         <span className="text-gray-600">{items.length} items</span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           {items.map((item) => (
//             <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="flex gap-4">
//                 <img
//                   src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop'}
//                   alt={item.name}
//                   className="w-20 h-20 object-cover rounded-xl"
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
//                     <span className="text-lg font-bold text-red-500">₹{item.price}</span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-3 capitalize">{item.category}</p>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
//                         className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                       >
//                         <Minus className="w-3 h-3" />
//                       </button>
//                       <span className="font-bold w-8 text-center">{item.quantity}</span>
//                       <button
//                         onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
//                         className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                       >
//                         <Plus className="w-3 h-3" />
//                       </button>
//                     </div>
//                     <span className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
//             <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

//             <div className="space-y-3 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>₹{total.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Delivery Fee</span>
//                 <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax (5%)</span>
//                 <span>₹{tax.toFixed(2)}</span>
//               </div>
//               {deliveryFee > 0 && total < 299 && (
//                 <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
//                   Add ₹{(299 - total).toFixed(2)} more for free delivery!
//                 </div>
//               )}
//             </div>

//             <div className="border-t pt-4 mb-6">
//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span className="text-red-500">₹{finalTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             <button
//               onClick={onCheckout}
//               className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 transition font-bold text-lg shadow-lg shadow-red-500/25"
//             >
//               Proceed to Checkout
//             </button>

//             <button
//               onClick={onContinueShopping}
//               className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:border-red-500 hover:text-red-500 transition font-semibold mt-3"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
//   const statusColors: { [key: string]: string } = {
//     PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
//     CONFIRMED: 'bg-purple-100 text-purple-800 border-purple-200',
//     PREPARING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     PICKED_UP: 'bg-orange-100 text-orange-800 border-orange-200',
//     DELIVERED: 'bg-green-100 text-green-800 border-green-200',
//     CANCELLED: 'bg-red-100 text-red-800 border-red-200',
//   };

//   const statusIcons: { [key: string]: React.ReactNode } = {
//     PLACED: <Clock className="w-4 h-4" />,
//     CONFIRMED: <ThumbsUp className="w-4 h-4" />,
//     PREPARING: <Clock4 className="w-4 h-4" />,
//     PICKED_UP: <Truck className="w-4 h-4" />,
//     DELIVERED: <ThumbsUp className="w-4 h-4" />,
//     CANCELLED: <X className="w-4 h-4" />,
//   };

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
//           <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
//         </div>
//         <span className={`${statusColors[order.status]} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border`}>
//           {statusIcons[order.status]}
//           {order.status.replace('_', ' ')}
//         </span>
//       </div>

//       <div className="space-y-3 mb-4">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Items:</span>
//           <span className="font-semibold">{order.items.length}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-gray-600">Total Amount:</span>
//           <span className="font-bold text-red-500 text-lg">₹{order.totalAmount}</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
//         <MapPin className="w-4 h-4" />
//         <span className="flex-1">{order.deliveryAddress}</span>
//       </div>

//       {order.estimatedDeliveryTime && (
//         <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
//           <Clock className="w-4 h-4" />
//           <span>Est. delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const Recommendations: React.FC<{ onAddToCart: (product: Product) => void; onViewDetails: (product: Product) => void }> = ({ onAddToCart, onViewDetails }) => {
//   const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
//   const [query, setQuery] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchRecommendations = async (searchQuery?: string) => {
//     setLoading(true);
//     try {
//       const data = await api.getRecommendations(searchQuery, 6);
//       setRecommendations(data.recommendations || []);
//     } catch (err) {
//       console.error('Failed to fetch recommendations:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const handleSearch = () => {
//     if (query.trim()) {
//       fetchRecommendations(query);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <div className="flex items-center justify-center gap-3 mb-4">
//           <div className="p-3 bg-yellow-100 rounded-2xl">
//             <Sparkles className="w-8 h-8 text-yellow-600" />
//           </div>
//           <h2 className="text-4xl font-bold text-gray-900">AI Recommendations</h2>
//         </div>
//         <p className="text-gray-600 text-lg">Discover personalized food suggestions powered by AI</p>
//       </div>

//       {/* Search Bar */}
//       <div className="max-w-2xl mx-auto">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             placeholder="Describe what you're craving... (e.g., 'spicy chicken under ₹200')"
//             className="w-full pl-12 pr-32 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
//           />
//           <button
//             onClick={handleSearch}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
//           >
//             Find Food
//           </button>
//         </div>
//       </div>

//       {/* Recommendations Grid */}
//       {loading ? (
//         <div className="text-center py-16">
//           <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
//           <p className="text-gray-600">Finding the perfect recommendations for you...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recommendations.map((rec) => (
//             rec.product && (
//               <div key={rec.productId} className="relative">
//                 <div className="absolute top-4 right-4 z-10 bg-lineart-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
//                   <TrendingUp className="w-3 h-3" />
//                   {(rec.score * 100).toFixed(0)}% Match
//                 </div>
//                 <ProductCard 
//                   product={rec.product} 
//                   onAddToCart={onAddToCart}
//                   onViewDetails={onViewDetails}
//                 />
//               </div>
//             )
//           ))}
//         </div>
//       )}

//       {recommendations.length === 0 && !loading && (
//         <div className="text-center py-16">
//           <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No recommendations yet</h3>
//           <p className="text-gray-600">Try searching for something you're craving!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================================================
// // MAIN APP
// // ============================================================================
// const App: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [view, setView] = useState<'products' | 'cart' | 'orders' | 'recommendations' | 'admin' | 'product-management' | 'order-management'>('products');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

//   const isAdmin = user?.role === 'admin';

//   useEffect(() => {
//     if (user) {
//       fetchProducts();
//       fetchOrders();
//     }
//   }, [user]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const data = await api.getProducts();
//       setProducts(data.products || []);
//     } catch (err) {
//       console.error('Failed to fetch products:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       const data = await api.getOrders();
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error('Failed to fetch orders:', err);
//     }
//   };

//   const addToCart = (product: Product) => {
//     setCart((prev) => {
//       const existing = prev.find((item) => item._id === product._id);
//       if (existing) {
//         return prev.map((item) =>
//           item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity === 0) {
//       setCart((prev) => prev.filter((item) => item._id !== id));
//     } else {
//       setCart((prev) =>
//         prev.map((item) => (item._id === id ? { ...item, quantity } : item))
//       );
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       const items = cart.map((item) => ({
//         productId: item._id,
//         quantity: item.quantity,
//       }));
//       await api.createOrder(items);
//       setCart([]);
//       setView('orders');
//       fetchOrders();
//       alert('Order placed successfully! 🎉');
//     } catch (err) {
//       alert('Failed to place order: ' + (err instanceof Error ? err.message : 'Unknown error'));
//     }
//   };

//   const handleViewDetails = (product: Product) => {
//     setSelectedProduct(product);
//     setIsProductModalOpen(true);
//   };

//   // Get unique categories
//   const categories = ['all', ...new Set(products.map(p => p.category))];

//   // Filter and sort products
//   const filteredProducts = products
//     .filter((p) =>
//       (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (selectedCategory === 'all' || p.category === selectedCategory)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'price':
//           return a.price - b.price;
//         case 'rating':
//           return b.rating - a.rating;
//         default:
//           return a.name.localeCompare(b.name);
//       }
//     });

//   const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   // Admin navigation items
//   const adminNavItems = [
//     { key: 'admin', label: 'Dashboard', icon: BarChart3 },
//     { key: 'product-management', label: 'Products', icon: Package },
//     { key: 'order-management', label: 'Orders', icon: ShoppingBag },
//   ];

//   // Customer navigation items
//   const customerNavItems = [
//     { key: 'products', label: 'Menu', icon: null },
//     { key: 'recommendations', label: 'AI Picks', icon: Sparkles },
//     { key: 'orders', label: 'Orders', icon: Package },
//   ];

//   if (!user) {
//     return (
//       <AuthProvider>
//         <AuthScreen />
//       </AuthProvider>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-linear-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
//                 Zomato Lite
//               </h1>
//               {isAdmin && (
//                 <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
//                   ADMIN
//                 </span>
//               )}
//             </div>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center gap-1">
//               {/* Customer Navigation */}
//               {!isAdmin ? (
//                 <>
//                   {customerNavItems.map(({ key, label, icon: Icon }) => (
//                     <button
//                       key={key}
//                       onClick={() => setView(key as any)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
//                         view === key 
//                           ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
//                           : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
//                       }`}
//                     >
//                       {Icon && <Icon className="w-4 h-4" />}
//                       {label}
//                     </button>
//                   ))}
//                 </>
//               ) : (
//                 // Admin Navigation
//                 <>
//                   {adminNavItems.map(({ key, label, icon: Icon }) => (
//                     <button
//                       key={key}
//                       onClick={() => setView(key as any)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
//                         view === key 
//                           ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
//                           : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
//                       }`}
//                     >
//                       <Icon className="w-4 h-4" />
//                       {label}
//                     </button>
//                   ))}
//                 </>
//               )}

//               {/* Cart Button (only for customers) */}
//               {!isAdmin && (
//                 <button
//                   onClick={() => setView('cart')}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition relative ${
//                     view === 'cart'
//                       ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
//                       : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
//                   }`}
//                 >
//                   <ShoppingCart className="w-5 h-5" />
//                   Cart
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </button>
//               )}
//             </nav>

//             {/* User Menu */}
//             <div className="hidden md:flex items-center gap-4">
//               <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
//                 <User className="w-4 h-4 text-gray-600" />
//                 <span className="font-medium text-gray-700">{user.name}</span>
//                 {isAdmin && (
//                   <Shield className="w-4 h-4 text-red-500" />
//                 )}
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>

//           {/* Mobile Navigation */}
//           {mobileMenuOpen && (
//             <nav className="md:hidden py-4 border-t space-y-2">
//               {/* Customer Mobile Navigation */}
//               {!isAdmin ? (
//                 <>
//                   {[
//                     ...customerNavItems,
//                     { key: 'cart', label: `Cart (${cartItemCount})`, icon: ShoppingCart },
//                   ].map(({ key, label, icon: Icon }) => (
//                     <button
//                       key={key}
//                       onClick={() => { setView(key as any); setMobileMenuOpen(false); }}
//                       className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${
//                         view === key 
//                           ? 'bg-red-500 text-white' 
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       {Icon && <Icon className="w-5 h-5" />}
//                       {label}
//                     </button>
//                   ))}
//                 </>
//               ) : (
//                 // Admin Mobile Navigation
//                 <>
//                   {adminNavItems.map(({ key, label, icon: Icon }) => (
//                     <button
//                       key={key}
//                       onClick={() => { setView(key as any); setMobileMenuOpen(false); }}
//                       className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${
//                         view === key 
//                           ? 'bg-red-500 text-white' 
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       {label}
//                     </button>
//                   ))}
//                 </>
//               )}

//               <div className="border-t pt-4 mt-4">
//                 <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
//                   <User className="w-5 h-5" />
//                   <span className="font-medium">{user.name}</span>
//                   {isAdmin && (
//                     <Shield className="w-4 h-4 text-red-500" />
//                   )}
//                 </div>
//                 <button
//                   onClick={() => { logout(); setMobileMenuOpen(false); }}
//                   className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   Logout
//                 </button>
//               </div>
//             </nav>
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Admin Views */}
//         {isAdmin && (
//           <>
//             {view === 'admin' && <AdminDashboard />}
//             {view === 'product-management' && <ProductManagement />}
//             {view === 'order-management' && <OrderManagement />}
//           </>
//         )}

//         {/* Customer Views */}
//         {!isAdmin && (
//           <>
//             {/* Products View */}
//             {view === 'products' && (
//               <div className="space-y-8">
//                 {/* Hero Section */}
//                 <div className="text-center space-y-4">
//                   <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
//                     Delicious Food, 
//                     <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Delivered</span>
//                   </h1>
//                   <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//                     Discover the best food from top restaurants near you
//                   </p>
//                 </div>

//                 {/* Search and Filters */}
//                 <div className="space-y-4">
//                   {/* Search Bar */}
//                   <div className="relative max-w-2xl mx-auto">
//                     <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="text"
//                       placeholder="Search for dishes, cuisines, or restaurants..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
//                     />
//                   </div>

//                   {/* Filters */}
//                   <div className="flex flex-wrap gap-4 justify-center">
//                     {/* Category Filter */}
//                     <div className="flex items-center gap-2">
//                       <Filter className="w-4 h-4 text-gray-600" />
//                       <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                       >
//                         {categories.map(category => (
//                           <option key={category} value={category}>
//                             {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Sort Filter */}
//                     <div className="flex items-center gap-2">
//                       <SlidersHorizontal className="w-4 h-4 text-gray-600" />
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value as any)}
//                         className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
//                       >
//                         <option value="name">Sort by Name</option>
//                         <option value="price">Sort by Price</option>
//                         <option value="rating">Sort by Rating</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Products Grid */}
//                 {loading ? (
//                   <div className="text-center py-16">
//                     <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
//                     <p className="text-gray-600">Loading delicious options...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex justify-between items-center mb-6">
//                       <h2 className="text-2xl font-bold text-gray-900">
//                         {selectedCategory === 'all' ? 'All Items' : selectedCategory}
//                         <span className="text-gray-500 text-lg ml-2">({filteredProducts.length})</span>
//                       </h2>
//                     </div>

//                     {filteredProducts.length === 0 ? (
//                       <div className="text-center py-16">
//                         <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//                         <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
//                         <p className="text-gray-600">
//                           {searchTerm ? `No results for "${searchTerm}"` : 'No products available in this category'}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredProducts.map((product) => (
//                           <ProductCard 
//                             key={product._id} 
//                             product={product} 
//                             onAddToCart={addToCart}
//                             onViewDetails={handleViewDetails}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Cart View */}
//             {view === 'cart' && (
//               <Cart 
//                 items={cart} 
//                 onUpdateQuantity={updateQuantity} 
//                 onCheckout={handleCheckout}
//                 onContinueShopping={() => setView('products')}
//               />
//             )}

//             {/* Orders View */}
//             {view === 'orders' && (
//               <div className="space-y-8">
//                 <div className="text-center">
//                   <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Orders</h2>
//                   <p className="text-gray-600 text-lg">Track your food journey</p>
//                 </div>

//                 {orders.length === 0 ? (
//                   <div className="text-center py-16">
//                     <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
//                     <p className="text-gray-600 mb-6">Your delicious food adventure awaits!</p>
//                     <button
//                       onClick={() => setView('products')}
//                       className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition font-semibold"
//                     >
//                       Start Ordering
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {orders.map((order) => (
//                       <OrderCard key={order._id} order={order} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Recommendations View */}
//             {view === 'recommendations' && (
//               <Recommendations 
//                 onAddToCart={addToCart}
//                 onViewDetails={handleViewDetails}
//               />
//             )}
//           </>
//         )}
//       </main>

//       {/* Product Modal */}
//       <ProductModal
//         product={selectedProduct}
//         isOpen={isProductModalOpen}
//         onClose={() => {
//           setIsProductModalOpen(false);
//           setSelectedProduct(null);
//         }}
//         onAddToCart={addToCart}
//       />

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-2xl font-bold mb-4">Zomato Lite</h3>
//               <p className="text-gray-400">
//                 Delivering happiness through delicious food experiences.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Company</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">About</a></li>
//                 <li><a href="#" className="hover:text-white transition">Careers</a></li>
//                 <li><a href="#" className="hover:text-white transition">Team</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Contact</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li className="flex items-center gap-2">
//                   <Phone className="w-4 h-4" />
//                   <span>+1 (555) 123-4567</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <MapPin className="w-4 h-4" />
//                   <span>Food Street, Delhi</span>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Legal</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">Terms</a></li>
//                 <li><a href="#" className="hover:text-white transition">Privacy</a></li>
//                 <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//             <p>&copy; 2024 Zomato Lite. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };



// // ============================================================================
// // AUTH SCREEN
// // ============================================================================

// const AuthScreen: React.FC = () => {
//   const [isLogin, setIsLogin] = useState(true);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
//         {/* Left Side - Branding */}
//         <div className="bg-linear-to-br from-red-500 to-orange-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-center">
//           <div className="space-y-6">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
//                 <Sparkles className="w-8 h-8" />
//               </div>
//               <h1 className="text-4xl font-bold">Zomato Lite</h1>
//             </div>
//             <p className="text-xl opacity-90">
//               Discover the best food around you. Order from top restaurants and get it delivered to your doorstep.
//             </p>
//             <div className="space-y-4 mt-8">
//               <div className="flex items-center gap-3 text-white/90">
//                 <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                   <Truck className="w-4 h-4" />
//                 </div>
//                 <span>Fast delivery in 30 minutes</span>
//               </div>
//               <div className="flex items-center gap-3 text-white/90">
//                 <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                   <Shield className="w-4 h-4" />
//                 </div>
//                 <span>100% food safety guaranteed</span>
//               </div>
//               <div className="flex items-center gap-3 text-white/90">
//                 <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                   <Star className="w-4 h-4" />
//                 </div>
//                 <span>Rated 4.8+ by thousands</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Auth Form */}
//         <div className="p-8 lg:p-12 flex items-center justify-center">
//           <div className="w-full max-w-md">
//             {/* Mobile Logo */}
//             <div className="lg:hidden flex items-center gap-3 mb-8">
//               <div className="w-12 h-12 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
//                 <Sparkles className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
//                 Zomato Lite
//               </h1>
//             </div>

//             {isLogin ? (
//               <LoginForm 
//                 onSuccess={() => {}} 
//                 onSwitchToRegister={() => setIsLogin(false)}
//               />
//             ) : (
//               <RegisterForm 
//                 onSuccess={() => {}} 
//                 onSwitchToLogin={() => setIsLogin(true)}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // ROOT
// // ============================================================================

// export default function Root() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }


// *********************************2**************************************

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    ShoppingCart,
    Search,
    User,
    LogOut,
    Package,
    Clock,
    Star,
    Sparkles,
    TrendingUp,
    Menu,
    X,
    Plus,
    Minus,
    Heart,

    MapPin,
    Phone,
    Shield,
    Truck,
    Clock4,
    ThumbsUp,
    Filter,
    SlidersHorizontal,
    BarChart3,

    DollarSign,
    ShoppingBag,
    Eye,
    Edit,
    Trash2,
    Upload,

} from 'lucide-react';


// ============================================================================
// TYPES
// ============================================================================

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'delivery';
    address?: string;
}

interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrls: string[];
    isAvailable: boolean;
    rating: number;
    preparationTime?: number;
    ingredients?: string[];
    spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Very Spicy';
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    createdAt: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, address?: string) => Promise<void>;
    logout: () => void;
}

interface Recommendation {
    productId: string;
    name: string;
    score: number;
    product: Product;
}
interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'delivery';
    address?: string;
    createdAt?: string;
}

interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrls: string[];
    isAvailable: boolean;
    rating: number;
    preparationTime?: number;
    ingredients?: string[];
    spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Very Spicy';
    createdAt?: string;
    updatedAt?: string;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

interface Order {
    _id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    deliveryAddress: string;
    estimatedDeliveryTime?: string;
    createdAt: string;
    user?: User;
}

interface CartItem extends Product {
    quantity: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, address?: string) => Promise<void>;
    logout: () => void;
}

interface Recommendation {
    productId: string;
    name: string;
    score: number;
    product: Product;
}

interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    monthlyRevenue: number;
    pendingOrders: number;
}

// ============================================================================
// API SERVICE
// ============================================================================

const API_BASE = 'http://localhost:3000/api';

export const api = {
    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Request failed');
        }

        return response.json();
    },

    // Auth
    login: (email: string, password: string) =>
        api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    register: (name: string, email: string, password: string, address?: string) =>
        api.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, address }),
        }),


    // Products
    getProducts: () => api.request('/products'),
    getProduct: (id: string) => api.request(`/products/${id}`),

    // Orders
    createOrder: (items: { productId: string; quantity: number }[], deliveryAddress?: string) =>
        api.request('/orders', {
            method: 'POST',
            body: JSON.stringify({ items, deliveryAddress }),
        }),

    // Payment methods
    createPaymentOrder: (orderId: string, amount: number, currency?: string) =>
        api.request('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify({ orderId, amount, currency }),
        }),

    verifyPayment: (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
        api.request('/payments/verify', {
            method: 'POST',
            body: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
        }),
    getPaymentStatus: (orderId: string) => api.request(`/payments/order/${orderId}`)
,
      // Admin Orders
  getAllOrders: () => api.request('/admin/orders'),
    getAdminOrder: (id: string) => api.request(`/admin/orders/${id}`),
    updateOrderStatus: (id: string, status: string) =>
        api.request(`/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    // Admin Products (add these too)
    createProduct: (productData: FormData) =>
        api.request('/products', {
            method: 'POST',
            body: productData,
        }),
    updateProduct: (id: string, productData: FormData) =>
        api.request(`/products/${id}`, {
            method: 'PUT',
            body: productData,
        }),
    deleteProduct: (id: string) =>
        api.request(`/products/${id}`, {
            method: 'DELETE',
        }),
    getOrders: () => api.request('/orders'),
    getOrder: (id: string) => api.request(`/orders/${id}`),

    // Admin
    getDashboardStats: () => api.request('/metrics'),
    getUsers: () => api.request('/admin/users'),
    getAllOrders: () => api.request('/admin/orders'),

    generateEmbeddings: () =>
        api.request('/ai/generate-all-embeddings', {
            method: 'POST',
        }),
    // AI Features

    getRecommendations: (query?: string, limit?: number) => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (limit) params.append('limit', limit.toString());
        return api.request(`/ai/recommendations?${params}`);
    },

};

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (name: string, email: string, password: string, address?: string) => {
        await api.register(name, email, password, address);
        await login(email, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

// ============================================================================
// ADMIN COMPONENTS
// ============================================================================

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        monthlyRevenue: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // In a real app, you'd have proper admin endpoints
            const [productsData, ordersData] = await Promise.all([
                api.getProducts(),
                api.getAllOrders?.() || api.getOrders()
            ]);

            const products = productsData.products || [];
            const orders = ordersData.orders || [];

            const dashboardStats: DashboardStats = {
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
                totalUsers: 0, // You'd get this from users endpoint
                totalProducts: products.length,
                monthlyRevenue: orders
                    .filter((order: Order) => {
                        const orderDate = new Date(order.createdAt);
                        const currentMonth = new Date().getMonth();
                        return orderDate.getMonth() === currentMonth;
                    })
                    .reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
                pendingOrders: orders.filter((order: Order) =>
                    ['PLACED', 'CONFIRMED', 'PREPARING'].includes(order.status)
                ).length
            };

            setStats(dashboardStats);
            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: string }> =
        ({ title, value, icon, trend }) => (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                        {trend && <p className="text-sm text-green-600 mt-1">{trend}</p>}
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                        {icon}
                    </div>
                </div>
            </div>
        );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your restaurant operations</p>
                </div>
                <button
                    onClick={() => api.generateEmbeddings()}
                    className="bg-linear-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    Generate AI Embeddings
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6 text-red-500" />}
                    trend="+12% this month"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingBag className="w-6 h-6 text-red-500" />}
                    trend="+8% this month"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={<Package className="w-6 h-6 text-red-500" />}
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={<Clock className="w-6 h-6 text-red-500" />}
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                </div>
                <div className="p-6">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No orders found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div>
                                        <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.deleteProduct(productId);
            setProducts(products.filter(p => p._id !== productId));
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const ProductForm: React.FC<{
        product?: Product;
        onSave: () => void;
        onCancel: () => void;
    }> = ({ product, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || 0,
            category: product?.category || '',
            preparationTime: product?.preparationTime || 30,
            spiceLevel: product?.spiceLevel || 'Medium',
            ingredients: product?.ingredients?.join(', ') || '',
            isAvailable: product?.isAvailable ?? true
        });
        const [images, setImages] = useState<File[]>([]);
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            try {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('price', formData.price.toString());
                formDataToSend.append('category', formData.category);
                formDataToSend.append('preparationTime', formData.preparationTime.toString());
                formDataToSend.append('spiceLevel', formData.spiceLevel);
                formDataToSend.append('ingredients', formData.ingredients);
                formDataToSend.append('isAvailable', formData.isAvailable.toString());

                images.forEach(image => {
                    formDataToSend.append('images', image);
                });

                if (product) {
                    await api.updateProduct(product._id, formDataToSend);
                } else {
                    await api.createProduct(formDataToSend);
                }

                onSave();
                setShowProductForm(false);
                setEditingProduct(null);
                fetchProducts();
            } catch (error) {
                alert('Failed to save product');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (min)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.preparationTime}
                                    onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                                <select
                                    value={formData.spiceLevel}
                                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as any })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="Mild">Mild</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Spicy">Spicy</option>
                                    <option value="Very Spicy">Very Spicy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <select
                                    value={formData.isAvailable.toString()}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Unavailable</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients (comma separated)</label>
                            <input
                                type="text"
                                value={formData.ingredients}
                                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                placeholder="Tomato, Cheese, Basil, ..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images {!product && <span className="text-red-500">*</span>}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Upload at least 3 product images
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                                    className="hidden"
                                    id="product-images"
                                />
                                <label
                                    htmlFor="product-images"
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer inline-block"
                                >
                                    Choose Images
                                </label>
                                {images.length > 0 && (
                                    <p className="text-sm text-green-600 mt-2">
                                        {images.length} image(s) selected
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-6 border-t">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-red-500 hover:text-red-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 disabled:bg-gray-400 transition font-semibold"
                            >
                                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600 mt-2">Manage your menu items</p>
                </div>
                <button
                    onClick={() => setShowProductForm(true)}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition font-semibold flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">All Products ({products.length})</h2>
                </div>
                <div className="p-6">
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="border border-gray-200 rounded-xl p-4">
                                    <img
                                        src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-gray-600">₹{product.price} • {product.category}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-1 rounded-full text-xs ${product.isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showProductForm && (
                <ProductForm
                    product={editingProduct || undefined}
                    onSave={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                        fetchProducts();
                    }}
                    onCancel={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                    }}
                />
            )}
        </div>
    );
};

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await api.getAllOrders(); // ✅ Now this endpoint exists
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            // Fallback to regular orders if admin endpoint fails
            try {
                const customerData = await api.getOrders();
                setOrders(customerData.orders || []);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };
    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await api.updateOrderStatus(orderId, status); // ✅ Now this endpoint exists
            fetchOrders(); // Refresh orders
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    const statusOptions = ['PLACED', 'CONFIRMED', 'PREPARING', 'PICKED_UP', 'DELIVERED', 'CANCELLED'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-2">Manage and track all orders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">All Orders ({orders.length})</h2>
                </div>
                <div className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>No orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="border border-gray-200 rounded-xl p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">Order #{order._id.slice(-8)}</h3>
                                            <p className="text-gray-600">
                                                {new Date(order.createdAt).toLocaleString()} • ₹{order.totalAmount}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">{order.deliveryAddress}</p>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>
                                                    {status.replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold mb-2">Items:</h4>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span>{item.product?.name || `Product ${item.productId}`}</span>
                                                    <span>₹{item.price} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// COMPONENTS
// ============================================================================

const LoginForm: React.FC<{ onSuccess: () => void; onSwitchToRegister: () => void }> = ({ onSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Signing in...
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

const RegisterForm: React.FC<{ onSuccess: () => void; onSwitchToLogin: () => void }> = ({ onSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password, address);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join us today</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold transition shadow-lg shadow-red-500/25"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating account...
                        </div>
                    ) : (
                        'Create Account'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-red-500 hover:text-red-600 font-medium"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </form>
        </div>
    );
};

const ProductCard: React.FC<{
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}> = ({ product, onAddToCart, onViewDetails }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const spiceLevelColors = {
        'Mild': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'Spicy': 'bg-orange-100 text-orange-800',
        'Very Spicy': 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-100 group">
            <div className="relative overflow-hidden">
                <img
                    src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'}
                    alt={product.name}
                    className={`w-full h-48 object-cover transition duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}

                {/* Favorite Button */}
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition ${isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {product.rating.toFixed(1)}
                </div>

                {/* Spice Level */}
                {product.spiceLevel && (
                    <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${spiceLevelColors[product.spiceLevel]}`}>
                        {product.spiceLevel}
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                    <span className="text-lg font-bold text-red-500">₹{product.price}</span>
                </div>

                <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>

                {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}

                {product.preparationTime && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <Clock4 className="w-3 h-3" />
                        {product.preparationTime} min
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        onClick={() => onViewDetails(product)}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition font-medium"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.isAvailable}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductModal: React.FC<{
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}> = ({ product, isOpen, onClose, onAddToCart }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const spiceLevelColors = {
        'Mild': 'bg-green-100 text-green-800 border-green-200',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Spicy': 'bg-orange-100 text-orange-800 border-orange-200',
        'Very Spicy': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Images */}
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden bg-gray-100">
                                    <img
                                        src={product.imageUrls[selectedImage] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'}
                                        alt={product.name}
                                        className="w-full h-80 object-cover"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.imageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={url}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-6">
                                {/* Price and Rating */}
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-red-500">₹{product.price}</span>
                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{product.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                {/* Category and Spice Level */}
                                <div className="flex gap-3">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                        {product.category}
                                    </span>
                                    {product.spiceLevel && (
                                        <span className={`border px-3 py-1 rounded-full text-sm font-medium ${spiceLevelColors[product.spiceLevel]}`}>
                                            {product.spiceLevel}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                    </div>
                                )}

                                {/* Ingredients */}
                                {product.ingredients && product.ingredients.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.ingredients.map((ingredient, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {ingredient}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Preparation Time */}
                                {product.preparationTime && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock4 className="w-5 h-5" />
                                        <span>Preparation time: {product.preparationTime} minutes</span>
                                    </div>
                                )}

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-gray-700">Quantity:</span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => {
                                        for (let i = 0; i < quantity; i++) {
                                            onAddToCart(product);
                                        }
                                        onClose();
                                    }}
                                    disabled={!product.isAvailable}
                                    className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-bold text-lg shadow-lg shadow-red-500/25 flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Add {quantity} to Cart - ₹{(product.price * quantity).toFixed(2)}
                                </button>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Truck className="w-4 h-4 text-green-500" />
                                        Free delivery
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Shield className="w-4 h-4 text-blue-500" />
                                        Food safety
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// const Cart: React.FC<{
//     items: CartItem[];
//     onUpdateQuantity: (id: string, quantity: number) => void;
//     onCheckout: () => void;
//     onContinueShopping: () => void;
// }> = ({ items, onUpdateQuantity, onCheckout, onContinueShopping }) => {
//     const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     const deliveryFee = total > 299 ? 0 : 40;
//     const tax = total * 0.05;
//     const finalTotal = total + deliveryFee + tax;

//     if (items.length === 0) {
//         return (
//             <div className="text-center py-16">
//                 <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
//                 <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
//                 <button
//                     onClick={onContinueShopping}
//                     className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
//                 >
//                     Start Ordering
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="max-w-4xl mx-auto">
//             <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
//                 <span className="text-gray-600">{items.length} items</span>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Cart Items */}
//                 <div className="lg:col-span-2 space-y-4">
//                     {items.map((item) => (
//                         <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//                             <div className="flex gap-4">
//                                 <img
//                                     src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop'}
//                                     alt={item.name}
//                                     className="w-20 h-20 object-cover rounded-xl"
//                                 />
//                                 <div className="flex-1">
//                                     <div className="flex justify-between items-start mb-2">
//                                         <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
//                                         <span className="text-lg font-bold text-red-500">₹{item.price}</span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mb-3 capitalize">{item.category}</p>

//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center gap-3">
//                                             <button
//                                                 onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
//                                                 className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                                             >
//                                                 <Minus className="w-3 h-3" />
//                                             </button>
//                                             <span className="font-bold w-8 text-center">{item.quantity}</span>
//                                             <button
//                                                 onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
//                                                 className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
//                                             >
//                                                 <Plus className="w-3 h-3" />
//                                             </button>
//                                         </div>
//                                         <span className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Order Summary */}
//                 <div className="lg:col-span-1">
//                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
//                         <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

//                         <div className="space-y-3 mb-6">
//                             <div className="flex justify-between text-gray-600">
//                                 <span>Subtotal</span>
//                                 <span>₹{total.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between text-gray-600">
//                                 <span>Delivery Fee</span>
//                                 <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
//                             </div>
//                             <div className="flex justify-between text-gray-600">
//                                 <span>Tax (5%)</span>
//                                 <span>₹{tax.toFixed(2)}</span>
//                             </div>
//                             {deliveryFee > 0 && total < 299 && (
//                                 <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
//                                     Add ₹{(299 - total).toFixed(2)} more for free delivery!
//                                 </div>
//                             )}
//                         </div>

//                         <div className="border-t pt-4 mb-6">
//                             <div className="flex justify-between text-lg font-bold">
//                                 <span>Total</span>
//                                 <span className="text-red-500">₹{finalTotal.toFixed(2)}</span>
//                             </div>
//                         </div>

//                         <button
//                             onClick={onCheckout}
//                             className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 transition font-bold text-lg shadow-lg shadow-red-500/25"
//                         >
//                             Proceed to Checkout
//                         </button>

//                         <button
//                             onClick={onContinueShopping}
//                             className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:border-red-500 hover:text-red-500 transition font-semibold mt-3"
//                         >
//                             Continue Shopping
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

import {
    CreditCard,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import PaymentButton from './components/PaymentButton';

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onCheckout: (orderId: string) => void;
    onContinueShopping: () => void;
}

const Cart: React.FC<CartProps> = ({
    items,
    onUpdateQuantity,
    onCheckout,
    onContinueShopping
}) => {
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<{ id: string; amount: number } | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = total > 299 ? 0 : 40;
    const tax = total * 0.05;
    const finalTotal = total + deliveryFee + tax;

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const itemsForOrder = items.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
            }));

            const orderData = await api.createOrder(itemsForOrder);
            setCurrentOrder({
                id: orderData.order._id,
                amount: orderData.order.totalAmount,
            });
        } catch (err) {
            alert('Failed to create order: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            setCurrentOrder(null);
            setPaymentSuccess(false);
            onCheckout(currentOrder!.id);
        }, 2000);
    };

    const handlePaymentError = (error: string) => {
        alert('Payment failed: ' + error);
        setCheckoutLoading(false);
    };

    // Payment Success Screen
    if (paymentSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your order has been confirmed and will be delivered soon.
                    </p>
                    <div className="animate-pulse text-sm text-gray-500">
                        Redirecting to orders...
                    </div>
                </div>
            </div>
        );
    }

    // Payment Screen
    if (currentOrder) {
        return (
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => setCurrentOrder(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 mb-6 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                </button>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="text-center mb-6">
                        <CreditCard className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                        <p className="text-gray-600">
                            Please complete the payment to confirm your order
                        </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="font-mono">#{currentOrder.id.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-bold text-red-500">₹{currentOrder.amount}</span>
                            </div>
                        </div>
                    </div>

                    <PaymentButton
                        orderId={currentOrder.id}
                        amount={currentOrder.amount}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />

                    <button
                        onClick={() => setCurrentOrder(null)}
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:border-red-500 hover:text-red-500 transition font-semibold mt-3"
                    >
                        Cancel Payment
                    </button>
                </div>
            </div>
        );
    }

    // Empty Cart
    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
                <button
                    onClick={onContinueShopping}
                    className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
                >
                    Start Ordering
                </button>
            </div>
        );
    }

    // Cart Items
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
                <span className="text-gray-600">{items.length} items</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex gap-4">
                                <img
                                    src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150&h=150&fit=crop'}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                                        <span className="text-lg font-bold text-red-500">₹{item.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 capitalize">{item.category}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))}
                                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            {deliveryFee > 0 && total < 299 && (
                                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                                    Add ₹{(299 - total).toFixed(2)} more for free delivery!
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-red-500">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={checkoutLoading}
                            className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 disabled:bg-gray-300 transition font-bold text-lg shadow-lg shadow-red-500/25 flex items-center justify-center gap-3"
                        >
                            {checkoutLoading ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    Creating Order...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Proceed to Checkout
                                </>
                            )}
                        </button>

                        <button
                            onClick={onContinueShopping}
                            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:border-red-500 hover:text-red-500 transition font-semibold mt-3"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const statusColors: { [key: string]: string } = {
    PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
    CONFIRMED: 'bg-purple-100 text-purple-800 border-purple-200',
    PREPARING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PICKED_UP: 'bg-orange-100 text-orange-800 border-orange-200',
    DELIVERED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusIcons: { [key: string]: React.ReactNode } = {
    PLACED: <Clock className="w-4 h-4" />,
    CONFIRMED: <ThumbsUp className="w-4 h-4" />,
    PREPARING: <Clock className="w-4 h-4" />,
    PICKED_UP: <Truck className="w-4 h-4" />,
    DELIVERED: <CheckCircle className="w-4 h-4" />,
    CANCELLED: <X className="w-4 h-4" />,
  };

  // Check if order needs payment (PLACED status usually means payment pending)
  const needsPayment = order.status === 'PLACED';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`${statusColors[order.status]} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border`}>
            {statusIcons[order.status]}
            {order.status.replace('_', ' ')}
          </span>
          {needsPayment && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Payment Pending
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Items:</span>
          <span className="font-semibold">{order.items.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-bold text-red-500 text-lg">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
        <MapPin className="w-4 h-4" />
        <span className="flex-1">{order.deliveryAddress}</span>
      </div>

      {order.estimatedDeliveryTime && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
          <Clock className="w-4 h-4" />
          <span>Est. delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};
// const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
//     const statusColors: { [key: string]: string } = {
//         PLACED: 'bg-blue-100 text-blue-800 border-blue-200',
//         CONFIRMED: 'bg-purple-100 text-purple-800 border-purple-200',
//         PREPARING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//         PICKED_UP: 'bg-orange-100 text-orange-800 border-orange-200',
//         DELIVERED: 'bg-green-100 text-green-800 border-green-200',
//         CANCELLED: 'bg-red-100 text-red-800 border-red-200',
//     };

//     const statusIcons: { [key: string]: React.ReactNode } = {
//         PLACED: <Clock className="w-4 h-4" />,
//         CONFIRMED: <ThumbsUp className="w-4 h-4" />,
//         PREPARING: <Clock4 className="w-4 h-4" />,
//         PICKED_UP: <Truck className="w-4 h-4" />,
//         DELIVERED: <ThumbsUp className="w-4 h-4" />,
//         CANCELLED: <X className="w-4 h-4" />,
//     };

//     return (
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
//             <div className="flex justify-between items-start mb-4">
//                 <div>
//                     <h3 className="font-bold text-lg text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
//                     <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
//                 </div>
//                 <span className={`${statusColors[order.status]} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border`}>
//                     {statusIcons[order.status]}
//                     {order.status.replace('_', ' ')}
//                 </span>
//             </div>

//             <div className="space-y-3 mb-4">
//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Items:</span>
//                     <span className="font-semibold">{order.items.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span className="text-gray-600">Total Amount:</span>
//                     <span className="font-bold text-red-500 text-lg">₹{order.totalAmount}</span>
//                 </div>
//             </div>

//             <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
//                 <MapPin className="w-4 h-4" />
//                 <span className="flex-1">{order.deliveryAddress}</span>
//             </div>

//             {order.estimatedDeliveryTime && (
//                 <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
//                     <Clock className="w-4 h-4" />
//                     <span>Est. delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</span>
//                 </div>
//             )}
//         </div>
//     );
// };

const Recommendations: React.FC<{ onAddToCart: (product: Product) => void; onViewDetails: (product: Product) => void }> = ({ onAddToCart, onViewDetails }) => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async (searchQuery?: string) => {
        setLoading(true);
        try {
            const data = await api.getRecommendations(searchQuery, 6);
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            fetchRecommendations(query);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-2xl">
                        <Sparkles className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">AI Recommendations</h2>
                </div>
                <p className="text-gray-600 text-lg">Discover personalized food suggestions powered by AI</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Describe what you're craving... (e.g., 'spicy chicken under ₹200')"
                        className="w-full pl-12 pr-32 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition font-semibold"
                    >
                        Find Food
                    </button>
                </div>
            </div>

            {/* Recommendations Grid */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Finding the perfect recommendations for you...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec) => (
                        rec.product && (
                            <div key={rec.productId} className="relative">
                                <div className="absolute top-4 right-4 z-10 bg-lineart-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                                    <TrendingUp className="w-3 h-3" />
                                    {(rec.score * 100).toFixed(0)}% Match
                                </div>
                                <ProductCard
                                    product={rec.product}
                                    onAddToCart={onAddToCart}
                                    onViewDetails={onViewDetails}
                                />
                            </div>
                        )
                    ))}
                </div>
            )}

            {recommendations.length === 0 && !loading && (
                <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600">Try searching for something you're craving!</p>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// MAIN APP
// ============================================================================
const App: React.FC = () => {
    const { user, logout } = useAuth();
    const [view, setView] = useState<'products' | 'cart' | 'orders' | 'recommendations' | 'admin' | 'product-management' | 'order-management'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (user) {
            fetchProducts();
            fetchOrders();
        }
    }, [user]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getProducts();
            setProducts(data.products || []);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await api.getOrders();
            setOrders(data.orders || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity === 0) {
            setCart((prev) => prev.filter((item) => item._id !== id));
        } else {
            setCart((prev) =>
                prev.map((item) => (item._id === id ? { ...item, quantity } : item))
            );
        }
    };

    // const handleCheckout = async () => {
    //     try {
    //         const items = cart.map((item) => ({
    //             productId: item._id,
    //             quantity: item.quantity,
    //         }));
    //         await api.createOrder(items);
    //         setCart([]);
    //         setView('orders');
    //         fetchOrders();
    //         alert('Order placed successfully! 🎉');
    //     } catch (err) {
    //         alert('Failed to place order: ' + (err instanceof Error ? err.message : 'Unknown error'));
    //     }
    // };
    const handleCheckout = (orderId: string) => {
        setCart([]);
        setView('orders');
        fetchOrders();

    };

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    // Get unique categories
    const categories = ['all', ...new Set(products.map(p => p.category))];

    // Filter and sort products
    const filteredProducts = products
        .filter((p) =>
            (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === 'all' || p.category === selectedCategory)
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Admin navigation items
    const adminNavItems = [
        { key: 'admin', label: 'Dashboard', icon: BarChart3 },
        { key: 'product-management', label: 'Products', icon: Package },
        { key: 'order-management', label: 'Orders', icon: ShoppingBag },
    ];

    // Customer navigation items
    const customerNavItems = [
        { key: 'products', label: 'Menu', icon: null },
        { key: 'recommendations', label: 'AI Picks', icon: Sparkles },
        { key: 'orders', label: 'Orders', icon: Package },
    ];

    if (!user) {
        return (
            <AuthProvider>
                <AuthScreen />
            </AuthProvider>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Zomato Lite
                            </h1>
                            {isAdmin && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    ADMIN
                                </span>
                            )}
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {/* Customer Navigation */}
                            {!isAdmin ? (
                                <>
                                    {customerNavItems.map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => setView(key as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${view === key
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                        >
                                            {Icon && <Icon className="w-4 h-4" />}
                                            {label}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                // Admin Navigation
                                <>
                                    {adminNavItems.map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => setView(key as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${view === key
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    ))}
                                </>
                            )}

                            {/* Cart Button (only for customers) */}
                            {!isAdmin && (
                                <button
                                    onClick={() => setView('cart')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition relative ${view === 'cart'
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                        : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </nav>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
                                <User className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-700">{user.name}</span>
                                {isAdmin && (
                                    <Shield className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="md:hidden py-4 border-t space-y-2">
                            {/* Customer Mobile Navigation */}
                            {!isAdmin ? (
                                <>
                                    {[
                                        ...customerNavItems,
                                        { key: 'cart', label: `Cart (${cartItemCount})`, icon: ShoppingCart },
                                    ].map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => { setView(key as any); setMobileMenuOpen(false); }}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${view === key
                                                ? 'bg-red-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {Icon && <Icon className="w-5 h-5" />}
                                            {label}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                // Admin Mobile Navigation
                                <>
                                    {adminNavItems.map(({ key, label, icon: Icon }) => (
                                        <button
                                            key={key}
                                            onClick={() => { setView(key as any); setMobileMenuOpen(false); }}
                                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition ${view === key
                                                ? 'bg-red-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {label}
                                        </button>
                                    ))}
                                </>
                            )}

                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">{user.name}</span>
                                    {isAdmin && (
                                        <Shield className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                                <button
                                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Admin Views */}
                {isAdmin && (
                    <>
                        {view === 'admin' && <AdminDashboard />}
                        {view === 'product-management' && <ProductManagement />}
                        {view === 'order-management' && <OrderManagement />}
                    </>
                )}

                {/* Customer Views */}
                {!isAdmin && (
                    <>
                        {/* Products View */}
                        {view === 'products' && (
                            <div className="space-y-8">
                                {/* Hero Section */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                        Delicious Food,
                                        <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Delivered</span>
                                    </h1>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                        Discover the best food from top restaurants near you
                                    </p>
                                </div>

                                {/* Search and Filters */}
                                <div className="space-y-4">
                                    {/* Search Bar */}
                                    <div className="relative max-w-2xl mx-auto">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search for dishes, cuisines, or restaurants..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {/* Category Filter */}
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-gray-600" />
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Sort Filter */}
                                        <div className="flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as any)}
                                                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            >
                                                <option value="name">Sort by Name</option>
                                                <option value="price">Sort by Price</option>
                                                <option value="rating">Sort by Rating</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                {loading ? (
                                    <div className="text-center py-16">
                                        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
                                        <p className="text-gray-600">Loading delicious options...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {selectedCategory === 'all' ? 'All Items' : selectedCategory}
                                                <span className="text-gray-500 text-lg ml-2">({filteredProducts.length})</span>
                                            </h2>
                                        </div>

                                        {filteredProducts.length === 0 ? (
                                            <div className="text-center py-16">
                                                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                                                <p className="text-gray-600">
                                                    {searchTerm ? `No results for "${searchTerm}"` : 'No products available in this category'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {filteredProducts.map((product) => (
                                                    <ProductCard
                                                        key={product._id}
                                                        product={product}
                                                        onAddToCart={addToCart}
                                                        onViewDetails={handleViewDetails}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Cart View */}
                        {view === 'cart' && (
                            <Cart
                                items={cart}
                                onUpdateQuantity={updateQuantity}
                                onCheckout={handleCheckout}
                                onContinueShopping={() => setView('products')}
                            />
                        )}
                        {/* Orders View */}
                        {view === 'orders' && (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Orders</h2>
                                    <p className="text-gray-600 text-lg">Track your food journey</p>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-16">
                                        <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
                                        <p className="text-gray-600 mb-6">Your delicious food adventure awaits!</p>
                                        <button
                                            onClick={() => setView('products')}
                                            className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition font-semibold"
                                        >
                                            Start Ordering
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {orders.map((order) => (
                                            <OrderCard key={order._id} order={order} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recommendations View */}
                        {view === 'recommendations' && (
                            <Recommendations
                                onAddToCart={addToCart}
                                onViewDetails={handleViewDetails}
                            />
                        )}
                    </>
                )}
            </main>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    setSelectedProduct(null);
                }}
                onAddToCart={addToCart}
            />

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Zomato Lite</h3>
                            <p className="text-gray-400">
                                Delivering happiness through delicious food experiences.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">About</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition">Team</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Food Street, Delhi</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Zomato Lite. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};



// ============================================================================
// AUTH SCREEN
// ============================================================================

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Branding */}
                <div className="bg-linear-to-br from-red-500 to-orange-500 p-8 lg:p-12 text-white hidden lg:flex flex-col justify-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl font-bold">Zomato Lite</h1>
                        </div>
                        <p className="text-xl opacity-90">
                            Discover the best food around you. Order from top restaurants and get it delivered to your doorstep.
                        </p>
                        <div className="space-y-4 mt-8">
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Truck className="w-4 h-4" />
                                </div>
                                <span>Fast delivery in 30 minutes</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <span>100% food safety guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4" />
                                </div>
                                <span>Rated 4.8+ by thousands</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="p-8 lg:p-12 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-linear-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                Zomato Lite
                            </h1>
                        </div>

                        {isLogin ? (
                            <LoginForm
                                onSuccess={() => { }}
                                onSwitchToRegister={() => setIsLogin(false)}
                            />
                        ) : (
                            <RegisterForm
                                onSuccess={() => { }}
                                onSwitchToLogin={() => setIsLogin(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// ROOT
// ============================================================================

export default function Root() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}