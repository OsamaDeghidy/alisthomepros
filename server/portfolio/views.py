from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema
from .models import PortfolioItem, PortfolioImage
from .serializers import PortfolioItemSerializer, PortfolioItemCreateSerializer, PortfolioImageSerializer


class PortfolioListView(generics.ListAPIView):
    """قائمة معرض الأعمال"""
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['category', 'featured']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return PortfolioItem.objects.select_related('professional')
    
    @extend_schema(
        operation_id="list_portfolio",
        summary="List Portfolio Items",
        description="Get portfolio items list",
        tags=["Portfolio"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PortfolioDetailView(generics.RetrieveAPIView):
    """تفاصيل عنصر المعرض"""
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = PortfolioItem.objects.prefetch_related('images')
    
    @extend_schema(
        operation_id="get_portfolio_detail",
        summary="Portfolio Item Details", 
        description="Get specific portfolio item details",
        tags=["Portfolio"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PortfolioCreateView(generics.CreateAPIView):
    """إنشاء عنصر معرض جديد"""
    serializer_class = PortfolioItemCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        operation_id="create_portfolio_item",
        summary="Create New Portfolio Item",
        description="Create new portfolio item",
        tags=["Portfolio"],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        portfolio_item = serializer.save()
        
        # Return the full portfolio item with ID using the detail serializer
        detail_serializer = PortfolioItemSerializer(portfolio_item)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


class PortfolioUpdateView(generics.UpdateAPIView):
    """تحديث عنصر المعرض"""
    serializer_class = PortfolioItemCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioItem.objects.filter(professional=self.request.user)
    
    @extend_schema(
        operation_id="update_portfolio_item",
        summary="Update Portfolio Item",
        description="Update existing portfolio item",
        tags=["Portfolio"],
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class PortfolioDeleteView(generics.DestroyAPIView):
    """حذف عنصر المعرض"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioItem.objects.filter(professional=self.request.user)
    
    @extend_schema(
        operation_id="delete_portfolio_item",
        summary="Delete Portfolio Item",
        description="Delete existing portfolio item",
        tags=["Portfolio"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MyPortfolioView(generics.ListAPIView):
    """معرض أعمالي"""
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PortfolioItem.objects.filter(
            professional=self.request.user
        ).prefetch_related('images')
    
    @extend_schema(
        operation_id="get_my_portfolio",
        summary="معرض أعمالي",
        description="عرض معرض أعمال المستخدم الحالي",
        tags=["Portfolio"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class PortfolioImageCreateView(generics.CreateAPIView):
    """رفع صورة للمعرض"""
    serializer_class = PortfolioImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        portfolio_id = self.kwargs.get('portfolio_id')
        portfolio_item = PortfolioItem.objects.get(
            id=portfolio_id,
            professional=self.request.user
        )
        serializer.save(portfolio_item=portfolio_item)
    
    @extend_schema(
        operation_id="upload_portfolio_image",
        summary="Upload Portfolio Image",
        description="Upload image for portfolio item",
        tags=["Portfolio"],
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class PortfolioImageUpdateView(generics.UpdateAPIView):
    """تحديث صورة المعرض"""
    serializer_class = PortfolioImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        portfolio_id = self.kwargs.get('portfolio_id')
        return PortfolioImage.objects.filter(
            portfolio_item_id=portfolio_id,
            portfolio_item__professional=self.request.user
        )
    
    @extend_schema(
        operation_id="update_portfolio_image",
        summary="Update Portfolio Image",
        description="Update portfolio image details",
        tags=["Portfolio"],
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class PortfolioImageDeleteView(generics.DestroyAPIView):
    """حذف صورة المعرض"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        portfolio_id = self.kwargs.get('portfolio_id')
        return PortfolioImage.objects.filter(
            portfolio_item_id=portfolio_id,
            portfolio_item__professional=self.request.user
        )
    
    @extend_schema(
        operation_id="delete_portfolio_image",
        summary="Delete Portfolio Image",
        description="Delete portfolio image",
        tags=["Portfolio"],
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
