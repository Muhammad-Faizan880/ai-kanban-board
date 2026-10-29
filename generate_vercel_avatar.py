import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_vercel_avatar_clean(size=256, filename="frontend/public/vercel-avatar.png"):
    # Create image with RGBA
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # We want a circular or rounded squircle base that fits comfortably inside a circle crop
    # Radius of circle safe area: size * 0.44 (leaves a nice margin so Vercel circle crop looks perfect)
    center = size / 2
    r = size * 0.45
    
    # Draw radial/linear gradient background for the avatar squircle/circle
    # Colors: Terracotta #DA721E to #B5500A
    base_mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(base_mask)
    
    # Round rectangle with radius
    pad = size * 0.06
    corner_radius = size * 0.22
    mask_draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=corner_radius,
        fill=255
    )
    
    # Create gradient background
    grad = Image.new("RGBA", (size, size))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(size):
        ratio = y / size
        # #FF8A3D to #AC4B06
        r_c = int(255 - ratio * (255 - 172))
        g_c = int(138 - ratio * (138 - 75))
        b_c = int(61 - ratio * (61 - 6))
        grad_draw.line([(0, y), (size, y)], fill=(r_c, g_c, b_c, 255))
        
    img.paste(grad, (0, 0), base_mask)
    
    # Subtle inner border / rim light
    rim = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rim_draw = ImageDraw.Draw(rim)
    rim_draw.rounded_rectangle(
        [pad + 1, pad + 1, size - pad - 1, size - pad - 1],
        radius=corner_radius,
        outline=(255, 255, 255, 120),
        width=int(size * 0.015)
    )
    img = Image.alpha_composite(img, rim)
    
    # Draw TaskFlow 'T' + Kanban Cards Emblem inside
    # Scaled nicely so it doesn't look too big or crowded
    emblem = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    e_draw = ImageDraw.Draw(emblem)
    
    # Left & Right frosted cards in background
    # Left card
    lx1 = size * 0.22
    ly1 = size * 0.44
    lx2 = size * 0.42
    ly2 = size * 0.70
    e_draw.rounded_rectangle([lx1, ly1, lx2, ly2], radius=size * 0.04, fill=(255, 245, 238, 190))
    # mini line on left card
    e_draw.rounded_rectangle([lx1 + size * 0.03, ly1 + size * 0.04, lx2 - size * 0.03, ly1 + size * 0.06], radius=2, fill=(218, 114, 30, 90))
    
    # Right card
    rx1 = size * 0.58
    ry1 = size * 0.40
    rx2 = size * 0.78
    ry2 = size * 0.68
    e_draw.rounded_rectangle([rx1, ry1, rx2, ry2], radius=size * 0.04, fill=(255, 245, 238, 190))
    # mini line on right card
    e_draw.rounded_rectangle([rx1 + size * 0.03, ry1 + size * 0.04, rx2 - size * 0.03, ry1 + size * 0.06], radius=2, fill=(218, 114, 30, 90))
    
    # Center 'T' Top Bar
    tx1 = size * 0.22
    ty1 = size * 0.28
    tx2 = size * 0.78
    ty2 = size * 0.42
    e_draw.rounded_rectangle([tx1, ty1, tx2, ty2], radius=size * 0.04, fill=(255, 255, 255, 255))
    
    # Center 'T' Vertical Stem
    sx1 = size * 0.42
    sy1 = size * 0.38
    sx2 = size * 0.58
    sy2 = size * 0.76
    e_draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=size * 0.04, fill=(255, 255, 255, 255))
    
    # Checklist ticks inside vertical stem
    step_y = size * 0.08
    start_y = size * 0.46
    for i in range(3):
        cy = start_y + i * step_y
        cx = size * 0.50
        # small orange accent pill
        e_draw.rounded_rectangle([cx - size * 0.045, cy, cx + size * 0.045, cy + size * 0.02], radius=2, fill=(218, 114, 30, 160))
        
    # AI Warm Golden Sparkle (Top-Right)
    # Center of sparkle at (size * 0.76, size * 0.24)
    sp_cx = size * 0.75
    sp_cy = size * 0.25
    sp_r = size * 0.09
    
    # Draw diamond 4-pointed star
    star_pts = [
        (sp_cx, sp_cy - sp_r),
        (sp_cx + sp_r * 0.35, sp_cy - sp_r * 0.35),
        (sp_cx + sp_r, sp_cy),
        (sp_cx + sp_r * 0.35, sp_cy + sp_r * 0.35),
        (sp_cx, sp_cy + sp_r),
        (sp_cx - sp_r * 0.35, sp_cy + sp_r * 0.35),
        (sp_cx - sp_r, sp_cy),
        (sp_cx - sp_r * 0.35, sp_cy - sp_r * 0.35),
    ]
    # Golden glow
    e_draw.polygon(star_pts, fill=(251, 191, 36, 255))
    
    # Inner white diamond
    inner_r = sp_r * 0.45
    inner_pts = [
        (sp_cx, sp_cy - inner_r),
        (sp_cx + inner_r, sp_cy),
        (sp_cx, sp_cy + inner_r),
        (sp_cx - inner_r, sp_cy),
    ]
    e_draw.polygon(inner_pts, fill=(255, 255, 255, 255))
    
    # Drop shadow under emblem
    shadow = emblem.filter(ImageFilter.GaussianBlur(size * 0.025))
    # Multiply shadow alpha
    s_r, s_g, s_b, s_a = shadow.split()
    s_black = Image.new("RGBA", (size, size), (60, 20, 0, 0))
    s_black.putalpha(s_a.point(lambda a: int(a * 0.4)))
    
    # Composite shadow then emblem
    img = Image.alpha_composite(img, s_black)
    img = Image.alpha_composite(img, emblem)
    
    # Save optimized PNG
    img.save(filename, format="PNG", optimize=True)
    print(f"Generated {filename}: {size}x{size}")

# 1. Generate 256x256 (ideal for Vercel, ~20KB)
create_vercel_avatar_clean(256, "frontend/public/vercel-avatar-256.png")
create_vercel_avatar_clean(128, "frontend/public/vercel-avatar-128.png")
create_vercel_avatar_clean(512, "frontend/public/vercel-avatar.png")

# 2. Also create a 3D crop version that fits inside Vercel's circle crop without being too big
try:
    src_3d = Image.open("frontend/public/taskflow-avatar-3d.jpg")
    # Resize 3D to 256x256 with circular safe zone
    # Crop center slightly or pad it
    w, h = src_3d.size
    # Add a border or scale down to 85% so circle crop doesn't cut edges
    scaled = src_3d.resize((218, 218), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (256, 256), (20, 20, 25, 255))
    canvas.paste(scaled, (19, 19))
    canvas.save("frontend/public/taskflow-3d-vercel-256.png", format="PNG", optimize=True)
    print("Generated taskflow-3d-vercel-256.png")
except Exception as e:
    print("3D resize error:", e)
