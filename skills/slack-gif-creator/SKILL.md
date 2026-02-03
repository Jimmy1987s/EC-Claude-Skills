---
name: slack-gif-creator
description: 用於創建針對 Slack 優化的動畫 GIF 的工具套件，包含大小限制驗證器和可組合的動畫基元。當使用者請求從描述（如「幫我製作一個 X 做 Y 的 Slack GIF」）創建動畫 GIF 或表情符號動畫時，適用此技能。
license: 完整條款請見 LICENSE.txt
---

# Slack GIF 創建器 - 彈性工具套件

用於創建針對 Slack 優化的動畫 GIF 的工具套件。提供 Slack 限制的驗證器、可組合的動畫基元和選用的輔助工具。**可以根據需要應用這些工具來實現創意願景。**

## Slack 的要求

Slack 對不同用途的 GIF 有特定要求：

**訊息 GIF：**
- 最大大小：約 2MB
- 最佳尺寸：480x480
- 典型 FPS：15-20
- 顏色限制：128-256
- 時長：2-5 秒

**表情符號 GIF：**
- 最大大小：64KB（嚴格限制）
- 最佳尺寸：128x128
- 典型 FPS：10-12
- 顏色限制：32-48
- 時長：1-2 秒

**表情符號 GIF 具有挑戰性** - 64KB 限制非常嚴格。有幫助的策略：
- 限制總幀數為 10-15 幀
- 最多使用 32-48 種顏色
- 保持設計簡單
- 避免漸層
- 頻繁驗證檔案大小

## 工具套件結構

此技能提供三種類型的工具：

1. **驗證器** - 檢查 GIF 是否符合 Slack 的要求
2. **動畫基元** - 可組合的動態建構模塊（搖晃、彈跳、移動、萬花筒）
3. **輔助工具** - 常見需求的選用函數（文字、顏色、特效）

**在如何應用這些工具方面擁有完全的創作自由。**

## 核心驗證器

要確保 GIF 符合 Slack 的限制，請使用這些驗證器：

```python
from core.gif_builder import GIFBuilder

# 創建 GIF 後，檢查是否符合要求
builder = GIFBuilder(width=128, height=128, fps=10)
# ... 以任何方式添加幀 ...

# 儲存並檢查大小
info = builder.save('emoji.gif', num_colors=48, optimize_for_emoji=True)

# save 方法會自動警告檔案是否超過限制
# info 字典包含：size_kb、size_mb、frame_count、duration_seconds
```

**檔案大小驗證器**：
```python
from core.validators import check_slack_size

# 檢查 GIF 是否符合大小限制
passes, info = check_slack_size('emoji.gif', is_emoji=True)
# 返回：(True/False, 包含大小詳情的字典)
```

**尺寸驗證器**：
```python
from core.validators import validate_dimensions

# 檢查尺寸
passes, info = validate_dimensions(128, 128, is_emoji=True)
# 返回：(True/False, 包含尺寸詳情的字典)
```

**完整驗證**：
```python
from core.validators import validate_gif, is_slack_ready

# 執行所有驗證
all_pass, results = validate_gif('emoji.gif', is_emoji=True)

# 或快速檢查
if is_slack_ready('emoji.gif', is_emoji=True):
    print("準備上傳！")
```

## 動畫基元

這些是可組合的動態建構模塊。可以將這些以任何組合應用於任何物件：

### 搖晃
```python
from templates.shake import create_shake_animation

# 搖晃表情符號
frames = create_shake_animation(
    object_type='emoji',
    object_data={'emoji': '😱', 'size': 80},
    num_frames=20,
    shake_intensity=15,
    direction='both'  # 或 'horizontal'、'vertical'
)
```

### 彈跳
```python
from templates.bounce import create_bounce_animation

# 彈跳圓形
frames = create_bounce_animation(
    object_type='circle',
    object_data={'radius': 40, 'color': (255, 100, 100)},
    num_frames=30,
    bounce_height=150
)
```

### 旋轉
```python
from templates.spin import create_spin_animation, create_loading_spinner

# 順時針旋轉
frames = create_spin_animation(
    object_type='emoji',
    object_data={'emoji': '🔄', 'size': 100},
    rotation_type='clockwise',
    full_rotations=2
)

# 搖擺旋轉
frames = create_spin_animation(rotation_type='wobble', full_rotations=3)

# 載入轉圈
frames = create_loading_spinner(spinner_type='dots')
```

### 脈動 / 心跳
```python
from templates.pulse import create_pulse_animation, create_attention_pulse

# 平滑脈動
frames = create_pulse_animation(
    object_data={'emoji': '❤️', 'size': 100},
    pulse_type='smooth',
    scale_range=(0.8, 1.2)
)

# 心跳（雙重跳動）
frames = create_pulse_animation(pulse_type='heartbeat')

# 表情符號 GIF 的注意脈動
frames = create_attention_pulse(emoji='⚠️', num_frames=20)
```

