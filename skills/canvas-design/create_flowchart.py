#!/usr/bin/env python3
"""電腦報廢處理流程圖 - 工業編排美學"""

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

# 顏色定義 - 工業色彩系統
BG_COLOR = HexColor('#F8F8F6')  # 技術圖紙底色
STRUCTURE_DARK = HexColor('#2C2C2C')  # 深灰結構色
STRUCTURE_MID = HexColor('#4A4A4A')  # 中灰
ACCENT_ORANGE = HexColor('#E67E22')  # 工業警示橙
COMMON_STEP = HexColor('#5D6D7E')  # 共同步驟色
DIFF_STEP = HexColor('#34495E')  # 差異步驟色
TEXT_PRIMARY = HexColor('#1C1C1C')  # 主要文字
TEXT_SECONDARY = HexColor('#7F8C8D')  # 次要文字

# 頁面設定
PAGE_WIDTH, PAGE_HEIGHT = landscape(A3)
MARGIN_TOP = 80*mm
MARGIN_BOTTOM = 40*mm
MARGIN_LEFT = 40*mm
MARGIN_RIGHT = 40*mm

# 流程帶設定
CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
FLOW_HEIGHT = CONTENT_HEIGHT / 3.3  # 三個流程帶
FLOW_SPACING = (CONTENT_HEIGHT - 3*FLOW_HEIGHT) / 2  # 流程間距

# 步驟模組設定
STEP_WIDTH = 85*mm
STEP_HEIGHT = 35*mm
STEP_RADIUS = 3*mm

# 流程定義
flows = {
    'flow1': {
        'label': '流程 1',
        'capacity': '250台/天',
        'staff': '4人配置',
        'steps': [
            {'text': 'Step 1\n提供序號清單', 'common': True},
            {'text': 'Step 2\n核對電腦序號', 'common': True},
            {'text': 'Step 3\n貼標籤+寫編號', 'common': False},
            {'text': 'Step 4\n拆解硬碟+寫編號', 'common': True},
            {'text': 'Step 5\n核對硬碟序號', 'common': True},
            {'text': 'Step 6\n硬碟掃碼', 'common': True},
            {'text': 'Step 7\n破壞裝袋貼標', 'common': True}
        ]
    },
    'flow2': {
        'label': '流程 2',
        'capacity': '250台/天',
        'staff': '4人配置',
        'steps': [
            {'text': 'Step 1\n提供序號清單', 'common': True},
            {'text': 'Step 2\n核對電腦序號', 'common': True},
            {'text': 'Step 3\n貼標籤+寫序號編號', 'common': False},
            {'text': 'Step 4\n拆解硬碟+寫編號', 'common': True},
            {'text': 'Step 5\n核對硬碟序號', 'common': True},
            {'text': 'Step 6\n硬碟掃碼', 'common': True},
            {'text': 'Step 7\n破壞裝袋貼標', 'common': True}
        ]
    },
    'nanke': {
        'label': '南科流程',
        'capacity': '500台/天',
        'staff': '4人配置',
        'steps': [
            {'text': 'Step 1\n拆解硬碟', 'common': False},
            {'text': 'Step 2\n硬碟掃碼', 'common': True},
            {'text': 'Step 3\n破壞裝袋貼標', 'common': True},
            {'text': 'Step 4\n貼電腦報廢標籤', 'common': False}
        ]
    }
}

def draw_rounded_rect(c, x, y, width, height, radius, fill_color, stroke_color, line_width=1):
    """繪製圓角矩形"""
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

def draw_arrow(c, x1, y1, x2, y2, color):
    """繪製精確的箭頭連接線"""
    c.setStrokeColor(color)
    c.setLineWidth(1.2)
    c.line(x1, y1, x2, y2)

    # 箭頭
    arrow_size = 4*mm
    c.setFillColor(color)
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(x2 - arrow_size, y2 + arrow_size/2)
    p.lineTo(x2 - arrow_size, y2 - arrow_size/2)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

