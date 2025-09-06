from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'
    verbose_name = 'Authentication'
    
    def ready(self):
        """
        Called when the app is ready.
        Import signals here to ensure they are registered.
        """
        try:
            import authentication.signals
        except ImportError:
            pass
