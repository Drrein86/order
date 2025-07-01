"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: number;
  orderType: "DINE_IN" | "TAKEAWAY";
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED";
  totalAmount: number;
  notes?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  orderItems: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      name: string;
    };
    orderItemOptions: {
      id: string;
      textValue?: string;
      additionalPrice: number;
      productOption: {
        name: string;
      };
      productOptionValue?: {
        name: string;
      };
    }[];
  }[];
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "ממתינה",
  CONFIRMED: "אושרה",
  PREPARING: "בהכנה",
  READY: "מוכנה",
  DELIVERED: "נמסרה",
  CANCELLED: "בוטלה",
};

const orderTypeLabels = {
  DINE_IN: "שבת במקום",
  TAKEAWAY: "טייקאווי",
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all");
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    loadOrders();

    // רענון אוטומטי כל 30 שניות
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [session, status, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);

      // לעת עתה נשתמש בנתונים סטטיים
      const mockOrders: Order[] = [
        {
          id: "1",
          orderNumber: 1,
          orderType: "DINE_IN",
          status: "PENDING",
          totalAmount: 85.5,
          notes: "בלי בצל בפיצה",
          createdAt: new Date().toISOString(),
          customer: {
            id: "1",
            name: "יוסי כהן",
            phone: "050-1234567",
            email: "yossi@example.com",
          },
          orderItems: [
            {
              id: "1",
              quantity: 1,
              unitPrice: 45.0,
              totalPrice: 60.0,
              product: { id: "1", name: "פיצה מרגריטה" },
              orderItemOptions: [
                {
                  id: "1",
                  textValue: undefined,
                  additionalPrice: 15.0,
                  productOption: { name: "גודל" },
                  productOptionValue: { name: "משפחתית" },
                },
              ],
            },
            {
              id: "2",
              quantity: 2,
              unitPrice: 12.0,
              totalPrice: 24.0,
              product: { id: "2", name: "קפה" },
              orderItemOptions: [],
            },
          ],
        },
        {
          id: "2",
          orderNumber: 2,
          orderType: "TAKEAWAY",
          status: "PREPARING",
          totalAmount: 128.0,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          customer: {
            id: "2",
            name: "שרה לוי",
            phone: "052-9876543",
          },
          orderItems: [
            {
              id: "3",
              quantity: 1,
              unitPrice: 89.0,
              totalPrice: 89.0,
              product: { id: "3", name: "סטייק אנטריקוט" },
              orderItemOptions: [
                {
                  id: "2",
                  textValue: undefined,
                  additionalPrice: 0,
                  productOption: { name: "רמת צלייה" },
                  productOptionValue: { name: "מדיום" },
                },
              ],
            },
          ],
        },
      ];

      setOrders(mockOrders);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("שגיאה בטעינת הזמנות");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // כאן תהיה קריאה לAPI לעדכון סטטוס
      console.log(`Update order ${orderId} to ${newStatus}`);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus as Order["status"] }
            : order
        )
      );

      // הצגת הודעת הצלחה
      alert("סטטוס ההזמנה עודכן בהצלחה!");
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("שגיאה בעדכון סטטוס ההזמנה");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesOrderType =
      selectedOrderType === "all" || order.orderType === selectedOrderType;
    return matchesStatus && matchesOrderType;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">טוען הזמנות...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת עליונה */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← חזרה ללוח בקרה
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-2xl font-bold text-gray-800">
                📋 ניהול הזמנות
              </h1>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                רענון אוטומטי
              </div>
            </div>

            <button
              onClick={loadOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 רענן
            </button>
          </div>
        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* פילטרים */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* סינון לפי סטטוס */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סטטוס הזמנה
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="PENDING">ממתינות</option>
                <option value="CONFIRMED">מאושרות</option>
                <option value="PREPARING">בהכנה</option>
                <option value="READY">מוכנות</option>
                <option value="DELIVERED">נמסרו</option>
                <option value="CANCELLED">בוטלו</option>
              </select>
            </div>

            {/* סינון לפי סוג הזמנה */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג הזמנה
              </label>
              <select
                value={selectedOrderType}
                onChange={(e) => setSelectedOrderType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">כל הסוגים</option>
                <option value="DINE_IN">שבת במקום</option>
                <option value="TAKEAWAY">טייקאווי</option>
              </select>
            </div>
          </div>
        </div>

        {/* הודעת שגיאה */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* סטטיסטיקות מהירות */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = orders.filter(
              (order) => order.status === status
            ).length;
            return (
              <div
                key={status}
                className="bg-white rounded-xl shadow-lg p-4 text-center"
              >
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[status as keyof typeof statusColors]
                  }`}
                >
                  {label}
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
              </div>
            );
          })}
        </div>

        {/* רשימת הזמנות */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                {/* כותרת הזמנה */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      הזמנה #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {orderTypeLabels[order.orderType]}
                    </span>
                  </div>

                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-800">
                      ₪{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString("he-IL")}
                    </p>
                  </div>
                </div>

                {/* פרטי לקוח */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">פרטי לקוח:</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">שם: </span>
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">טלפון: </span>
                      <span className="font-medium">
                        {order.customer.phone}
                      </span>
                    </div>
                    {order.customer.email && (
                      <div>
                        <span className="text-gray-600">אימיל: </span>
                        <span className="font-medium">
                          {order.customer.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* פריטי הזמנה */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-3">פריטים:</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {item.product.name}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              x{item.quantity}
                            </span>
                          </div>

                          {item.orderItemOptions.length > 0 && (
                            <div className="mt-1 text-sm text-gray-600">
                              {item.orderItemOptions.map((option) => (
                                <div key={option.id}>
                                  {option.productOption.name}:{" "}
                                  {option.productOptionValue?.name ||
                                    option.textValue}
                                  {option.additionalPrice > 0 && (
                                    <span className="text-green-600">
                                      {" "}
                                      (+₪{option.additionalPrice})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <p className="font-bold">₪{item.totalPrice}</p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-600">
                              ₪{item.unitPrice} ליחידה
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* הערות */}
                {order.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">הערות:</h4>
                    <p className="text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* פעולות */}
                <div className="flex flex-wrap gap-2">
                  {order.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ✅ אשר הזמנה
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        ❌ בטל הזמנה
                      </button>
                    </>
                  )}

                  {order.status === "CONFIRMED" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "PREPARING")}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      👨‍🍳 התחל הכנה
                    </button>
                  )}

                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "READY")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      🍽️ מוכן למסירה
                    </button>
                  )}

                  {order.status === "READY" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      📦 הזמנה נמסרה
                    </button>
                  )}

                  <button className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors">
                    📄 הדפס קבלה
                  </button>

                  <button className="bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors">
                    💬 שלח WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              אין הזמנות
            </h3>
            <p className="text-gray-600">
              לא נמצאו הזמנות עבור הפילטרים שנבחרו
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