def draw_flow(c, flow_data, y_position):
    """繪製單一流程帶"""
    steps = flow_data['steps']
    num_steps = len(steps)

    # 計算步驟間距
    content_width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - 100*mm  # 保留標籤空間
    total_step_width = STEP_WIDTH * num_steps
    total_gap = content_width - total_step_width
    step_gap = total_gap / (num_steps - 1) if num_steps > 1 else 0

    # 繪製流程標籤
    label_x = MARGIN_LEFT
    label_y = y_position + FLOW_HEIGHT/2

    c.setFont('WorkSansBold', 9)
    c.setFillColor(TEXT_PRIMARY)
    c.drawString(label_x, label_y + 8*mm, flow_data['label'])

    c.setFont('DMMono', 6.5)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(label_x, label_y, flow_data['capacity'])
    c.drawString(label_x, label_y - 4*mm, flow_data['staff'])

    # 繪製步驟
    start_x = MARGIN_LEFT + 100*mm
    for i, step in enumerate(steps):
        x = start_x + i * (STEP_WIDTH + step_gap)
        y = y_position + (FLOW_HEIGHT - STEP_HEIGHT)/2

        # 根據是否為共同步驟選擇顏色
        if step['common']:
            fill_color = COMMON_STEP
            opacity = 0.85
        else:
            fill_color = DIFF_STEP
            opacity = 1.0

        # 繪製步驟框
        c.saveState()
        c.setFillColorRGB(fill_color.red, fill_color.green, fill_color.blue, opacity)
        draw_rounded_rect(c, x, y, STEP_WIDTH, STEP_HEIGHT, STEP_RADIUS,
                         fill_color, STRUCTURE_DARK, 1.5)
        c.restoreState()

        # 繪製步驟文字
        c.setFont('WorkSans', 7)
        c.setFillColor(HexColor('#FFFFFF'))

        lines = step['text'].split('\n')
        text_y = y + STEP_HEIGHT/2 + (len(lines)-1)*2*mm
        for line in lines:
            text_width = c.stringWidth(line, 'WorkSans', 7)
            c.drawString(x + (STEP_WIDTH - text_width)/2, text_y, line)
            text_y -= 4*mm

        # 繪製箭頭（除了最後一步）
        if i < num_steps - 1:
            arrow_x1 = x + STEP_WIDTH + 2*mm
            arrow_x2 = x + STEP_WIDTH + step_gap - 2*mm
            arrow_y = y + STEP_HEIGHT/2
            draw_arrow(c, arrow_x1, arrow_y, arrow_x2, arrow_y, STRUCTURE_MID)

def main():
    """主函數"""
    output_path = r"C:\Users\jimmy.nian\.claude\skills\canvas-design\電腦報廢處理流程圖.pdf"

    c = canvas.Canvas(output_path, pagesize=landscape(A3))

    # 背景
    c.setFillColor(BG_COLOR)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    # 標題
    c.setFont('WorkSans', 8)
    c.setFillColor(TEXT_SECONDARY)
    title_text = "報廢處理系統"
    title_width = c.stringWidth(title_text, 'WorkSans', 8)
    c.drawString((PAGE_WIDTH - title_width)/2, PAGE_HEIGHT - 50*mm, title_text)

    # 圖例
    legend_x = PAGE_WIDTH - MARGIN_RIGHT - 100*mm
    legend_y = PAGE_HEIGHT - 60*mm

    c.setFont('DMMono', 6)
    c.setFillColor(TEXT_SECONDARY)
    c.drawString(legend_x, legend_y + 8*mm, "■ 共同流程")
    c.drawString(legend_x, legend_y, "■ 差異流程")

    c.setFillColorRGB(COMMON_STEP.red, COMMON_STEP.green, COMMON_STEP.blue, 0.85)
    c.rect(legend_x - 8*mm, legend_y + 7*mm, 5*mm, 2.5*mm, fill=1, stroke=0)

    c.setFillColor(DIFF_STEP)
    c.rect(legend_x - 8*mm, legend_y - 1*mm, 5*mm, 2.5*mm, fill=1, stroke=0)

    # 繪製三個流程
    y_positions = [
        MARGIN_BOTTOM + 2*FLOW_HEIGHT + 2*FLOW_SPACING,  # 流程1
        MARGIN_BOTTOM + FLOW_HEIGHT + FLOW_SPACING,       # 流程2
        MARGIN_BOTTOM                                      # 南科
    ]

    for (flow_key, y_pos) in zip(['flow1', 'flow2', 'nanke'], y_positions):
        draw_flow(c, flows[flow_key], y_pos)

    c.save()
    print(f"流程圖已生成: {output_path}")

if __name__ == "__main__":
    main()