### 淡入淡出
```python
from templates.fade import create_fade_animation, create_crossfade

# 淡入
frames = create_fade_animation(fade_type='in')

# 淡出
frames = create_fade_animation(fade_type='out')

# 兩個表情符號之間的交叉淡入淡出
frames = create_crossfade(
    object1_data={'emoji': '😊', 'size': 100},
    object2_data={'emoji': '😂', 'size': 100}
)
```

### 縮放
```python
from templates.zoom import create_zoom_animation, create_explosion_zoom

# 戲劇性放大
frames = create_zoom_animation(
    zoom_type='in',
    scale_range=(0.1, 2.0),
    add_motion_blur=True
)

# 縮小
frames = create_zoom_animation(zoom_type='out')

# 爆炸縮放
frames = create_explosion_zoom(emoji='💥')
```

### 爆炸 / 破碎
```python
from templates.explode import create_explode_animation, create_particle_burst

# 爆發式爆炸
frames = create_explode_animation(
    explode_type='burst',
    num_pieces=25
)

# 破碎效果
frames = create_explode_animation(explode_type='shatter')

# 溶解成粒子
frames = create_explode_animation(explode_type='dissolve')

# 粒子爆發
frames = create_particle_burst(particle_count=30)
```

### 搖擺 / 抖動
```python
from templates.wiggle import create_wiggle_animation, create_excited_wiggle

# 果凍搖晃
frames = create_wiggle_animation(
    wiggle_type='jello',
    intensity=1.0,
    cycles=2
)

# 波浪運動
frames = create_wiggle_animation(wiggle_type='wave')

# 表情符號 GIF 的興奮搖擺
frames = create_excited_wiggle(emoji='🎉')
```

### 滑動
```python
from templates.slide import create_slide_animation, create_multi_slide

# 從左側滑入並帶有過衝
frames = create_slide_animation(
    direction='left',
    slide_type='in',
    overshoot=True
)

# 滑過
frames = create_slide_animation(direction='left', slide_type='across')

# 多個物件依序滑入
objects = [
    {'data': {'emoji': '🎯', 'size': 60}, 'direction': 'left', 'final_pos': (120, 240)},
    {'data': {'emoji': '🎪', 'size': 60}, 'direction': 'right', 'final_pos': (240, 240)}
]
frames = create_multi_slide(objects, stagger_delay=5)
```

### 翻轉
```python
from templates.flip import create_flip_animation, create_quick_flip

# 兩個表情符號之間的水平翻轉
frames = create_flip_animation(
    object1_data={'emoji': '😊', 'size': 120},
    object2_data={'emoji': '😂', 'size': 120},
    flip_axis='horizontal'
)

# 垂直翻轉
frames = create_flip_animation(flip_axis='vertical')

# 表情符號 GIF 的快速翻轉
frames = create_quick_flip('👍', '👎')
```

### 變形 / 轉換
```python
from templates.morph import create_morph_animation, create_reaction_morph

# 交叉淡入淡出變形
frames = create_morph_animation(
    object1_data={'emoji': '😊', 'size': 100},
    object2_data={'emoji': '😂', 'size': 100},
    morph_type='crossfade'
)

# 縮放變形（一個縮小，另一個放大）
frames = create_morph_animation(morph_type='scale')

# 旋轉變形（類似 3D 翻轉）
frames = create_morph_animation(morph_type='spin_morph')
```

### 移動效果
```python
from templates.move import create_move_animation

# 線性移動
frames = create_move_animation(
    object_type='emoji',
    object_data={'emoji': '🚀', 'size': 60},
    start_pos=(50, 240),
    end_pos=(430, 240),
    motion_type='linear',
    easing='ease_out'
)

# 弧形移動（拋物線軌跡）
frames = create_move_animation(
    object_type='emoji',
    object_data={'emoji': '⚽', 'size': 60},
    start_pos=(50, 350),
    end_pos=(430, 350),
    motion_type='arc',
    motion_params={'arc_height': 150}
)

# 圓形移動
frames = create_move_animation(
    object_type='emoji',
    object_data={'emoji': '🌍', 'size': 50},
    motion_type='circle',
    motion_params={
        'center': (240, 240),
        'radius': 120,
        'angle_range': 360  # 完整圓
    }
)

# 波浪移動
frames = create_move_animation(
    motion_type='wave',
    motion_params={
        'wave_amplitude': 50,
        'wave_frequency': 2
    }
)

# 或使用底層緩動函數
from core.easing import interpolate, calculate_arc_motion

for i in range(num_frames):
    t = i / (num_frames - 1)
    x = interpolate(start_x, end_x, t, easing='ease_out')
    # 或：x, y = calculate_arc_motion(start, end, height, t)
```

### 萬花筒效果
```python
from templates.kaleidoscope import apply_kaleidoscope, create_kaleidoscope_animation

# 應用於單幀
kaleido_frame = apply_kaleidoscope(frame, segments=8)

# 或創建動畫萬花筒
frames = create_kaleidoscope_animation(
    base_frame=my_frame,  # 或 None 用於演示圖案
    num_frames=30,
    segments=8,
    rotation_speed=1.0
)

# 簡單鏡像效果（更快）
from templates.kaleidoscope import apply_simple_mirror

mirrored = apply_simple_mirror(frame, mode='quad')  # 4 向鏡像
# 模式：'horizontal'、'vertical'、'quad'、'radial'
```

**要自由組合基元，請遵循以下模式：**
```python
# 範例：彈跳 + 搖晃產生撞擊效果
for i in range(num_frames):
    frame = create_blank_frame(480, 480, bg_color)

    # 彈跳運動
    t_bounce = i / (num_frames - 1)
    y = interpolate(start_y, ground_y, t_bounce, 'bounce_out')

    # 撞擊時添加搖晃（當 y 到達地面時）
    if y >= ground_y - 5:
        shake_x = math.sin(i * 2) * 10
        x = center_x + shake_x
    else:
        x = center_x

    draw_emoji(frame, '⚽', (x, y), size=60)
    builder.add_frame(frame)
```

## 輔助工具

這些是常見需求的選用輔助工具。**可根據需要使用、修改或用自訂實作替換。**

### GIF 建構器（組裝與優化）

```python
from core.gif_builder import GIFBuilder

# 使用您選擇的設定創建建構器
builder = GIFBuilder(width=480, height=480, fps=20)

# 添加幀（無論您如何創建它們）
for frame in my_frames:
    builder.add_frame(frame)

# 帶優化儲存
builder.save('output.gif',
             num_colors=128,
             optimize_for_emoji=False)
```

主要功能：
- 自動顏色量化
- 移除重複幀
- Slack 限制的大小警告
- 表情符號模式（積極優化）

### 文字渲染

對於表情符號等小型 GIF，文字可讀性具有挑戰性。常見的解決方案涉及添加輪廓：

```python
from core.typography import draw_text_with_outline, TYPOGRAPHY_SCALE

# 帶輪廓的文字（有助於可讀性）
draw_text_with_outline(
    frame, "BONK!",
    position=(240, 100),
    font_size=TYPOGRAPHY_SCALE['h1'],  # 60px
    text_color=(255, 68, 68),
    outline_color=(0, 0, 0),
    outline_width=4,
    centered=True
)
```

要實作自訂文字渲染，請使用 PIL 的 `ImageDraw.text()`，這對於較大的 GIF 效果很好。

### 顏色管理

具有專業外觀的 GIF 通常使用統一的調色板：

```python
from core.color_palettes import get_palette

# 獲取預製調色板
palette = get_palette('vibrant')  # 或 'pastel'、'dark'、'neon'、'professional'

bg_color = palette['background']
text_color = palette['primary']
accent_color = palette['accent']
```

要直接使用顏色，請使用 RGB 元組 - 適用於任何使用情況。

### 視覺效果

用於撞擊時刻的選用效果：

```python
from core.visual_effects import ParticleSystem, create_impact_flash, create_shockwave_rings

# 粒子系統
particles = ParticleSystem()
particles.emit_sparkles(x=240, y=200, count=15)
particles.emit_confetti(x=240, y=200, count=20)

# 每幀更新和渲染
particles.update()
particles.render(frame)

# 閃光效果
frame = create_impact_flash(frame, position=(240, 200), radius=100)

# 衝擊波環
frame = create_shockwave_rings(frame, position=(240, 200), radii=[30, 60, 90])
```

### 緩動函數

平滑運動使用緩動而非線性插值：

```python
from core.easing import interpolate

# 物體下落（加速）
y = interpolate(start=0, end=400, t=progress, easing='ease_in')

# 物體著陸（減速）
y = interpolate(start=0, end=400, t=progress, easing='ease_out')

# 彈跳
y = interpolate(start=0, end=400, t=progress, easing='bounce_out')

# 過衝（彈性）
scale = interpolate(start=0.5, end=1.0, t=progress, easing='elastic_out')
```

可用緩動：`linear`、`ease_in`、`ease_out`、`ease_in_out`、`bounce_out`、`elastic_out`、`back_out`（過衝）等，更多在 `core/easing.py` 中。

### 幀組合

如果需要，提供基本繪圖工具：

```python
from core.frame_composer import (
    create_gradient_background,  # 漸層背景
    draw_emoji_enhanced,         # 帶可選陰影的表情符號
    draw_circle_with_shadow,     # 帶深度的形狀
    draw_star                    # 五角星
)

# 漸層背景
frame = create_gradient_background(480, 480, top_color, bottom_color)

# 帶陰影的表情符號
draw_emoji_enhanced(frame, '🎉', position=(200, 200), size=80, shadow=True)
```

## 優化策略

當您的 GIF 太大時：

**對於訊息 GIF（>2MB）：**
1. 減少幀數（降低 FPS 或縮短時長）
2. 減少顏色（128 → 64 色）
3. 減小尺寸（480x480 → 320x320）
4. 啟用重複幀移除

**對於表情符號 GIF（>64KB）- 要積極：**
1. 限制總幀數為 10-12 幀
2. 最多使用 32-40 種顏色
3. 避免漸層（純色壓縮效果更好）
4. 簡化設計（更少元素）
5. 在 save 方法中使用 `optimize_for_emoji=True`

## 範例組合模式

### 簡單反應（脈動）
```python
builder = GIFBuilder(128, 128, 10)

for i in range(12):
    frame = Image.new('RGB', (128, 128), (240, 248, 255))

    # 脈動縮放
    scale = 1.0 + math.sin(i * 0.5) * 0.15
    size = int(60 * scale)

    draw_emoji_enhanced(frame, '😱', position=(64-size//2, 64-size//2),
                       size=size, shadow=False)
    builder.add_frame(frame)

builder.save('reaction.gif', num_colors=40, optimize_for_emoji=True)

# 驗證
from core.validators import check_slack_size
check_slack_size('reaction.gif', is_emoji=True)
```

### 帶撞擊的動作（彈跳 + 閃光）
```python
builder = GIFBuilder(480, 480, 20)

# 第一階段：物體下落
for i in range(15):
    frame = create_gradient_background(480, 480, (240, 248, 255), (200, 230, 255))
    t = i / 14
    y = interpolate(0, 350, t, 'ease_in')
    draw_emoji_enhanced(frame, '⚽', position=(220, int(y)), size=80)
    builder.add_frame(frame)

# 第二階段：撞擊 + 閃光
for i in range(8):
    frame = create_gradient_background(480, 480, (240, 248, 255), (200, 230, 255))

    # 前幾幀閃光
    if i < 3:
        frame = create_impact_flash(frame, (240, 350), radius=120, intensity=0.6)

    draw_emoji_enhanced(frame, '⚽', position=(220, 350), size=80)

    # 文字出現
    if i > 2:
        draw_text_with_outline(frame, "GOAL!", position=(240, 150),
                              font_size=60, text_color=(255, 68, 68),
                              outline_color=(0, 0, 0), outline_width=4, centered=True)

    builder.add_frame(frame)

builder.save('goal.gif', num_colors=128)
```

### 組合基元（移動 + 搖晃）
```python
from templates.shake import create_shake_animation

# 創建搖晃動畫
shake_frames = create_shake_animation(
    object_type='emoji',
    object_data={'emoji': '😰', 'size': 70},
    num_frames=20,
    shake_intensity=12
)

# 創建觸發搖晃的移動元素
builder = GIFBuilder(480, 480, 20)
for i in range(40):
    t = i / 39

    if i < 20:
        # 觸發前 - 使用帶移動物件的空白幀
        frame = create_blank_frame(480, 480, (255, 255, 255))
        x = interpolate(50, 300, t * 2, 'linear')
        draw_emoji_enhanced(frame, '🚗', position=(int(x), 300), size=60)
        draw_emoji_enhanced(frame, '😰', position=(350, 200), size=70)
    else:
        # 觸發後 - 使用搖晃幀
        frame = shake_frames[i - 20]
        # 在最終位置添加汽車
        draw_emoji_enhanced(frame, '🚗', position=(300, 300), size=60)

    builder.add_frame(frame)

builder.save('scare.gif')
```

## 理念

此工具套件提供建構模塊，而非僵化的配方。要處理 GIF 請求：

1. **理解創意願景** - 應該發生什麼？什麼氛圍？
2. **設計動畫** - 分解為階段（預備、動作、反應）
3. **根據需要應用基元** - 搖晃、彈跳、移動、特效 - 自由混合
4. **驗證限制** - 檢查檔案大小，特別是表情符號 GIF
5. **如有需要則迭代** - 如果超過大小限制則減少幀數/顏色

**目標是在 Slack 技術限制內的創作自由。**

## 依賴項目

要使用此工具套件，如果尚未安裝這些依賴項目，請安裝：

```bash
pip install pillow imageio numpy
```
