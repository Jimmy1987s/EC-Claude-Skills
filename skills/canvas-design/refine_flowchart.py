#!/usr/bin/env python3
"""電腦報廢處理流程圖 - 第二輪精煉版"""

from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import os

# 註冊字體
font_dir = r"C:\Users\jimmy.nian\.claude\skills\canvas-design\canvas-fonts"
pdfmetrics.registerFont(TTFont('WorkSans', os.path.join(font_dir, 'WorkSans-Regular.ttf')))
pdfmetrics.registerFont(TTFont('WorkSansBold', os.path.join(font_dir, 'WorkSans-Bold.ttf')))
pdfmetrics.registerFont(TTFont('DMMono', os.path.join(font_dir, 'DMMono-Regular.ttf')))
pdfmetrics.registerFont(TTFont('GeistMono', os.path.join(font_dir, 'GeistMono-Regular.ttf')))

# 精煉色彩系統 - 更微妙的對比
BG_COLOR = HexColor('#FAFAF8')
STRUCTURE_DARK = HexColor('#1A1A1A')
STRUCTURE_MID = HexColor('#3D3D3D')
ACCENT_COLOR = HexColor('#D35400')  # 更深沉的工業橙
COMMON_BASE = HexColor('#546E7A')  # 共同步驟基色
DIFF_BASE = HexColor('#2C3E50')    # 差異步驟基色
TEXT_PRIMARY = HexColor('#0D0D0D')
TEXT_SECONDARY = HexColor('#6B7280')
SUBTLE_LINE = HexColor('#E5E7EB')  # 微妙的分隔線

# 頁面設定
PAGE_WIDTH, PAGE_HEIGHT = landscape(A3)
MARGIN_TOP = 75*mm
MARGIN_BOTTOM = 45*mm
MARGIN_LEFT = 45*mm
MARGIN_RIGHT = 45*mm

# 流程帶設定 - 更精確的間距
CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
FLOW_HEIGHT = 42*mm
FLOW_SPACING = (CONTENT_HEIGHT - 3*FLOW_HEIGHT) / 2.5

# 步驟模組設定 - 更細緻的尺寸
STEP_WIDTH = 82*mm
STEP_HEIGHT = 32*mm
STEP_RADIUS = 2*mm  # 更微妙的圓角

flows = {
    'flow1': {
        'label': '流程 1',
        'capacity': '250台/天',
        'staff': '4人配置',
        'note': '標籤寫編號',
        'steps': [
            {'text': 'Step 1\n提供序號清單', 'common': True, 'critical': False},
            {'text': 'Step 2\n核對電腦序號', 'common': True, 'critical': True},
            {'text': 'Step 3\n貼標籤+寫編號', 'common': False, 'critical': False},
            {'text': 'Step 4\n拆解硬碟+寫編號', 'common': True, 'critical': False},
            {'text': 'Step 5\n核對硬碟序號', 'common': True, 'critical': True},
            {'text': 'Step 6\n硬碟掃碼', 'common': True, 'critical': True},
            {'text': 'Step 7\n破壞裝袋貼標', 'common': True, 'critical': False}
        ]
    },
    'flow2': {
        'label': '流程 2',
        'capacity': '250台/天',
        'staff': '4人配置',
        'note': '標籤寫序號+編號',
        'steps': [
            {'text': 'Step 1\n提供序號清單', 'common': True, 'critical': False},
            {'text': 'Step 2\n核對電腦序號', 'common': True, 'critical': True},
            {'text': 'Step 3\n貼標籤+寫序號編號', 'common': False, 'critical': False},
            {'text': 'Step 4\n拆解硬碟+寫編號', 'common': True, 'critical': False},
            {'text': 'Step 5\n核對硬碟序號', 'common': True, 'critical': True},
            {'text': 'Step 6\n硬碟掃碼', 'common': True, 'critical': True},
            {'text': 'Step 7\n破壞裝袋貼標', 'common': True, 'critical': False}
        ]
    },
    'nanke': {
        'label': '南科流程',
        'capacity': '500台/天',
        'staff': '4人配置',
        'note': '先處理硬碟',
        'steps': [
            {'text': 'Step 1\n拆解硬碟', 'common': False, 'critical': False},
            {'text': 'Step 2\n硬碟掃碼', 'common': True, 'critical': True},
            {'text': 'Step 3\n破壞裝袋貼標', 'common': True, 'critical': False},
            {'text': 'Step 4\n貼電腦報廢標籤', 'common': False, 'critical': False}
        ]
    }
}

