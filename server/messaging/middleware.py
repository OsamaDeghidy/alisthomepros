from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from urllib.parse import parse_qs


class JWTAuthMiddleware(BaseMiddleware):
    """JWT Authentication middleware for WebSocket connections"""
    
    def __init__(self, inner):
        super().__init__(inner)
    
    async def __call__(self, scope, receive, send):
        # Get token from query string or headers
        token = None
        
        # Try to get token from query string
        query_string = scope.get('query_string', b'').decode()
        if query_string:
            query_params = parse_qs(query_string)
            token = query_params.get('token', [None])[0]
        
        # Try to get token from headers if not in query string
        if not token:
            headers = dict(scope.get('headers', []))
            auth_header = headers.get(b'authorization', b'').decode()
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        # Authenticate user
        scope['user'] = await self.get_user_from_token(token)
        
        return await super().__call__(scope, receive, send)
    
    @database_sync_to_async
    def get_user_from_token(self, token):
        """Get user from JWT token"""
        from django.contrib.auth import get_user_model
        from django.contrib.auth.models import AnonymousUser
        from rest_framework_simplejwt.tokens import AccessToken
        from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
        
        User = get_user_model()
        
        if not token:
            return AnonymousUser()
        
        try:
            # Validate token using simplejwt
            access_token = AccessToken(token)
            
            # Get user ID from token
            user_id = access_token.get('user_id')
            if not user_id:
                return AnonymousUser()
            
            # Get user from database
            user = User.objects.get(id=user_id)
            return user
            
        except (InvalidToken, TokenError, User.DoesNotExist):
            return AnonymousUser()


def JWTAuthMiddlewareStack(inner):
    """Stack JWT auth middleware"""
    return JWTAuthMiddleware(inner)