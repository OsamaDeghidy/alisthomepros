#!/usr/bin/env python
import os
import sys
import django
from django.utils.text import slugify

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alist_backend.settings')
django.setup()

from projects.models import Category

def generate_unique_slug(name):
    """Generate a unique slug for the category"""
    base_slug = slugify(name)
    slug = base_slug
    counter = 1
    
    while Category.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug

def add_categories():
    """Add all the required categories to the database"""
    
    categories = [
        {'name': 'Hazardous Removal', 'icon': 'fas fa-exclamation-triangle'},
        {'name': 'Pest Control', 'icon': 'fas fa-bug'},
        {'name': 'Fire Restoration', 'icon': 'fas fa-fire'},
        {'name': 'Water Damage Restoration', 'icon': 'fas fa-tint'},
        {'name': 'Mold Remediation', 'icon': 'fas fa-biohazard'},
        {'name': 'Hurricane Retrofits', 'icon': 'fas fa-wind'},
        {'name': 'Solar Panels', 'icon': 'fas fa-solar-panel'},
        {'name': 'Custom Vanities', 'icon': 'fas fa-sink'},
        {'name': 'Shower & Tub Installs', 'icon': 'fas fa-shower'},
        {'name': 'Backsplashes', 'icon': 'fas fa-th'},
        {'name': 'Countertops', 'icon': 'fas fa-square'},
        {'name': 'Cabinetry', 'icon': 'fas fa-door-open'},
        {'name': 'Bathroom Remodeling', 'icon': 'fas fa-bath'},
        {'name': 'Kitchen Remodeling', 'icon': 'fas fa-utensils'},
        {'name': 'Outdoor Lighting', 'icon': 'fas fa-lightbulb'},
        {'name': 'Pressure Washing', 'icon': 'fas fa-spray-can'},
        {'name': 'Pools', 'icon': 'fas fa-swimming-pool'},
        {'name': 'Hardscaping', 'icon': 'fas fa-mountain'},
        {'name': 'Tree Services', 'icon': 'fas fa-tree'},
        {'name': 'Irrigation Systems', 'icon': 'fas fa-seedling'},
        {'name': 'Sod Installation', 'icon': 'fas fa-leaf'},
        {'name': 'Lawn Care', 'icon': 'fas fa-cut'},
        {'name': 'Weatherproofing', 'icon': 'fas fa-shield-alt'},
        {'name': 'Garage Doors', 'icon': 'fas fa-warehouse'},
        {'name': 'French & Entry Doors', 'icon': 'fas fa-door-closed'},
        {'name': 'Sliding Glass Doors', 'icon': 'fas fa-expand-arrows-alt'},
        {'name': 'Impact Windows', 'icon': 'fas fa-window-maximize'},
        {'name': 'Window Installation', 'icon': 'fas fa-window-restore'},
        {'name': 'Textured Finishes', 'icon': 'fas fa-paint-brush'},
        {'name': 'Wallpaper Services', 'icon': 'fas fa-palette'},
        {'name': 'Stucco & Plaster', 'icon': 'fas fa-trowel'},
        {'name': 'Drywall', 'icon': 'fas fa-square-full'},
        {'name': 'Exterior Painting', 'icon': 'fas fa-home'},
        {'name': 'Interior Painting', 'icon': 'fas fa-paint-roller'},
        {'name': 'Concrete Polishing', 'icon': 'fas fa-gem'},
        {'name': 'Epoxy Flooring', 'icon': 'fas fa-layer-group'},
        {'name': 'Carpet Installation', 'icon': 'fas fa-rug'},
        {'name': 'Tile & Stone Flooring', 'icon': 'fas fa-th-large'},
        {'name': 'Laminate & Vinyl Flooring', 'icon': 'fas fa-grip-lines'},
        {'name': 'Hardwood Flooring', 'icon': 'fas fa-tree'},
        {'name': 'Indoor Air Quality', 'icon': 'fas fa-lungs'},
        {'name': 'Ventilation Systems', 'icon': 'fas fa-fan'},
        {'name': 'Thermostats', 'icon': 'fas fa-thermometer-half'},
        {'name': 'Ductwork', 'icon': 'fas fa-wind'},
        {'name': 'Heating Systems', 'icon': 'fas fa-fire'},
        {'name': 'AC Repair & Maintenance', 'icon': 'fas fa-tools'},
        {'name': 'AC Installation', 'icon': 'fas fa-snowflake'},
        {'name': 'Security Systems', 'icon': 'fas fa-shield-alt'},
        {'name': 'Smart Home Automation', 'icon': 'fas fa-robot'},
        {'name': 'Smoke & Carbon Detectors', 'icon': 'fas fa-smoke'},
        {'name': 'Ceiling Fans', 'icon': 'fas fa-fan'},
        {'name': 'EV Charging Stations', 'icon': 'fas fa-charging-station'},
        {'name': 'Generator Installation', 'icon': 'fas fa-bolt'},
        {'name': 'Lighting Installation', 'icon': 'fas fa-lightbulb'},
        {'name': 'Panel Upgrades', 'icon': 'fas fa-plug'},
        {'name': 'Septic Tank Services', 'icon': 'fas fa-recycle'},
        {'name': 'Kitchen & Bath Plumbing', 'icon': 'fas fa-wrench'},
        {'name': 'Repiping', 'icon': 'fas fa-pipe'},
        {'name': 'Water Heaters', 'icon': 'fas fa-fire'},
        {'name': 'Sewer Line Services', 'icon': 'fas fa-water'},
        {'name': 'Drain Cleaning', 'icon': 'fas fa-broom'},
        {'name': 'Leak Detection & Repair', 'icon': 'fas fa-search'},
        {'name': 'Sheds & Storage Buildings', 'icon': 'fas fa-warehouse'},
        {'name': 'Outdoor Kitchens', 'icon': 'fas fa-utensils'},
        {'name': 'Fences & Gates', 'icon': 'fas fa-border-style'},
        {'name': 'Pergolas & Gazebos', 'icon': 'fas fa-umbrella'},
        {'name': 'Dock Construction', 'icon': 'fas fa-anchor'},
        {'name': 'Deck Building', 'icon': 'fas fa-layer-group'},
        {'name': 'Gutter Cleaning', 'icon': 'fas fa-broom'},
        {'name': 'Gutter Installation & Repair', 'icon': 'fas fa-tools'},
        {'name': 'Roof Coating & Sealing', 'icon': 'fas fa-paint-brush'},
        {'name': 'Roof Inspections', 'icon': 'fas fa-search'},
        {'name': 'Flat Roofing', 'icon': 'fas fa-home'},
        {'name': 'Tile Roofing', 'icon': 'fas fa-th'},
        {'name': 'Metal Roofing', 'icon': 'fas fa-industry'},
        {'name': 'Asphalt Shingle Roofing', 'icon': 'fas fa-home'},
        {'name': 'Excavation & Grading', 'icon': 'fas fa-truck'},
        {'name': 'Demolition', 'icon': 'fas fa-hammer'},
        {'name': 'Masonry', 'icon': 'fas fa-cube'},
        {'name': 'Concrete Work', 'icon': 'fas fa-square'},
        {'name': 'Foundation Repair', 'icon': 'fas fa-home'},
        {'name': 'Structural Framing', 'icon': 'fas fa-building'},
        {'name': 'New Home Builds', 'icon': 'fas fa-home'},
        {'name': 'Home Additions', 'icon': 'fas fa-plus'},
        {'name': 'Deck Repair', 'icon': 'fas fa-tools'},
        {'name': 'New Deck Installation', 'icon': 'fas fa-layer-group'}
    ]
    
    created_count = 0
    existing_count = 0
    
    print("Adding categories to the database...")
    print("-" * 50)
    
    for category_data in categories:
        category_name = category_data['name']
        category_icon = category_data['icon']
        
        # Check if category already exists by name
        if Category.objects.filter(name=category_name).exists():
            existing_count += 1
            print(f"- Already exists: {category_name}")
            continue
        
        try:
            # Generate unique slug
            slug = generate_unique_slug(category_name)
            
            # Create the category
            category = Category.objects.create(
                name=category_name,
                slug=slug,
                description=f'Professional {category_name.lower()} services',
                icon=category_icon,
                is_active=True
            )
            
            created_count += 1
            print(f"✓ Created: {category_name} (slug: {slug}, icon: {category_icon})")
            
        except Exception as e:
            print(f"❌ Error occurred for {category_name}: {str(e)}")
    
    print("-" * 50)
    print(f"Summary:")
    print(f"- Categories created: {created_count}")
    print(f"- Categories already existed: {existing_count}")
    print(f"- Total categories processed: {len(categories)}")
    print(f"- Total categories in database: {Category.objects.count()}")
    
if __name__ == '__main__':
    try:
        add_categories()
        print("\n✅ Script completed successfully!")
    except Exception as e:
        print(f"\n❌ Error occurred: {str(e)}")
        sys.exit(1)