from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from phonenumber_field.serializerfields import PhoneNumberField
from .models import User, UserProfile


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer للتسجيل الجديد
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    
    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'phone',
            'location',
            'user_type',
            'company_name',
            'bio',
        )
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if value and value.strip():
            # Remove all non-digit characters except + at the beginning
            import re
            cleaned_phone = re.sub(r'[^\d+]', '', value)
            
            # Check if it's a reasonable phone number
            if len(cleaned_phone) < 10 or len(cleaned_phone) > 15:
                raise serializers.ValidationError("Phone number must be between 10-15 digits")
            
            # If it doesn't start with +, assume it's a local number
            if not cleaned_phone.startswith('+'):
                cleaned_phone = '+1' + cleaned_phone  # Default to US format
            
            return cleaned_phone
        return value
    
    def validate(self, attrs):
        """Validate registration data"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": ["Passwords don't match"]})
        
        # Remove password_confirm from attrs
        attrs.pop('password_confirm', None)
        
        # Validate email uniqueness
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": ["Email already exists"]})
        
        # Auto-generate unique username from email if not provided or if it already exists
        email = attrs['email']
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        
        # Ensure username uniqueness
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        attrs['username'] = username
        
        return attrs
    
    def create(self, validated_data):
        """Create new user"""
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer لتسجيل الدخول
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        """Validate login credentials"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        print(f"🔍 Validating login - Email: {email}")
        
        if email and password:
            try:
                user = User.objects.get(email=email)
                username = user.username
                print(f"✅ User found: {username}")
            except User.DoesNotExist:
                print(f"❌ User not found for email: {email}")
                raise serializers.ValidationError("Invalid email or password")
            
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            
            if not user:
                print(f"❌ Authentication failed for user: {username}")
                raise serializers.ValidationError("Invalid email or password")
            
            if not user.is_active:
                print(f"❌ User account disabled: {username}")
                raise serializers.ValidationError("User account is disabled")
            
            print(f"✅ Authentication successful for user: {username}")
            attrs['user'] = user
        else:
            print(f"❌ Missing email or password")
            raise serializers.ValidationError("Must include email and password")
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer للملف الشخصي الإضافي
    """
    emergency_contact_phone = PhoneNumberField(required=False)
    
    class Meta:
        model = UserProfile
        fields = (
            'linkedin_url',
            'facebook_url',
            'instagram_url',
            'twitter_url',
            'portfolio_images',
            'certifications',
            'emergency_contact_name',
            'emergency_contact_phone',
            'business_address',
            'tax_id',
            'availability_schedule',
            'service_areas',
        )
        extra_kwargs = {
            'bank_account_info': {'write_only': True},
            'tax_id': {'write_only': True},
        }


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer لتفاصيل المستخدم الكاملة
    """
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    profile = UserProfileSerializer(read_only=True)
    verification_badges = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'location',
            'avatar',
            'user_type',
            'is_verified',
            'verification_status',
            'company_name',
            'bio',
            'website',
            'experience_years',
            'hourly_rate',
            'skills',
            'rating_average',
            'rating_count',
            'is_available',
            'projects_completed',
            'total_earnings',
            'last_activity',
            'created_at',
            'profile',
            'verification_badges',
            'completion_rate',
        )
        read_only_fields = (
            'id',
            'username',
            'user_type',
            'is_verified',
            'verification_status',
            'rating_average',
            'rating_count',
            'projects_completed',
            'total_earnings',
            'last_activity',
            'created_at',
        )
    
    def validate(self, attrs):
        """Validate user update data with detailed logging"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"🔍 UserDetailSerializer validation - Received data: {attrs}")
        
        # Validate phone number if provided
        if 'phone' in attrs and attrs['phone']:
            try:
                phone_value = str(attrs['phone']).strip()
                logger.info(f"📱 Validating phone number: {phone_value}")
                
                # Remove all non-digit characters except + at the beginning
                import re
                cleaned_phone = re.sub(r'[^\d+]', '', phone_value)
                
                # Check if it's a reasonable phone number (8-15 digits)
                digit_count = len(re.sub(r'[^\d]', '', cleaned_phone))
                if digit_count < 8 or digit_count > 15:
                    logger.error(f"❌ Invalid phone number length: {digit_count} digits")
                    raise serializers.ValidationError({"phone": "Phone number must be between 8-15 digits"})
                
                # Store the cleaned phone number
                attrs['phone'] = cleaned_phone
                logger.info(f"✅ Phone number validated: {cleaned_phone}")
                
            except serializers.ValidationError:
                raise
            except Exception as e:
                logger.error(f"❌ Phone validation error: {str(e)}")
                raise serializers.ValidationError({"phone": f"Phone validation error: {str(e)}"})
        
        # Validate hourly_rate if provided
        if 'hourly_rate' in attrs and attrs['hourly_rate'] is not None:
            try:
                rate = float(attrs['hourly_rate'])
                if rate < 0:
                    logger.error(f"❌ Invalid hourly rate: {rate}")
                    raise serializers.ValidationError({"hourly_rate": "Hourly rate must be positive"})
            except (ValueError, TypeError) as e:
                logger.error(f"❌ Hourly rate validation error: {str(e)}")
                raise serializers.ValidationError({"hourly_rate": "Invalid hourly rate format"})
        
        # Validate experience_years if provided
        if 'experience_years' in attrs and attrs['experience_years'] is not None:
            try:
                years = int(attrs['experience_years'])
                if years < 0 or years > 50:
                    logger.error(f"❌ Invalid experience years: {years}")
                    raise serializers.ValidationError({"experience_years": "Experience years must be between 0 and 50"})
            except (ValueError, TypeError) as e:
                logger.error(f"❌ Experience years validation error: {str(e)}")
                raise serializers.ValidationError({"experience_years": "Invalid experience years format"})
        
        logger.info(f"✅ UserDetailSerializer validation passed")
        return attrs
    
    def update(self, instance, validated_data):
        """Update user with validated data"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"🔄 Updating user {instance.id} with data: {validated_data}")
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        try:
            instance.save()
            logger.info(f"✅ User {instance.id} updated successfully")
        except Exception as e:
            logger.error(f"❌ Error saving user {instance.id}: {str(e)}")
            raise
        
        return instance
    
    def get_verification_badges(self, obj):
        """Get user verification badges"""
        try:
            print(f"🔍 Getting verification badges for user {obj.id}")
            badges = obj.get_verification_badge()
            print(f"✅ Verification badges retrieved: {badges}")
            return badges
        except Exception as e:
            print(f"❌ Error getting verification badges for user {obj.id}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return []
    
    def get_completion_rate(self, obj):
        """Get profile completion rate"""
        try:
            print(f"🔍 Getting completion rate for user {obj.id}")
            rate = obj.get_completion_rate()
            print(f"✅ Completion rate retrieved: {rate}")
            return rate
        except Exception as e:
            print(f"❌ Error getting completion rate for user {obj.id}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return 0


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer لتحديث بيانات المستخدم
    """
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    
    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'phone',
            'location',
            'avatar',
            'company_name',
            'bio',
            'website',
            'experience_years',
            'hourly_rate',
            'skills',
            'is_available',
            'notification_preferences',
        )
    
    def validate(self, attrs):
        """Validate user update data with detailed logging"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"🔍 UserUpdateSerializer validation - Received data: {attrs}")
        
        # Validate phone number if provided
        if 'phone' in attrs and attrs['phone']:
            try:
                phone_value = str(attrs['phone']).strip()
                logger.info(f"📱 Validating phone number: {phone_value}")
                
                # Remove all non-digit characters except + at the beginning
                import re
                cleaned_phone = re.sub(r'[^\d+]', '', phone_value)
                
                # Check if it's a reasonable phone number (8-15 digits)
                digit_count = len(re.sub(r'[^\d]', '', cleaned_phone))
                if digit_count < 8 or digit_count > 15:
                    logger.error(f"❌ Invalid phone number length: {digit_count} digits")
                    raise serializers.ValidationError({"phone": "Phone number must be between 8-15 digits"})
                
                # Store the cleaned phone number
                attrs['phone'] = cleaned_phone
                logger.info(f"✅ Phone number validated: {cleaned_phone}")
                
            except serializers.ValidationError:
                raise
            except Exception as e:
                logger.error(f"❌ Phone validation error: {str(e)}")
                raise serializers.ValidationError({"phone": f"Phone validation error: {str(e)}"})
        
        # Validate hourly_rate if provided
        if 'hourly_rate' in attrs and attrs['hourly_rate'] is not None:
            try:
                rate = float(attrs['hourly_rate'])
                if rate < 0:
                    logger.error(f"❌ Invalid hourly rate: {rate}")
                    raise serializers.ValidationError({"hourly_rate": "Hourly rate must be positive"})
            except (ValueError, TypeError) as e:
                logger.error(f"❌ Hourly rate validation error: {str(e)}")
                raise serializers.ValidationError({"hourly_rate": "Invalid hourly rate format"})
        
        # Validate experience_years if provided
        if 'experience_years' in attrs and attrs['experience_years'] is not None:
            try:
                years = int(attrs['experience_years'])
                if years < 0 or years > 50:
                    logger.error(f"❌ Invalid experience years: {years}")
                    raise serializers.ValidationError({"experience_years": "Experience years must be between 0 and 50"})
            except (ValueError, TypeError) as e:
                logger.error(f"❌ Experience years validation error: {str(e)}")
                raise serializers.ValidationError({"experience_years": "Invalid experience years format"})
        
        logger.info(f"✅ UserUpdateSerializer validation passed")
        return attrs
    
    def update(self, instance, validated_data):
        """Update user with validated data"""
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"🔄 Updating user {instance.id} with data: {validated_data}")
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        try:
            instance.save()
            logger.info(f"✅ User {instance.id} updated successfully")
        except Exception as e:
            logger.error(f"❌ Error saving user {instance.id}: {str(e)}")
            raise
        
        return instance


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer لقائمة المستخدمين (عرض مبسط)
    """
    verification_badges = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'avatar',
            'user_type',
            'is_verified',
            'company_name',
            'location',
            'rating_average',
            'rating_count',
            'hourly_rate',
            'is_available',
            'projects_completed',
            'verification_badges',
        )
    
    def get_verification_badges(self, obj):
        """Get user verification badges"""
        try:
            return obj.get_verification_badge()
        except Exception as e:
            print(f"Error getting verification badges for user {obj.id}: {e}")
            return []


class ProfessionalListSerializer(serializers.ModelSerializer):
    """
    Serializer خاص لقائمة المحترفين مع بيانات شاملة
    """
    verification_badges = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    portfolio_images = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    response_time = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'full_name',
            'display_name',
            'email',
            'avatar',
            'user_type',
            'is_verified',
            'company_name',
            'location',
            'bio',
            'skills',
            'rating_average',
            'rating_count',
            'hourly_rate',
            'experience_years',
            'is_available',
            'projects_completed',
            'total_earnings',
            'verification_badges',
            'completion_rate',
            'portfolio_images',
            'recent_reviews',
            'response_time',
            'created_at',
            'website',
            'phone',
            'license_number',
            'insurance_verified',
            'background_check_verified',
        )
    
    def get_verification_badges(self, obj):
        """Get user verification badges"""
        try:
            return obj.get_verification_badge()
        except Exception as e:
            print(f"Error getting verification badges for user {obj.id}: {e}")
            return []
    
    def get_full_name(self, obj):
        """Get user full name"""
        return obj.get_full_name()
    
    def get_display_name(self, obj):
        """Get user display name"""
        return obj.get_display_name()
    
    def get_completion_rate(self, obj):
        """Get profile completion rate"""
        try:
            return obj.get_completion_rate()
        except Exception as e:
            print(f"Error getting completion rate for user {obj.id}: {e}")
            return 0
    
    def get_portfolio_images(self, obj):
        """Get portfolio images from UserProfile"""
        try:
            if hasattr(obj, 'profile') and obj.profile.portfolio_images:
                return obj.profile.portfolio_images[:3]  # Return first 3 images
            return []
        except:
            return []
    
    def get_recent_reviews(self, obj):
        """Get recent reviews for this professional"""
        try:
            from reviews.models import Review
            reviews = Review.objects.filter(
                professional=obj
            ).order_by('-created_at')[:3]
            
            return [{
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment[:100] + '...' if len(review.comment) > 100 else review.comment,
                'client_name': review.client.get_display_name() if review.client else 'Anonymous',
                'created_at': review.created_at
            } for review in reviews]
        except:
            return []
    
    def get_response_time(self, obj):
        """Get average response time (mock data for now)"""
        # This could be calculated from messaging data
        # For now, return a mock value based on user activity
        if obj.is_available:
            return "Usually responds within 2 hours"
        else:
            return "Usually responds within 24 hours"


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer لتغيير كلمة المرور
    """
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        """Validate password change"""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        
        return attrs
    
    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer لإعادة تعيين كلمة المرور
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate email exists"""
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email doesn't exist")
        return value


class UserStatsSerializer(serializers.ModelSerializer):
    """
    Serializer لإحصائيات المستخدم
    """
    verification_badges = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id',
            'user_type',
            'is_verified',
            'rating_average',
            'rating_count',
            'projects_completed',
            'total_earnings',
            'verification_badges',
            'completion_rate',
            'created_at',
        )
    
    def get_verification_badges(self, obj):
        """Get user verification badges"""
        try:
            return obj.get_verification_badge()
        except Exception as e:
            print(f"Error getting verification badges for user {obj.id}: {e}")
            return []
    
    def get_completion_rate(self, obj):
        """Get profile completion rate"""
        try:
            return obj.get_completion_rate()
        except Exception as e:
            print(f"Error getting completion rate for user {obj.id}: {e}")
            return 0