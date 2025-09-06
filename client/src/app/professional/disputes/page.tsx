'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, MessageSquare, FileText, Clock, CheckCircle, XCircle, Plus, Filter, Search, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Dispute {
  dispute_id: string;
  title: string;
  description: string;
  dispute_type: string;
  status: string;
  priority: string;
  raised_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
  against: {
    id: string;
    first_name: string;
    last_name: string;
  };
  contract?: {
    id: string;
    title: string;
  };
  milestone?: {
    id: string;
    title: string;
  };
  disputed_amount?: number;
  created_at: string;
  updated_at: string;
  resolution_date?: string;
  resolution_notes?: string;
}

interface DisputeMessage {
  id: string;
  message: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
}

const ProfessionalDisputesPage = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputeMessages, setDisputeMessages] = useState<DisputeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Create dispute form state
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    dispute_type: '',
    priority: 'medium',
    contract_id: '',
    milestone_id: '',
    disputed_amount: ''
  });

  const disputeTypes = [
    { value: 'payment', label: 'مشكلة في الدفع' },
    { value: 'scope_change', label: 'تغيير في النطاق' },
    { value: 'unreasonable_demands', label: 'مطالب غير معقولة' },
    { value: 'communication', label: 'مشاكل التواصل' },
    { value: 'contract_breach', label: 'خرق العقد من العميل' },
    { value: 'delayed_feedback', label: 'تأخير في التغذية الراجعة' },
    { value: 'other', label: 'أخرى' }
  ];

  const priorityTypes = [
    { value: 'low', label: 'منخفضة', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-800' }
  ];

  const statusTypes = [
    { value: 'open', label: 'مفتوح', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    { value: 'in_progress', label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'resolved', label: 'محلول', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'closed', label: 'مغلق', color: 'bg-gray-100 text-gray-800', icon: XCircle }
  ];

  useEffect(() => {
    fetchDisputes();
  }, []);

  const getTokenFromCookies = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
      return tokenCookie ? tokenCookie.split('=')[1] : null;
    }
    return null;
  };

  const fetchDisputes = async () => {
    try {
      const token = getTokenFromCookies();
      const response = await fetch(`${API_BASE_URL}/disputes/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDisputes(data.results || data);
      } else {
        toast.error('فشل في تحميل النزاعات');
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error('حدث خطأ في تحميل النزاعات');
    } finally {
      setLoading(false);
    }
  };

  const fetchDisputeMessages = async (disputeId: string) => {
    setMessageLoading(true);
    try {
      const token = getTokenFromCookies();
      const response = await fetch(`${API_BASE_URL}/disputes/${disputeId}/messages/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDisputeMessages(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleCreateDispute = async () => {
    if (!createForm.title || !createForm.description || !createForm.dispute_type) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const token = getTokenFromCookies();
      const response = await fetch(`${API_BASE_URL}/contracts/raise-dispute/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...createForm,
          disputed_amount: createForm.disputed_amount ? parseFloat(createForm.disputed_amount) : null
        })
      });
      
      if (response.ok) {
        toast.success('تم رفع النزاع بنجاح');
        setShowCreateDialog(false);
        setCreateForm({
          title: '',
          description: '',
          dispute_type: '',
          priority: 'medium',
          contract_id: '',
          milestone_id: '',
          disputed_amount: ''
        });
        fetchDisputes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'فشل في رفع النزاع');
      }
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast.error('حدث خطأ في رفع النزاع');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDispute) return;

    try {
      const token = getTokenFromCookies();
      const response = await fetch(`${API_BASE_URL}/disputes/${selectedDispute.dispute_id}/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });
      
      if (response.ok) {
        setNewMessage('');
        fetchDisputeMessages(selectedDispute.dispute_id);
        toast.success('تم إرسال الرسالة');
      } else {
        toast.error('فشل في إرسال الرسالة');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    }
  };

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dispute.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'all' || dispute.dispute_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusInfo = (status: string) => {
    return statusTypes.find(s => s.value === status) || statusTypes[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorityTypes.find(p => p.value === priority) || priorityTypes[1];
  };

  const getDisputeTypeLabel = (type: string) => {
    return disputeTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            إدارة النزاعات - المحترف
          </h1>
          <p className="text-gray-600 mt-2">إدارة ومتابعة النزاعات المتعلقة بمشاريعك كمحترف</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              رفع نزاع جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>رفع نزاع جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان النزاع *</Label>
                <Input
                  id="title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  placeholder="أدخل عنوان النزاع"
                />
              </div>
              
              <div>
                <Label htmlFor="description">وصف النزاع *</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  placeholder="اشرح تفاصيل النزاع من وجهة نظرك كمحترف"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dispute_type">نوع النزاع *</Label>
                  <Select value={createForm.dispute_type} onValueChange={(value) => setCreateForm({...createForm, dispute_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع النزاع" />
                    </SelectTrigger>
                    <SelectContent>
                      {disputeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select value={createForm.priority} onValueChange={(value) => setCreateForm({...createForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityTypes.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contract_id">معرف العقد</Label>
                  <Input
                    id="contract_id"
                    value={createForm.contract_id}
                    onChange={(e) => setCreateForm({...createForm, contract_id: e.target.value})}
                    placeholder="معرف العقد (اختياري)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="disputed_amount">المبلغ المتنازع عليه</Label>
                  <Input
                    id="disputed_amount"
                    type="number"
                    value={createForm.disputed_amount}
                    onChange={(e) => setCreateForm({...createForm, disputed_amount: e.target.value})}
                    placeholder="المبلغ (اختياري)"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">نصائح للمحترفين:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• كن واضحاً ومحدداً في وصف المشكلة</li>
                  <li>• أرفق أي مستندات أو أدلة داعمة</li>
                  <li>• حافظ على الطابع المهني في التواصل</li>
                  <li>• اذكر أي محاولات سابقة لحل المشكلة</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateDispute} className="bg-blue-600 hover:bg-blue-700">
                  رفع النزاع
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Professional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">إجمالي النزاعات</p>
                <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">محلولة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">عالية الأولوية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.priority === 'high' || d.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في النزاعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statusTypes.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {disputeTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                النزاعات ({filteredDisputes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredDisputes.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>لا توجد نزاعات</p>
                    <p className="text-sm mt-2">هذا أمر جيد! استمر في تقديم خدمة ممتازة</p>
                  </div>
                ) : (
                  filteredDisputes.map((dispute) => {
                    const statusInfo = getStatusInfo(dispute.status);
                    const priorityInfo = getPriorityInfo(dispute.priority);
                    const StatusIcon = statusInfo.icon;
                    const isRaisedByMe = dispute.raised_by.id === user?.id?.toString();
                    
                    return (
                      <div
                        key={dispute.dispute_id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedDispute?.dispute_id === dispute.dispute_id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                        }`}
                        onClick={() => {
                          setSelectedDispute(dispute);
                          fetchDisputeMessages(dispute.dispute_id);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-sm line-clamp-2">{dispute.title}</h3>
                          <div className="flex space-x-1 space-x-reverse">
                            <Badge className={`text-xs ${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </Badge>
                            {isRaisedByMe && (
                              <Badge className="text-xs bg-blue-100 text-blue-800">
                                أنت
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-xs ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getDisputeTypeLabel(dispute.dispute_type)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {dispute.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {isRaisedByMe ? 'ضد' : 'من'}: {isRaisedByMe ? dispute.against.first_name : dispute.raised_by.first_name} {isRaisedByMe ? dispute.against.last_name : dispute.raised_by.last_name}
                          </span>
                          <span>{new Date(dispute.created_at).toLocaleDateString('ar-SA')}</span>
                        </div>
                        
                        {dispute.disputed_amount && (
                          <div className="mt-2 text-xs font-medium text-red-600">
                            المبلغ: {dispute.disputed_amount.toLocaleString()} ر.س
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dispute Details */}
        <div className="lg:col-span-2">
          {selectedDispute ? (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">تفاصيل النزاع</TabsTrigger>
                <TabsTrigger value="messages">الرسائل</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {selectedDispute.title}
                          {selectedDispute.raised_by.id === user?.id?.toString() && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">رفعته أنت</Badge>
                          )}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">
                          النزاع #{selectedDispute.dispute_id.slice(-8)}
                        </p>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Badge className={getPriorityInfo(selectedDispute.priority).color}>
                          {getPriorityInfo(selectedDispute.priority).label}
                        </Badge>
                        <Badge className={getStatusInfo(selectedDispute.status).color}>
                          {getStatusInfo(selectedDispute.status).label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">وصف النزاع</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedDispute.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">نوع النزاع</h4>
                        <p className="text-gray-700">{getDisputeTypeLabel(selectedDispute.dispute_type)}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">الطرف الآخر</h4>
                        <p className="text-gray-700">
                          {selectedDispute.raised_by.id === user?.id?.toString()
                            ? `${selectedDispute.against.first_name} ${selectedDispute.against.last_name}`
                            : `${selectedDispute.raised_by.first_name} ${selectedDispute.raised_by.last_name}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    {selectedDispute.contract && (
                      <div>
                        <h4 className="font-medium mb-2">العقد المرتبط</h4>
                        <p className="text-gray-700">{selectedDispute.contract.title}</p>
                      </div>
                    )}
                    
                    {selectedDispute.milestone && (
                      <div>
                        <h4 className="font-medium mb-2">المرحلة المرتبطة</h4>
                        <p className="text-gray-700">{selectedDispute.milestone.title}</p>
                      </div>
                    )}
                    
                    {selectedDispute.disputed_amount && (
                      <div>
                        <h4 className="font-medium mb-2">المبلغ المتنازع عليه</h4>
                        <p className="text-red-600 font-medium">
                          {selectedDispute.disputed_amount.toLocaleString()} ر.س
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">تاريخ الإنشاء:</span>
                        <br />
                        {new Date(selectedDispute.created_at).toLocaleString('ar-SA')}
                      </div>
                      
                      <div>
                        <span className="font-medium">آخر تحديث:</span>
                        <br />
                        {new Date(selectedDispute.updated_at).toLocaleString('ar-SA')}
                      </div>
                    </div>
                    
                    {selectedDispute.resolution_date && (
                      <div>
                        <h4 className="font-medium mb-2">تاريخ الحل</h4>
                        <p className="text-gray-700">
                          {new Date(selectedDispute.resolution_date).toLocaleString('ar-SA')}
                        </p>
                        
                        {selectedDispute.resolution_notes && (
                          <div className="mt-2">
                            <h4 className="font-medium mb-2">ملاحظات الحل</h4>
                            <p className="text-gray-700 bg-green-50 p-3 rounded">
                              {selectedDispute.resolution_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Professional Tips */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">نصائح للتعامل مع النزاع:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• حافظ على الهدوء والمهنية في جميع التفاعلات</li>
                        <li>• قدم أدلة واضحة ومستندات داعمة</li>
                        <li>• كن مستعداً للتفاوض والوصول لحل وسط</li>
                        <li>• استجب بسرعة لأي طلبات أو استفسارات</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      رسائل النزاع
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Messages */}
                      <div className="max-h-64 overflow-y-auto space-y-3">
                        {messageLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          </div>
                        ) : disputeMessages.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>لا توجد رسائل بعد</p>
                            <p className="text-sm mt-1">ابدأ المحادثة لحل النزاع</p>
                          </div>
                        ) : (
                          disputeMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender.id === user?.id?.toString() ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.sender.id === user?.id?.toString()
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs opacity-75">
                                    {message.sender.first_name} {message.sender.last_name}
                                  </span>
                                  <span className="text-xs opacity-75">
                                    {new Date(message.created_at).toLocaleTimeString('ar-SA', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {/* Send Message */}
                      <div className="flex space-x-2 space-x-reverse">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="اكتب رسالتك بطريقة مهنية..."
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="self-end bg-blue-600 hover:bg-blue-700"
                        >
                          إرسال
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>اختر نزاعاً لعرض التفاصيل</p>
                  <p className="text-sm mt-2">يمكنك إدارة النزاعات والتواصل مع العملاء هنا</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDisputesPage;