"use client";

import { useEffect, useMemo, useState } from "react";
import { notificationsApi, type Notification } from "@/services/notificationsApi";
import { Bell, FolderPlus, Info, MessageCircle, CreditCard, FileText, Settings, AlertTriangle, Check } from "lucide-react";

interface ListState {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

const NOTIFICATION_TYPES: { value: string; label: string }[] = [
  { value: "", label: "All types" },
  { value: "project_created", label: "Project Created" },
  { value: "project_update", label: "Project Update" },
  { value: "new_message", label: "New Message" },
  { value: "payment_received", label: "Payment Received" },
  { value: "contract_signed", label: "Contract Signed" },
  { value: "review_received", label: "Review Received" },
  { value: "system", label: "System" },
];

export default function NotificationsPage() {
  const [list, setList] = useState<ListState>({ count: 0, next: null, previous: null, results: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(list.count / pageSize)), [list.count, pageSize]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await notificationsApi.getNotifications({
          page,
          page_size: pageSize,
          type: typeFilter || undefined,
          is_read: readFilter === "all" ? undefined : readFilter === "read",
        });
        setList(data);
      } catch (e: any) {
        console.error(e);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, pageSize, typeFilter, readFilter]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "project_created":
        return <FolderPlus className="h-5 w-5 text-green-600" />;
      case "project_update":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "new_message":
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case "payment_received":
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case "contract_signed":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "review_received":
        return <Check className="h-5 w-5 text-yellow-600" />;
      case "system":
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      // Refresh list
      const data = await notificationsApi.getNotifications({
        page,
        page_size: pageSize,
        type: typeFilter || undefined,
        is_read: readFilter === "all" ? undefined : readFilter === "read",
      });
      setList(data);
      // Ask header to refresh counter
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("refreshNotifications"));
      }
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllAsRead();
      // Reset to page 1 and refresh
      setPage(1);
      const data = await notificationsApi.getNotifications({ page: 1, page_size: pageSize, type: typeFilter || undefined, is_read: readFilter === "all" ? undefined : readFilter === "read" });
      setList(data);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("refreshNotifications"));
      }
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600">Stay on top of your account activity</p>
          </div>
        </div>
        <button onClick={handleMarkAll} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Mark all read
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setPage(1); setTypeFilter(e.target.value); }}
              className="w-full border-gray-300 rounded-md text-sm"
            >
              {NOTIFICATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={readFilter}
              onChange={(e) => { setPage(1); setReadFilter(e.target.value as any); }}
              className="w-full border-gray-300 rounded-md text-sm"
            >
              <option value="all">All</option>
              <option value="unread">Unread only</option>
              <option value="read">Read only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Page size</label>
            <select
              value={pageSize}
              onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
              className="w-full border-gray-300 rounded-md text-sm"
            >
              {[10, 20, 50].map((s) => (
                <option key={s} value={s}>{s} per page</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Notifications</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => setPage(page)} className="text-blue-600 hover:text-blue-800 font-medium">Try Again</button>
          </div>
        ) : list.results.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.results.map((n) => (
              <div key={n.id} className={`p-4 flex items-start space-x-3 ${n.is_read ? "bg-white" : "bg-blue-50"}`}>
                <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm ${n.is_read ? "text-gray-900" : "text-gray-900 font-semibold"}`}>{n.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <div className="mt-2 text-xs text-gray-500">{formatTimeAgo(n.created_at)}</div>
                    </div>
                    {!n.is_read && (
                      <button onClick={() => handleMarkAsRead(n.id)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Mark as read</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {list.results.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <div className="space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded-md text-sm border ${page <= 1 ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded-md text-sm border ${page >= totalPages ? "text-gray-300 border-gray-200" : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}