def draw_rounded_rect_refined(c, x, y, width, height, radius, fill_color, stroke_color, line_width, is_common):
    """精煉的圓角矩形 - 加入細微紋理感"""
    c.saveState()

    # 主體填充
    c.setFillColor(fill_color)
    c.setStrokeColor(stroke_color)
    c.setLineWidth(line_width)

    p = c.beginPath()
    p.moveTo(x + radius, y)
    p.lineTo(x + width - radius, y)
    p.arcTo(x + width - 2*radius, y, x + width, y + 2*radius, 0, 90)
    p.lineTo(x + width, y + height - radius)
    p.arcTo(x + width - 2*radius, y + height - 2*radius, x + width, y + height, 0, 90)
    p.lineTo(x + radius, y + height)
    p.arcTo(x, y + height - 2*radius, x + 2*radius, y + height, 0, 90)
    p.lineTo(x, y + radius)
    p.arcTo(x, y, x + 2*radius, y + 2*radius, 0, 90)
    p.close()

    c.drawPath(p, fill=1, stroke=1)

    # 微妙的內邊框強調
    if not is_common:
        c.setStrokeColor(ACCENT_COLOR)
        c.setLineWidth(0.8)
        inner_margin = 1.5*mm
        inner_p = c.beginPath()
        inner_p.moveTo(x + radius + inner_margin, y + inner_margin)
        inner_p.lineTo(x + width - radius - inner_margin, y + inner_margin)
        inner_p.arcTo(x + width - 2*radius - inner_margin, y + inner_margin,
                     x + width - inner_margin, y + 2*radius + inner_margin, 0, 90)
        inner_p.lineTo(x + width - inner_margin, y + height - radius - inner_margin)
        inner_p.arcTo(x + width - 2*radius - inner_margin, y + height - 2*radius - inner_margin,
                     x + width - inner_margin, y + height - inner_margin, 0, 90)
        inner_p.lineTo(x + radius + inner_margin, y + height - inner_margin)
        inner_p.arcTo(x + inner_margin, y + height - 2*radius - inner_margin,
                     x + 2*radius + inner_margin, y + height - inner_margin, 0, 90)
        inner_p.lineTo(x + inner_margin, y + radius + inner_margin)
        inner_p.arcTo(x + inner_margin, y + inner_margin,
                     x + 2*radius + inner_margin, y + 2*radius + inner_margin, 0, 90)
        inner_p.close()
        c.drawPath(inner_p, fill=0, stroke=1)

    c.restoreState()

def draw_arrow_refined(c, x1, y1, x2, y2, color, is_critical=False):
    """精煉的箭頭 - 更精確的幾何"""
    c.setStrokeColor(color)
    line_width = 1.5 if is_critical else 1.0
    c.setLineWidth(line_width)
    c.line(x1, y1, x2, y2)

    # 更精緻的箭頭設計
    arrow_size = 3.5*mm if is_critical else 3*mm
    c.setFillColor(color)
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(x2 - arrow_size, y2 + arrow_size/2.2)
    p.lineTo(x2 - arrow_size, y2 - arrow_size/2.2)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

