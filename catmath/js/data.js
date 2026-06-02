var MathApp = window.MathApp || {};

MathApp.DATA = {
  grades: [
    {
      id: 1, name: "一年级", icon: "1️⃣", color: "#FF6B6B",
      semesters: [
        {
          id: "1-1", name: "上册", topics: [
            { id: "1-1-01", name: "1-10的认识", desc: "认识1到10各数，会读会写", type: "number_recognition" },
            { id: "1-1-02", name: "比较大小", desc: "比较物体的多少、大小、长短", type: "comparison" },
            { id: "1-1-03", name: "1-5的加减法", desc: "掌握5以内的加法和减法", type: "add_sub_within5" },
            { id: "1-1-04", name: "分类", desc: "按不同标准对物体分类", type: "classification" },
            { id: "1-1-05", name: "位置与顺序", desc: "认识前后、上下、左右", type: "position" },
            { id: "1-1-06", name: "认识图形(一)", desc: "认识长方体、正方体、圆柱、球", type: "shapes_3d" },
            { id: "1-1-07", name: "6-10的加减法", desc: "掌握10以内的加法和减法", type: "add_sub_within10" },
            { id: "1-1-08", name: "认识钟表", desc: "认识整时和半时", type: "clock" },
            { id: "1-1-09", name: "20以内的不进位加法", desc: "十几加几的不进位加法", type: "add_no_carry_20" }
          ]
        },
        {
          id: "1-2", name: "下册", topics: [
            { id: "1-2-01", name: "20以内退位减法", desc: "掌握20以内的退位减法", type: "sub_carry_20" },
            { id: "1-2-02", name: "观察物体", desc: "从不同方向观察物体", type: "observation" },
            { id: "1-2-03", name: "100以内数的认识", desc: "认识100以内的数", type: "number_within100" },
            { id: "1-2-04", name: "认识图形(二)", desc: "认识长方形、正方形、三角形、圆", type: "shapes_2d" },
            { id: "1-2-05", name: "100以内不进位加法", desc: "整十数加减、两位数加减一位数(不进位)", type: "add_no_carry_100" },
            { id: "1-2-06", name: "100以内不退位减法", desc: "两位数减一位数(不退位)", type: "sub_no_carry_100" },
            { id: "1-2-07", name: "100以内进位加法", desc: "两位数加一位数(进位)", type: "add_carry_100" },
            { id: "1-2-08", name: "100以内退位减法", desc: "两位数减一位数(退位)", type: "sub_carry_100" },
            { id: "1-2-09", name: "认识人民币", desc: "认识元、角、分及简单计算", type: "money" }
          ]
        }
      ]
    },
    {
      id: 2, name: "二年级", icon: "2️⃣", color: "#4ECDC4",
      semesters: [
        {
          id: "2-1", name: "上册", topics: [
            { id: "2-1-01", name: "连加连减", desc: "100以内的连加连减", type: "chain_add_sub_100" },
            { id: "2-1-02", name: "加减混合运算", desc: "100以内加减混合运算", type: "mixed_add_sub_100" },
            { id: "2-1-03", name: "乘法的初步认识", desc: "理解乘法的意义", type: "multiplication_intro" },
            { id: "2-1-04", name: "2-5的乘法口诀", desc: "背诵并运用2-5的乘法口诀", type: "mul_2_5" },
            { id: "2-1-05", name: "测量(厘米和米)", desc: "认识厘米和米", type: "length_cm_m" },
            { id: "2-1-06", name: "6-9的乘法口诀", desc: "背诵并运用6-9的乘法口诀", type: "mul_6_9" },
            { id: "2-1-07", name: "除法的初步认识", desc: "理解除法的意义", type: "division_intro" },
            { id: "2-1-08", name: "用乘法口诀求商", desc: "利用乘法口诀计算除法", type: "div_by_table" }
          ]
        },
        {
          id: "2-2", name: "下册", topics: [
            { id: "2-2-01", name: "有余数的除法", desc: "理解余数的含义", type: "div_with_remainder" },
            { id: "2-2-02", name: "方向与位置", desc: "认识东南西北", type: "direction" },
            { id: "2-2-03", name: "生活中的大数", desc: "认识万以内的数", type: "number_within10000" },
            { id: "2-2-04", name: "测量(分米毫米千米)", desc: "认识分米、毫米、千米", type: "length_dm_mm_km" },
            { id: "2-2-05", name: "万以内加减法", desc: "三位数加减法", type: "add_sub_within10000" },
            { id: "2-2-06", name: "认识图形", desc: "认识角、长方形、正方形、平行四边形", type: "shapes_angle" },
            { id: "2-2-07", name: "时分秒", desc: "认识时、分、秒及其关系", type: "time_hms" },
            { id: "2-2-08", name: "调查与记录", desc: "简单的数据收集与整理", type: "data_collection" }
          ]
        }
      ]
    },
    {
      id: 3, name: "三年级", icon: "3️⃣", color: "#45B7D1",
      semesters: [
        {
          id: "3-1", name: "上册", topics: [
            { id: "3-1-01", name: "混合运算", desc: "含有两级运算的混合运算", type: "mixed_operations" },
            { id: "3-1-02", name: "观察物体", desc: "从不同方向观察物体", type: "observation_3d" },
            { id: "3-1-03", name: "加与减", desc: "万以内加减法", type: "add_sub_10000" },
            { id: "3-1-04", name: "乘与除", desc: "一位数乘除两位数", type: "mul_div_1digit" },
            { id: "3-1-05", name: "周长", desc: "长方形和正方形的周长", type: "perimeter" },
            { id: "3-1-06", name: "乘法", desc: "两位数乘一位数", type: "mul_2by1" },
            { id: "3-1-07", name: "年月日", desc: "认识年、月、日的关系", type: "date_year" },
            { id: "3-1-08", name: "认识小数", desc: "初步认识小数", type: "decimal_intro" }
          ]
        },
        {
          id: "3-2", name: "下册", topics: [
            { id: "3-2-01", name: "除法", desc: "三位数除以一位数", type: "div_3by1" },
            { id: "3-2-02", name: "图形的运动", desc: "平移、旋转和轴对称", type: "transformation" },
            { id: "3-2-03", name: "乘法", desc: "两位数乘两位数", type: "mul_2by2" },
            { id: "3-2-04", name: "面积", desc: "认识面积及长方形正方形面积", type: "area" },
            { id: "3-2-05", name: "认识分数", desc: "初步认识分数", type: "fraction_intro" },
            { id: "3-2-06", name: "数据的整理和表示", desc: "条形统计图", type: "bar_chart" }
          ]
        }
      ]
    },
    {
      id: 4, name: "四年级", icon: "4️⃣", color: "#96CEB4",
      semesters: [
        {
          id: "4-1", name: "上册", topics: [
            { id: "4-1-01", name: "认识更大的数", desc: "万以上的数、近似数", type: "large_numbers" },
            { id: "4-1-02", name: "线与角", desc: "线段、射线、直线、角的认识与度量", type: "lines_angles" },
            { id: "4-1-03", name: "乘法", desc: "三位数乘两位数", type: "mul_3by2" },
            { id: "4-1-04", name: "运算律", desc: "加法和乘法的交换律、结合律、分配律", type: "operation_laws" },
            { id: "4-1-05", name: "方向与位置", desc: "用数对确定位置", type: "coordinate" },
            { id: "4-1-06", name: "除法", desc: "三位数除以两位数", type: "div_3by2" },
            { id: "4-1-07", name: "生活中的负数", desc: "初步认识负数", type: "negative_intro" }
          ]
        },
        {
          id: "4-2", name: "下册", topics: [
            { id: "4-2-01", name: "小数的意义和加减法", desc: "小数的意义、比较大小、加减运算", type: "decimal_add_sub" },
            { id: "4-2-02", name: "认识三角形和四边形", desc: "三角形分类、内角和、四边形分类", type: "triangle_quad" },
            { id: "4-2-03", name: "小数乘法", desc: "小数乘整数、小数乘小数", type: "decimal_mul" },
            { id: "4-2-04", name: "观察物体", desc: "从不同方向观察立体图形", type: "observation_3d_adv" },
            { id: "4-2-05", name: "认识方程", desc: "用字母表示数、等式与方程", type: "equation_intro" },
            { id: "4-2-06", name: "数据的表示和分析", desc: "折线统计图", type: "line_chart" }
          ]
        }
      ]
    },
    {
      id: 5, name: "五年级", icon: "5️⃣", color: "#FFEAA7",
      semesters: [
        {
          id: "5-1", name: "上册", topics: [
            { id: "5-1-01", name: "小数除法", desc: "小数除法的计算方法", type: "decimal_div" },
            { id: "5-1-02", name: "轴对称和平移", desc: "进一步认识轴对称和平移", type: "symmetry_translation" },
            { id: "5-1-03", name: "倍数与因数", desc: "2/3/5的倍数特征、质数与合数", type: "factors_multiples" },
            { id: "5-1-04", name: "多边形的面积", desc: "平行四边形、三角形、梯形的面积", type: "polygon_area" },
            { id: "5-1-05", name: "分数的意义", desc: "分数的意义、分数与除法的关系", type: "fraction_meaning" },
            { id: "5-1-06", name: "组合图形的面积", desc: "估算和计算组合图形面积", type: "composite_area" },
            { id: "5-1-07", name: "可能性", desc: "可能性的大小", type: "probability" }
          ]
        },
        {
          id: "5-2", name: "下册", topics: [
            { id: "5-2-01", name: "分数加减法", desc: "异分母分数加减法", type: "fraction_add_sub" },
            { id: "5-2-02", name: "长方体(一)", desc: "长方体的特征和表面积", type: "cuboid_surface" },
            { id: "5-2-03", name: "分数乘法", desc: "分数乘整数、分数乘分数", type: "fraction_mul" },
            { id: "5-2-04", name: "长方体(二)", desc: "长方体的体积", type: "cuboid_volume" },
            { id: "5-2-05", name: "分数除法", desc: "分数除以整数、整数除以分数", type: "fraction_div" },
            { id: "5-2-06", name: "确定位置", desc: "用方向和距离确定位置", type: "position_direction" },
            { id: "5-2-07", name: "用方程解决问题", desc: "列方程解应用题", type: "equation_solving" },
            { id: "5-2-08", name: "数据的表示和分析", desc: "复式条形图和折线图", type: "data_representation" }
          ]
        }
      ]
    },
    {
      id: 6, name: "六年级", icon: "6️⃣", color: "#DDA0DD",
      semesters: [
        {
          id: "6-1", name: "上册", topics: [
            { id: "6-1-01", name: "圆", desc: "圆的认识、周长和面积", type: "circle" },
            { id: "6-1-02", name: "分数混合运算", desc: "分数的加减乘除混合运算", type: "fraction_mixed" },
            { id: "6-1-03", name: "观察物体", desc: "观察范围", type: "observation_range" },
            { id: "6-1-04", name: "百分数", desc: "百分数的认识和互化", type: "percent" },
            { id: "6-1-05", name: "数据处理", desc: "扇形统计图", type: "pie_chart" },
            { id: "6-1-06", name: "比的认识", desc: "比的意义和性质", type: "ratio" },
            { id: "6-1-07", name: "百分数的应用", desc: "百分数的实际应用", type: "percent_application" }
          ]
        },
        {
          id: "6-2", name: "下册", topics: [
            { id: "6-2-01", name: "圆柱与圆锥", desc: "圆柱和圆锥的表面积与体积", type: "cylinder_cone" },
            { id: "6-2-02", name: "比例", desc: "比例的意义和基本性质", type: "proportion" },
            { id: "6-2-03", name: "图形的运动", desc: "图形的旋转与缩放", type: "rotation_scaling" },
            { id: "6-2-04", name: "正比例与反比例", desc: "正比例和反比例的判断", type: "direct_inverse_prop" },
            { id: "6-2-05", name: "数学好玩", desc: "有趣的数学问题", type: "math_fun" },
            { id: "6-2-06", name: "总复习-数与代数", desc: "小学数学总复习数与代数部分", type: "review_algebra" },
            { id: "6-2-07", name: "总复习-图形与几何", desc: "小学数学总复习图形与几何部分", type: "review_geometry" },
            { id: "6-2-08", name: "总复习-统计与概率", desc: "小学数学总复习统计与概率部分", type: "review_stats" }
          ]
        }
      ]
    }
  ]
};

window.MathApp = MathApp;