def draw_flow_refined(c, flow_data, y_position, is_last=False):
    """精煉的流程繪製"""
    steps = flow_data['steps']
    num_steps = len(steps)

    # 動態計算間距
    content_width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - 110*mm
    total_step_width = STEP_WIDTH * num_steps
    total_gap = content_width - total_step_width
    step_gap = total_gap / (num_steps - 1) if num_steps > 1 else 0

    # 繪製微妙的背景條
    c.setFillColorRGB(SUBTLE_LINE.red, SUBTLE_LINE.green, SUBTLE_LINE.blue, 0.3)
    c.rect(MARGIN_LEFT, y_position, PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT,
           FLOW_HEIGHT, fill=1, stroke=0)

    # 流程標籤區域
    label_x = MARGIN_LEFT + 10*mm
    label_y = y_position + FLOW_HEIGHT/2

    c.setFont('WorkSansBold', 10)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(label_x, label_y + 10*mm, flow_data['label'])

    c.setFont('GeistMono', 6)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(label_x, label_y + 2*mm, flow_data['capacity'])
    c.drawString(label_x, label_y - 3*mm, flow_data['staff'])

    # 差異說明
    c.setFont('WorkSans', 5.5)
    c.setFillColor(ACCENT_COLOR)
    c.drawString(label_x, label_y - 9*mm, flow_data['note'])

    # 繪製步驟
    start_x = MARGIN_LEFT + 110*mm
    for i, step in enumerate(steps):
        x = start_x + i * (STEP_WIDTH + step_gap)
        y = y_position + (FLOW_HEIGHT - STEP_HEIGHT)/2

        # 顏色選擇
        if step['common']:
            fill_color = COMMON_BASE
            stroke_color = STRUCTURE_MID
            opacity = 0.88
        else:
            fill_color = DIFF_BASE
            stroke_color = STRUCTURE_DARK
            opacity = 1.0

        # 繪製步驟框
        c.saveState()
        c.setFillColorRGB(fill_color.red, fill_color.green, fill_color.blue, opacity)
        draw_rounded_rect_refined(c, x, y, STEP_WIDTH, STEP_HEIGHT, STEP_RADIUS,
                                  fill_color, stroke_color, 1.2, step['common'])
        c.restoreState()

        # 步驟編號小標記
        if step.get('critical', False):
            c.setFillColor(ACCENT_COLOR)
            c.circle(x + STEP_WIDTH - 5*mm, y + STEP_HEIGHT - 5*mm, 1.5*mm, fill=1, stroke=0)

        # 文字渲染
        c.setFont('WorkSans', 7.5)
        c.setFillColor(HexColor('#FFFFFF'))

        lines = step['text'].split('\n')
        text_y = y + STEP_HEIGHT/2 + (len(lines)-1)*2.2*mm
        for line in lines:
            text_width = c.stringWidth(line, 'WorkSans', 7.5)
            c.drawString(x + (STEP_WIDTH - text_width)/2, text_y, line)
            text_y -= 4.5*mm

        # 連接箭頭
        if i < num_steps - 1:
            next_step_critical = steps[i+1].get('critical', False)
            arrow_x1 = x + STEP_WIDTH + 1.5*mm
            arrow_x2 = x + STEP_WIDTH + step_gap - 1.5*mm
            arrow_y = y + STEP_HEIGHT/2
            arrow_color = ACCENT_COLOR if next_step_critical else STRUCTURE_MID
            draw_arrow_refined(c, arrow_x1, arrow_y, arrow_x2, arrow_y,
                             arrow_color, next_step_critical)

    # 流程分隔線（除了最後一個）
    if not is_last:
        c.setStrokeColor(SUBTLE_LINE)
        c.setLineWidth(0.5)
        c.line(MARGIN_LEFT + 110*mm, y_position - FLOW_SPACING/2,
               PAGE_WIDTH - MARGIN_RIGHT, y_position - FLOW_SPACING/2)

def main():
    """主函數"""
    output_path = r"C:\Users\jimmy.nian\.claude\skills\canvas-design\電腦報廢處理流程圖.pdf"

    c = canvas.Canvas(output_path, pagesize=landscape(A3))

    # 背景
    c.setFillColor(BG_COLOR)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # 主標題 - 更低調但有力
    c.setFont('WorkSans', 7)
    c.setFillColor(TEXT_SECONDARY)
    title_text = "報 廢 處 理 系 統"
    title_width = c.stringWidth(title_text, 'WorkSans', 7)
    c.drawString((PAGE_WIDTH - title_width)/2, PAGE_HEIGHT - 55*mm, title_text)

    # 精煉的圖例
    legend_x = PAGE_WIDTH - MARGIN_RIGHT - 95*mm
    legend_y = PAGE_HEIGHT - 62*mm

    c.setFont('GeistMono', 5.5)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(legend_x, legend_y + 10*mm, "共同流程")
    c.drawString(legend_x, legend_y + 3*mm, "差異流程")
    c.drawString(legend_x, legend_y - 4*mm, "●  關鍵步驟")

    c.saveState()
    c.setFillColorRGB(COMMON_BASE.red, COMMON_BASE.green, COMMON_BASE.blue, 0.88)
    c.roundRect(legend_x - 10*mm, legend_y + 9*mm, 6*mm, 3*mm, 0.5*mm, fill=1, stroke=0)
    c.restoreState()

    c.setFillColor(DIFF_BASE)
    c.roundRect(legend_x - 10*mm, legend_y + 2*mm, 6*mm, 3*mm, 0.5*mm, fill=1, stroke=0)

    c.setFillColor(ACCENT_COLOR)
    c.circle(legend_x - 7*mm, legend_y - 3*mm, 1.5*mm, fill=1, stroke=0)

    # 繪製三個流程
    y_positions = [
        MARGIN_BOTTOM + 2*FLOW_HEIGHT + 1.8*FLOW_SPACING,
        MARGIN_BOTTOM + FLOW_HEIGHT + 0.8*FLOW_SPACING,
        MARGIN_BOTTOM
    ]

    for idx, (flow_key, y_pos) in enumerate(zip(['flow1', 'flow2', 'nanke'], y_positions)):
        is_last = (idx == 2)
        draw_flow_refined(c, flows[flow_key], y_pos, is_last)

    # 底部註記
    c.setFont('GeistMono', 4.5)
    c.setFillColor(TEXT_SECONDARY)
    note_text = "Process Optimization Chart  |  Industrial Design System"
    c.drawString(MARGIN_LEFT, 20*mm, note_text)

    c.save()
    print(f"精煉版流程圖已生成: {output_path}")

if __name__ == "__main__":
    main()
