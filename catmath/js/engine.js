(function () {
  var E = {};

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[rand(0, arr.length - 1)]; }
  function shuffle(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rand(0, i); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % t; a = t; } return a; }
  function simplify(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  var CN = ["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"];
  function numCN(n) { if (n >= 0 && n < CN.length) return CN[n]; return String(n); }
  function fracStr(n, d) {
    if (d === 1) return String(n);
    var prefix = n < 0 ? "-" : "";
    var absN = Math.abs(n);
    return prefix + "$$\\dfrac{" + absN + "}{" + d + "}$$";
  }
  function fracAns(n, d) {
    if (d === 1) return String(n);
    var prefix = n < 0 ? "-" : "";
    var absN = Math.abs(n);
    return prefix + absN + "/" + d;
  }
  function mixedStr(whole, n, d) {
    if (n === 0) return String(whole);
    return "$$" + whole + "\\,\\dfrac{" + n + "}{" + d + "}$$";
  }
  function mixedAns(whole, n, d) {
    if (n === 0) return String(whole);
    return whole + "又" + n + "/" + d;
  }
  function wrapFrac(q, n, d, hint) {
    var ansDisplay = fracStr(n, d);
    var ansCompare = fracAns(n, d);
    var choices = [ansDisplay];
    var seen = {};
    seen[n + "/" + d] = true;
    var attempts = 0;
    while (choices.length < 4 && attempts < 80) {
      attempts++;
      var wn = n + rand(-2, 2);
      var wd = d + rand(-2, 2);
      if (wn < 1) wn = rand(1, d - 1);
      if (wd < 2) wd = d + rand(1, 2);
      if (wn >= wd) wn = rand(1, wd - 1);
      if (wn < 1 || wd < 2) continue;
      var sg = gcd(wn, wd);
      var sk = (wn / sg) + "/" + (wd / sg);
      if (!seen[sk] && sk !== n + "/" + d) {
        seen[sk] = true;
        choices.push(fracStr(wn, wd));
      }
    }
    while (choices.length < 4) {
      var rn = rand(1, 5), rd = rand(2, 8);
      choices.push(fracStr(rn, rd));
    }
    return { question: q, answer: ansDisplay, hint: hint || "", type: "choice", choices: shuffle(choices), _ansCompare: ansCompare };
  }
  function wrapFracMixed(q, whole, n, d, hint) {
    var ansDisplay = mixedStr(whole, n, d);
    var ansCompare = mixedAns(whole, n, d);
    var choices = [ansDisplay];
    var seen = {};
    seen[ansCompare] = true;
    var attempts = 0;
    while (choices.length < 4 && attempts < 80) {
      attempts++;
      var wn = n + rand(-1, 1);
      var wd = d + rand(-1, 1);
      if (wn < 1) wn = 1;
      if (wd < 2) wd = d;
      if (wn >= wd) wn = wd - 1;
      var wDisplay = mixedStr(whole, wn, wd);
      var wCompare = mixedAns(whole, wn, wd);
      if (!seen[wCompare] && wCompare !== ansCompare) {
        seen[wCompare] = true;
        choices.push(wDisplay);
      }
    }
    while (choices.length < 4) {
      var rn = rand(1, 2), rd = rand(2, 5);
      choices.push(mixedStr(whole, rn, rd));
    }
    return { question: q, answer: ansDisplay, hint: hint || "", type: "choice", choices: shuffle(choices), _ansCompare: ansCompare };
  }

  function makeChoices(answer, gen, count) {
    count = count || 4;
    var choices = [answer];
    var seen = {};
    seen[String(answer)] = true;
    var attempts = 0;
    while (choices.length < count && attempts < 50) {
      attempts++;
      var wrong = gen();
      var key = String(wrong);
      if (!seen[key] && wrong !== answer && !isNaN(wrong) && isFinite(wrong)) {
        seen[key] = true;
        choices.push(wrong);
      }
    }
    while (choices.length < count) {
      choices.push(answer + choices.length);
    }
    return shuffle(choices);
  }

  function wrap(q, answer, hint) {
    var choices = generateChoices(answer);
    return { question: q, answer: answer, hint: hint || "", type: "choice", choices: choices };
  }

  function generateChoices(answer) {
    var ans = answer;
    var choices = [ans];
    var seen = {};
    seen[String(ans)] = true;
    var attempts = 0;
    while (choices.length < 4 && attempts < 50) {
      attempts++;
      var wrong;
      if (typeof ans === "number" || !isNaN(Number(ans))) {
        var numAns = Number(ans);
        var offset = rand(1, Math.max(5, Math.abs(numAns)));
        wrong = numAns + (Math.random() > 0.5 ? offset : -offset);
        if (Number.isInteger(numAns)) wrong = Math.round(wrong);
      } else {
        wrong = ans + String(rand(1, 9));
      }
      var key = String(wrong);
      if (!seen[key] && wrong !== ans) {
        seen[key] = true;
        choices.push(typeof ans === "number" || !isNaN(Number(ans)) ? (typeof ans === "number" ? wrong : String(wrong)) : wrong);
      }
    }
    while (choices.length < 4) {
      choices.push("选项" + choices.length);
    }
    return shuffle(choices);
  }

  function wrapFill(q, answer, hint) {
    return { question: q, answer: answer, hint: hint || "", type: "fill" };
  }

  var generators = {};

  generators.number_recognition = function () {
    var n = rand(1, 10);
    var q = "请数一数，" + n + "个苹果用数字怎么表示？";
    return wrap(q, n, "1-10的认识");
  };

  generators.comparison = function () {
    var a = rand(1, 20), b = rand(1, 20);
    if (a === b) b = a + 1;
    var sym = a > b ? ">" : "<";
    var q = "比较大小：" + a + " ___ " + b;
    return wrap(q, sym, "大于用>，小于用<");
  };

  generators.add_sub_within5 = function () {
    if (Math.random() > 0.5) {
      var a = rand(1, 5), b = rand(1, 5 - a);
      return wrap(a + " + " + b + " = ?", a + b, "5以内加法");
    } else {
      var a2 = rand(2, 5), b2 = rand(1, a2);
      return wrap(a2 + " - " + b2 + " = ?", a2 - b2, "5以内减法");
    }
  };

  generators.classification = function () {
    var types = [
      { group: "水果", items: ["苹果", "香蕉", "橘子"], odd: "小狗" },
      { group: "动物", items: ["小猫", "小狗", "小鱼"], odd: "桌子" },
      { group: "文具", items: ["铅笔", "橡皮", "尺子"], odd: "苹果" }
    ];
    var t = pick(types);
    var q = "下面哪个和其他不是一类？" + t.items.concat([t.odd]).join("、");
    return wrap(q, t.odd, "按类别分类");
  };

  generators.position = function () {
    var dirs = ["前面", "后面", "上面", "下面", "左边", "右边"];
    var d = pick(dirs);
    var contexts = [
      "小明站在小红" + d + "，那么小红站在小明的___",
      "书在桌子的" + d + "，这是相对___的位置"
    ];
    var opposites = { "前面": "后面", "后面": "前面", "上面": "下面", "下面": "上面", "左边": "右边", "右边": "左边" };
    var q = pick(contexts);
    var ans = q.indexOf("相对") >= 0 ? "观察者" : opposites[d];
    return wrap(q, ans, "位置是相对的");
  };

  generators.shapes_3d = function () {
    var shapes = [
      { name: "长方体", faces: 6, feature: "有6个面" },
      { name: "正方体", faces: 6, feature: "6个面都一样大" },
      { name: "圆柱", faces: 3, feature: "有两个圆形底面" },
      { name: "球", faces: 1, feature: "没有平面" }
    ];
    var s = pick(shapes);
    var q = pick([
      s.name + "有几个面？",
      "哪个立体图形" + s.feature + "？"
    ]);
    var ans = q.indexOf("几个面") >= 0 ? s.faces : s.name;
    return wrap(q, ans, "认识立体图形");
  };

  generators.add_sub_within10 = function () {
    if (Math.random() > 0.5) {
      var a = rand(1, 9), b = rand(1, 10 - a);
      return wrap(a + " + " + b + " = ?", a + b, "10以内加法");
    } else {
      var a2 = rand(2, 10), b2 = rand(1, a2);
      return wrap(a2 + " - " + b2 + " = ?", a2 - b2, "10以内减法");
    }
  };

  generators.clock = function () {
    var h = rand(1, 12), m = pick([0, 30]);
    var mStr = m === 0 ? "整" : "半";
    var q = "时针指向" + h + "，分针指向" + (m === 0 ? "12" : "6") + "，现在是几时" + mStr + "？";
    return wrap(q, h + "时" + (m === 0 ? "" : "30分"), "钟表上短针是时针，长针是分针");
  };

  generators.add_no_carry_20 = function () {
    var ones = rand(1, 9);
    var tens = rand(1, 1);
    var a = tens * 10 + ones;
    var b = rand(1, 9 - ones);
    if (b < 1) b = 1;
    return wrap(a + " + " + b + " = ?", a + b, "不进位加法");
  };

  generators.sub_carry_20 = function () {
    var a = rand(11, 18), b = rand(a - 9, 9);
    if (b > 9) b = 9;
    var ans = a - b;
    return wrap(a + " - " + b + " = ?", ans, "想加法算减法：" + b + "+" + ans + "=" + a);
  };

  generators.observation = function () {
    var q = "从正面看一个圆柱，看到的是什么形状？";
    return wrap(q, "长方形", "从不同方向观察物体形状不同");
  };

  generators.number_within100 = function () {
    var n = rand(21, 99);
    var tens = Math.floor(n / 10), ones = n % 10;
    var q = pick([
      n + "是由__个十和__个一组成的（先填十）",
      "写出" + tens + "个十和" + ones + "个一组成的数"
    ]);
    return wrap(q, q.indexOf("写出") >= 0 ? n : tens * 10 + ones, "100以内的数");
  };

  generators.shapes_2d = function () {
    var shapes = [
      { name: "长方形", sides: 4, feature: "对边相等" },
      { name: "正方形", sides: 4, feature: "四条边都相等" },
      { name: "三角形", sides: 3, feature: "有三条边" },
      { name: "圆", sides: 0, feature: "没有直的边" }
    ];
    var s = pick(shapes);
    var q = pick([
      s.name + "有几条边？",
      "哪个图形" + s.feature + "？"
    ]);
    var ans = q.indexOf("几条边") >= 0 ? s.sides : s.name;
    return wrap(q, ans, "认识平面图形");
  };

  generators.add_no_carry_100 = function () {
    var variants = [
      function () { var a = rand(1, 9) * 10, b = rand(1, 9) * 10; if (a + b > 100) b = 50; return wrap(a + " + " + b + " = ?", a + b, "整十数加法"); },
      function () { var a = rand(11, 99), b = rand(1, 9); if (a % 10 + b >= 10) b = 9 - a % 10; if (b < 1) b = 1; return wrap(a + " + " + b + " = ?", a + b, "不进位加法"); }
    ];
    return pick(variants)();
  };

  generators.sub_no_carry_100 = function () {
    var a = rand(20, 99), b = rand(1, a % 10);
    if (b < 1) { a = 25; b = 3; }
    return wrap(a + " - " + b + " = ?", a - b, "不退位减法");
  };

  generators.add_carry_100 = function () {
    var a = rand(12, 89), b = rand(1, 9);
    if (a % 10 + b < 10) b = 10 - a % 10 + rand(0, 2);
    if (a + b > 100) a = 50;
    return wrap(a + " + " + b + " = ?", a + b, "进位加法：个位满十向十位进一");
  };

  generators.sub_carry_100 = function () {
    var a = rand(20, 99), b = rand(10 - a % 10, 9);
    if (b > a) b = a - 10;
    if (b < 1) { a = 32; b = 7; }
    return wrap(a + " - " + b + " = ?", a - b, "退位减法：个位不够减从十位借一");
  };

  generators.money = function () {
    var items = [
      { name: "铅笔", price: 2 },
      { name: "橡皮", price: 1 },
      { name: "尺子", price: 3 },
      { name: "本子", price: 5 }
    ];
    var a = pick(items), b = pick(items);
    var q = "一支" + a.name + a.price + "元，一块" + b.name + b.price + "元，一共需要多少元？";
    return wrap(q, a.price + b.price, "1元=10角，1角=10分");
  };

  generators.chain_add_sub_100 = function () {
    var a = rand(10, 50), b = rand(5, 30), c = rand(1, Math.min(a + b, 20));
    if (Math.random() > 0.5) {
      return wrapFill(a + " + " + b + " - " + c + " = ?", a + b - c, "从左到右依次计算");
    } else {
      return wrapFill(a + " - " + b + " + " + c + " = ?", a - b + c, "从左到右依次计算");
    }
  };

  generators.mixed_add_sub_100 = function () {
    return generators.chain_add_sub_100();
  };

  generators.multiplication_intro = function () {
    var a = rand(2, 5), b = rand(2, 5);
    var q = a + "个" + b + "相加，用乘法算式怎么表示？(写结果)";
    return wrapFill(q, a * b, "乘法是相同加数相加的简便运算");
  };

  generators.mul_2_5 = function () {
    var a = rand(2, 5), b = rand(1, 9);
    return wrapFill(a + " × " + b + " = ?", a * b, a + "的乘法口诀");
  };

  generators.length_cm_m = function () {
    var q = pick([
      function () { return wrapFill("1米 = __厘米", 100, "1米=100厘米"); },
      function () { var v = rand(1, 9); return wrapFill(v + "米 = __厘米", v * 100, "1米=100厘米"); },
      function () { var v = rand(1, 5) * 100; return wrapFill(v + "厘米 = __米", v / 100, "100厘米=1米"); }
    ]);
    return q();
  };

  generators.mul_6_9 = function () {
    var a = rand(6, 9), b = rand(1, 9);
    return wrapFill(a + " × " + b + " = ?", a * b, a + "的乘法口诀");
  };

  generators.division_intro = function () {
    var b = rand(2, 9), a = rand(2, 9), total = a * b;
    var q = "把" + total + "平均分成" + b + "份，每份是多少？";
    return wrap(q, a, "除法就是平均分");
  };

  generators.div_by_table = function () {
    var b = rand(2, 9), ans = rand(1, 9), a = b * ans;
    return wrapFill(a + " ÷ " + b + " = ?", ans, "想：" + b + "×?=" + a);
  };

  generators.div_with_remainder = function () {
    var b = rand(2, 9), ans = rand(1, 9), r = rand(1, b - 1), a = b * ans + r;
    return wrapFill(a + " ÷ " + b + " = ?...?", ans + "..." + r, "余数要比除数小");
  };

  generators.direction = function () {
    var pairs = [
      ["东", "西"], ["南", "北"], ["东南", "西北"], ["东北", "西南"]
    ];
    var p = pick(pairs);
    var q = p[0] + "的相反方向是___";
    return wrap(q, p[1], "东西相对，南北相对");
  };

  generators.number_within10000 = function () {
    var n = rand(100, 9999);
    var q = pick([
      n + "的最高位是___位",
      function () {
        var th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), t = Math.floor((n % 100) / 10), o = n % 10;
        return n + "由__个千__个百__个十__个一组成（用逗号分隔如:1,2,3,4）";
      }
    ]);
    if (typeof q === "string") {
      var places = { 1: "个", 10: "十", 100: "百", 1000: "千" };
      var highest = 1000;
      if (n < 10) highest = 1; else if (n < 100) highest = 10; else if (n < 1000) highest = 100;
      return wrap(q, places[highest] + "位", "从右往左依次是个十百千位");
    } else {
      var th2 = Math.floor(n / 1000), h2 = Math.floor((n % 1000) / 100), t2 = Math.floor((n % 100) / 10), o2 = n % 10;
      var prompt = q();
      return wrapFill(prompt, th2 + "," + h2 + "," + t2 + "," + o2, "按千、百、十、个位分解");
    }
  };

  generators.length_dm_mm_km = function () {
    var qs = [
      function () { return wrapFill("1千米 = __米", 1000, "1千米=1000米"); },
      function () { return wrapFill("1分米 = __厘米", 10, "1分米=10厘米"); },
      function () { return wrapFill("1厘米 = __毫米", 10, "1厘米=10毫米"); },
      function () { var v = rand(1, 5); return wrapFill(v + "千米 = __米", v * 1000, "1千米=1000米"); },
      function () { var v = rand(1, 9); return wrapFill(v + "分米 = __厘米", v * 10, "1分米=10厘米"); }
    ];
    return pick(qs)();
  };

  generators.add_sub_within10000 = function () {
    var a = rand(100, 5000), b = rand(100, 4000);
    if (a + b > 9999) b = 9999 - a;
    if (Math.random() > 0.5) {
      return wrapFill(a + " + " + b + " = ?", a + b, "相同数位对齐，从个位加起");
    } else {
      if (a < b) { var t = a; a = b; b = t; }
      return wrapFill(a + " - " + b + " = ?", a - b, "相同数位对齐，从个位减起");
    }
  };

  generators.shapes_angle = function () {
    var q = pick([
      function () { return wrap("直角等于多少度？", 90, "直角=90°"); },
      function () { return wrap("长方形有几个直角？", 4, "长方形的四个角都是直角"); },
      function () { return wrap("正方形的四个角都是什么角？", "直角", "正方形的每个角都是90°"); }
    ]);
    return q();
  };

  generators.time_hms = function () {
    var qs = [
      function () { return wrapFill("1时 = __分", 60, "1时=60分"); },
      function () { return wrapFill("1分 = __秒", 60, "1分=60秒"); },
      function () { var h = rand(1, 3); return wrapFill(h + "时 = __分", h * 60, "1时=60分"); },
      function () { var m = rand(1, 5) * 10; return wrapFill(m + "分 = __秒", m * 60, "1分=60秒"); }
    ];
    return pick(qs)();
  };

  generators.data_collection = function () {
    var q = "统计图中最高的柱子表示该类数量___（填最多或最少）";
    return wrap(q, "最多", "柱子越高数量越多");
  };

  generators.mixed_operations = function () {
    var a = rand(2, 9), b = rand(2, 9), c = rand(1, 20);
    if (Math.random() > 0.5) {
      return wrapFill(a + " × " + b + " + " + c + " = ?", a * b + c, "先算乘除，再算加减");
    } else {
      return wrapFill(c + " + " + a + " × " + b + " = ?", c + a * b, "先算乘法再算加法");
    }
  };

  generators.observation_3d = function () {
    var q = "一个正方体从正面、侧面、上面看到的都是___形";
    return wrap(q, "正方", "正方体每个面都是正方形");
  };

  generators.add_sub_10000 = function () {
    return generators.add_sub_within10000();
  };

  generators.mul_div_1digit = function () {
    if (Math.random() > 0.5) {
      var a = rand(11, 99), b = rand(2, 9);
      return wrapFill(a + " × " + b + " = ?", a * b, "用竖式计算");
    } else {
      var b2 = rand(2, 9), ans2 = rand(11, 99), a2 = b2 * ans2;
      return wrapFill(a2 + " ÷ " + b2 + " = ?", ans2, "用竖式计算");
    }
  };

  generators.perimeter = function () {
    if (Math.random() > 0.5) {
      var l = rand(3, 15), w = rand(2, l - 1);
      if (w < 1) w = 2;
      return wrapFill("长方形长" + l + "厘米，宽" + w + "厘米，周长=___厘米", (l + w) * 2, "长方形周长=(长+宽)×2");
    } else {
      var s = rand(3, 15);
      return wrapFill("正方形边长" + s + "厘米，周长=___厘米", s * 4, "正方形周长=边长×4");
    }
  };

  generators.mul_2by1 = function () {
    var a = rand(11, 99), b = rand(2, 9);
    return wrapFill(a + " × " + b + " = ?", a * b, "两位数乘一位数");
  };

  generators.date_year = function () {
    var qs = [
      function () { return wrapFill("一年有__个月", 12, "1年=12个月"); },
      function () { return wrapFill("一年有__天（平年）", 365, "平年365天，闰年366天"); },
      function () { return wrap("哪些月是大月（31天）？", "1,3,5,7,8,10,12月", "大月有7个"); },
      function () { return wrapFill("一天有__小时", 24, "1天=24小时"); }
    ];
    return pick(qs)();
  };

  generators.decimal_intro = function () {
    var a = rand(1, 9), b = rand(1, 9);
    var dec = a + b / 10;
    var q = dec.toFixed(1) + "的整数部分是__，小数部分是__（用逗号分隔如:3,5）";
    return wrap(q, a + "," + b, "小数点左边是整数部分，右边是小数部分");
  };

  generators.div_3by1 = function () {
    var b = rand(2, 9), ans = rand(11, 111), a = b * ans;
    if (a > 999) { a = 999 - (999 % b); ans = a / b; }
    return wrapFill(a + " ÷ " + b + " = ?", ans, "三位数除以一位数");
  };

  generators.transformation = function () {
    var qs = [
      function () { return wrap("电梯上下运动属于___", "平移", "平移是沿直线运动"); },
      function () { return wrap("风车转动属于___", "旋转", "旋转是绕一个点转动"); },
      function () { return wrap("蝴蝶翅膀是___对称", "轴", "沿一条线对折两边重合"); }
    ];
    return pick(qs)();
  };

  generators.mul_2by2 = function () {
    var a = rand(11, 49), b = rand(11, 49);
    return wrapFill(a + " × " + b + " = ?", a * b, "两位数乘两位数");
  };

  generators.area = function () {
    if (Math.random() > 0.5) {
      var l = rand(3, 15), w = rand(2, l > 2 ? l - 1 : 2);
      return wrapFill("长方形长" + l + "米，宽" + w + "米，面积=___平方米", l * w, "长方形面积=长×宽");
    } else {
      var s = rand(3, 15);
      return wrapFill("正方形边长" + s + "米，面积=___平方米", s * s, "正方形面积=边长×边长");
    }
  };

  generators.fraction_intro = function () {
    var d = pick([2, 3, 4, 5, 6, 8]);
    var n = rand(1, d - 1);
    var q = "把一个整体平均分成" + d + "份，取其中" + n + "份，用分数表示为？";
    return wrapFrac(q, n, d, "分子表示取的份数，分母表示总份数");
  };

  generators.bar_chart = function () {
    var q = "条形统计图中，每格表示5人，3格表示__人";
    return wrapFill(q, 15, "格数×每格人数=总人数");
  };

  generators.large_numbers = function () {
    var n = rand(10000, 99999999);
    var q = pick([
      function () { return wrapFill(n + "读作___（用汉字写，不加读作两字）", "", "从高位读起，中间0读零，末尾0不读"); },
      function () { return wrapFill(n + "约等于__万（四舍五入到万位）", Math.round(n / 10000), "看千位四舍五入"); }
    ]);
    return q();
  };

  generators.lines_angles = function () {
    var qs = [
      function () { return wrapFill("1周角 = __度", 360, "周角=360°"); },
      function () { return wrapFill("1平角 = __度", 180, "平角=180°"); },
      function () { return wrap("锐角的范围是？", "0°到90°", "小于90°的角是锐角"); },
      function () { return wrap("钝角的范围是？", "90°到180°", "大于90°小于180°是钝角"); }
    ];
    return pick(qs)();
  };

  generators.mul_3by2 = function () {
    var a = rand(100, 499), b = rand(11, 49);
    return wrapFill(a + " × " + b + " = ?", a * b, "三位数乘两位数");
  };

  generators.operation_laws = function () {
    var a = rand(10, 50), b = rand(10, 50), c = rand(10, 50);
    var qs = [
      function () { return wrapFill(a + " + " + b + " = " + b + " + ___", a, "加法交换律：a+b=b+a"); },
      function () { return wrapFill("(" + a + " + " + b + ") + " + c + " = " + a + " + (___ + " + c + ")", b, "加法结合律"); },
      function () { return wrapFill(a + " × " + b + " = " + b + " × ___", a, "乘法交换律：a×b=b×a"); },
      function () { return wrapFill(a + " × (" + b + " + " + c + ") = " + a + "×" + b + " + ___×" + c, a, "乘法分配律"); }
    ];
    return pick(qs)();
  };

  generators.coordinate = function () {
    var x = rand(1, 6), y = rand(1, 6);
    var q = "在第" + x + "列第" + y + "行的位置用数对表示为（先列后行，用逗号分隔）";
    return wrapFill(q, x + "," + y, "数对(列,行)");
  };

  generators.div_3by2 = function () {
    var b = rand(11, 49), ans = rand(2, 20), a = b * ans;
    if (a > 9999) { a = 9999 - (9999 % b); ans = a / b; }
    return wrapFill(a + " ÷ " + b + " = ?", ans, "三位数除以两位数");
  };

  generators.negative_intro = function () {
    var q = pick([
      "零上5℃记作+5℃，零下5℃记作___",
      "海拔高于海平面100米记作+100米，低于海平面50米记作___",
      "0是正数还是负数？"
    ]);
    var answers = ["-5℃", "-50米", "既不是正数也不是负数"];
    var idx = q.indexOf("零上") >= 0 ? 0 : q.indexOf("海拔") >= 0 ? 1 : 2;
    return wrap(q, answers[idx], "负数表示相反意义的量");
  };

  generators.decimal_add_sub = function () {
    var a = (rand(11, 99) / 10).toFixed(1), b = (rand(11, 99) / 10).toFixed(1);
    var af = parseFloat(a), bf = parseFloat(b);
    if (Math.random() > 0.5) {
      return wrapFill(a + " + " + b + " = ?", (af + bf).toFixed(1), "小数点对齐，从末位加起");
    } else {
      if (af < bf) { var t = af; af = bf; bf = t; }
      return wrapFill(af.toFixed(1) + " - " + bf.toFixed(1) + " = ?", (af - bf).toFixed(1), "小数点对齐，从末位减起");
    }
  };

  generators.triangle_quad = function () {
    var qs = [
      function () { return wrapFill("三角形内角和等于__度", 180, "三角形内角和=180°"); },
      function () { return wrap("等腰三角形有__条边相等", "两", "等腰三角形有两条边相等"); },
      function () { return wrap("等边三角形的每个角等于多少度？", 60, "等边三角形三个角都是60°"); }
    ];
    return pick(qs)();
  };

  generators.decimal_mul = function () {
    var a = (rand(11, 99) / 10).toFixed(1), b = rand(2, 9);
    return wrapFill(a + " × " + b + " = ?", (parseFloat(a) * b).toFixed(1), "先按整数乘法计算，再确定小数点位置");
  };

  generators.observation_3d_adv = function () {
    var q = "用4个正方体搭成立体图形，从正面最多能看到__个面";
    return wrapFill(q, 4, "从正面看是平面投影");
  };

  generators.equation_intro = function () {
    var x = rand(1, 20), b = rand(1, 20), c = x + b;
    var q = "解方程：x + " + b + " = " + c + "，x = ?";
    return wrapFill(q, x, "等式两边同时减去" + b);
  };

  generators.line_chart = function () {
    var q = "折线统计图的特点是可以清楚地看出数据的___变化";
    return wrap(q, "增减", "折线统计图反映变化趋势");
  };

  generators.decimal_div = function () {
    var b = rand(2, 9), ans = (rand(11, 99) / 10).toFixed(1);
    var a = (parseFloat(ans) * b).toFixed(1);
    return wrapFill(a + " ÷ " + b + " = ?", ans, "先把除数变成整数再计算");
  };

  generators.symmetry_translation = function () {
    var qs = [
      function () { return wrap("长方形有__条对称轴", "两", "长方形是轴对称图形"); },
      function () { return wrap("正方形有__条对称轴", "4", "正方形有4条对称轴"); },
      function () { return wrap("圆有__条对称轴", "无数", "圆的每条直径都是对称轴"); }
    ];
    return pick(qs)();
  };

  generators.factors_multiples = function () {
    var qs = [
      function () { return wrapFill("2的倍数叫做__数", "偶", "能被2整除的是偶数"); },
      function () { return wrapFill("最小的质数是__", 2, "2是最小的质数也是唯一的偶质数"); },
      function () { var n = pick([12, 18, 24, 30]); return wrapFill(n + "的因数有几个？（只填数字）", 0, "列举法找因数"); },
      function () { return wrap("1是质数还是合数？", "既不是质数也不是合数", "1既不是质数也不是合数"); }
    ];
    var q = pick(qs);
    if (typeof q === "function") {
      var result = q();
      if (result.answer === 0) {
        var factorCounts = { 12: 6, 18: 6, 24: 8, 30: 8 };
        result.answer = factorCounts[parseInt(result.question.match(/\d+/)[0])] || 6;
      }
      return result;
    }
    return q;
  };

  generators.polygon_area = function () {
    var type = rand(1, 3);
    if (type === 1) {
      var b = rand(4, 20), h = rand(3, b);
      return wrapFill("平行四边形底" + b + "厘米，高" + h + "厘米，面积=___平方厘米", b * h, "平行四边形面积=底×高");
    } else if (type === 2) {
      var b2 = rand(4, 20), h2 = rand(3, b2);
      return wrapFill("三角形底" + b2 + "厘米，高" + h2 + "厘米，面积=___平方厘米", b2 * h2 / 2, "三角形面积=底×高÷2");
    } else {
      var a3 = rand(4, 15), b3 = rand(a3 + 1, 25), h3 = rand(3, 12);
      return wrapFill("梯形上底" + a3 + "厘米，下底" + b3 + "厘米，高" + h3 + "厘米，面积=___平方厘米", (a3 + b3) * h3 / 2, "梯形面积=(上底+下底)×高÷2");
    }
  };

  generators.fraction_meaning = function () {
    var d = pick([2, 3, 4, 5, 6, 8, 10]), n = rand(1, d - 1);
    if (Math.random() > 0.5) {
      var q = fracStr(n, d) + "的分数单位是___";
      return wrapFrac(q, 1, d, "分母是几分数单位就是几分之一");
    }
    var q2 = fracStr(n, d) + "中有__个" + fracStr(1, d);
    return wrapFill(q2, n, "分子表示有几个分数单位");
  };

  generators.composite_area = function () {
    var a = rand(5, 15), b = rand(5, 15);
    var q = "一个组合图形由边长" + a + "厘米的正方形和底" + b + "厘米高" + a + "厘米的三角形组成，面积=___平方厘米";
    return wrapFill(q, a * a + b * a / 2, "分成基本图形分别计算");
  };

  generators.probability = function () {
    var qs = [
      function () { return wrap("口袋里有5红3白球，摸到红球的可能性___摸到白球的可能性（填大于/小于/等于）", "大于", "数量多的摸到可能性大"); },
      function () { return wrap("一定发生的事件是___（填可能/不可能/一定）", "一定", "确定性事件"); }
    ];
    return pick(qs)();
  };

  generators.fraction_add_sub = function () {
    var pairs = [[2, 3], [3, 4], [2, 5], [3, 5], [1, 6], [5, 6], [3, 8], [5, 8]];
    var p = pick(pairs);
    var n1 = rand(1, p[1] - 1), n2 = rand(1, p[0] - 1);
    var lcd = p[0] * p[1] / gcd(p[0], p[1]);
    var r1 = n1 * (lcd / p[1]), r2 = n2 * (lcd / p[0]);
    var rn = r1 + r2;
    var simp = simplify(rn, lcd);
    var q = fracStr(n1, p[1]) + " + " + fracStr(n2, p[0]) + " = ?";
    return wrapFrac(q, simp[0], simp[1], "先通分，再相加");
  };

  generators.cuboid_surface = function () {
    var l = rand(3, 10), w = rand(2, l > 2 ? l - 1 : 2), h = rand(2, 8);
    return wrapFill("长方体长" + l + "厘米，宽" + w + "厘米，高" + h + "厘米，表面积=___平方厘米", 2 * (l * w + l * h + w * h), "表面积=(长×宽+长×高+宽×高)×2");
  };

  generators.fraction_mul = function () {
    var d1 = pick([2, 3, 4, 5, 6]), n1 = rand(1, d1 - 1);
    var d2 = pick([2, 3, 4, 5, 6]), n2 = rand(1, d2 - 1);
    var rn = n1 * n2, rd = d1 * d2;
    var simp = simplify(rn, rd);
    return wrapFrac(fracStr(n1, d1) + " × " + fracStr(n2, d2) + " = ?", simp[0], simp[1], "分子乘分子，分母乘分母");
  };

  generators.cuboid_volume = function () {
    var l = rand(3, 10), w = rand(2, 8), h = rand(2, 6);
    return wrapFill("长方体长" + l + "厘米，宽" + w + "厘米，高" + h + "厘米，体积=___立方厘米", l * w * h, "体积=长×宽×高");
  };

  generators.fraction_div = function () {
    var d1 = pick([2, 3, 4, 5, 6]), n1 = rand(1, d1 - 1);
    var d2 = pick([2, 3, 4, 5, 6]), n2 = rand(1, d2 - 1);
    var rn = n1 * d2, rd = d1 * n2;
    var simp = simplify(rn, rd);
    return wrapFrac(fracStr(n1, d1) + " ÷ " + fracStr(n2, d2) + " = ?", simp[0], simp[1], "除以一个分数等于乘以它的倒数");
  };

  generators.position_direction = function () {
    var dirs = ["北偏东", "北偏西", "南偏东", "南偏西"];
    var d = pick(dirs);
    var deg = rand(15, 75);
    var dist = rand(1, 10) * 100;
    var q = "从A点看B点在" + d + deg + "°方向" + dist + "米处，B点相对A点的方向是___";
    var opposites = { "北偏东": "南偏西", "北偏西": "南偏东", "南偏东": "北偏西", "南偏西": "北偏东" };
    return wrap(q, opposites[d] + deg + "°", "方向是相对的，反过来就是相反方向");
  };

  generators.equation_solving = function () {
    var x = rand(2, 20), a = rand(2, 9);
    var b = a * x;
    var q = "解方程：" + a + "x = " + b + "，x = ?";
    return wrapFill(q, x, "等式两边同时除以" + a);
  };

  generators.data_representation = function () {
    var q = "复式统计图的好处是可以方便地___两组数据";
    return wrap(q, "比较", "复式图便于对比");
  };

  generators.circle = function () {
    var r = rand(2, 10);
    var pi = 3.14;
    var qs = [
      function () { return wrapFill("圆的半径" + r + "厘米，直径=___厘米", r * 2, "直径=半径×2"); },
      function () { return wrapFill("圆的半径" + r + "厘米，周长=___厘米（π取3.14）", (2 * pi * r).toFixed(2), "周长=2πr"); },
      function () { return wrapFill("圆的半径" + r + "厘米，面积=___平方厘米（π取3.14）", (pi * r * r).toFixed(2), "面积=πr²"); }
    ];
    return pick(qs)();
  };

  generators.fraction_mixed = function () {
    var d = pick([2, 3, 4, 5, 6]);
    var n1 = rand(1, d - 1), n2 = rand(1, d - 1);
    var whole = rand(1, 5);
    var q = whole + " + " + fracStr(n1, d) + " + " + fracStr(n2, d) + " = ?";
    var totalN = whole * d + n1 + n2;
    var simp = simplify(totalN, d);
    if (simp[0] >= simp[1]) {
      var intPart = Math.floor(simp[0] / simp[1]);
      var rem = simp[0] % simp[1];
      if (rem === 0) {
        return wrapFill(q, intPart, "同分母分数直接相加");
      }
      return wrapFracMixed(q, intPart, rem, simp[1], "同分母分数直接相加");
    }
    return wrapFrac(q, simp[0], simp[1], "同分母分数直接相加");
  };

  generators.observation_range = function () {
    var q = "站得越高，看到的范围越___";
    return wrap(q, "大", "观察点越高视野越广");
  };

  generators.percent = function () {
    var frac = pick([[1, 4, 25], [1, 2, 50], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 8, 12.5]]);
    var q = fracStr(frac[0], frac[1]) + " = ___%";
    return wrapFill(q, frac[2], "分数化百分数：先化成小数再化百分数");
  };

  generators.pie_chart = function () {
    var q = "扇形统计图的特点是可以清楚地看出___与总数的关系";
    return wrap(q, "部分", "扇形统计图表示部分占总体的百分比");
  };

  generators.ratio = function () {
    var a = rand(2, 12), b = rand(2, 12);
    var g = gcd(a, b);
    var q = a + " : " + b + " 化简比为___（用:表示如1:2）";
    return wrapFill(q, (a / g) + ":" + (b / g), "比的前项和后项同时除以最大公因数");
  };

  generators.percent_application = function () {
    var original = rand(1, 10) * 10;
    var percent = pick([10, 20, 25, 30, 50]);
    var q = pick([
      function () { return wrapFill("原价" + original + "元，打" + (100 - percent) + "折后是___元", original * (100 - percent) / 100, "打折=原价×折数/10"); },
      function () { return wrapFill(original + "的" + percent + "%是___", original * percent / 100, "求百分之几就是乘以百分之几"); }
    ]);
    return q();
  };

  generators.cylinder_cone = function () {
    var r = rand(2, 8), h = rand(3, 12);
    var pi = 3.14;
    var qs = [
      function () { return wrapFill("圆柱底面半径" + r + "厘米，高" + h + "厘米，侧面积=___平方厘米（π取3.14）", (2 * pi * r * h).toFixed(2), "侧面积=2πrh"); },
      function () { return wrapFill("圆柱底面半径" + r + "厘米，高" + h + "厘米，体积=___立方厘米（π取3.14）", (pi * r * r * h).toFixed(2), "体积=πr²h"); },
      function () { return wrapFill("圆锥底面半径" + r + "厘米，高" + h + "厘米，体积=___立方厘米（π取3.14）", (pi * r * r * h / 3).toFixed(2), "圆锥体积=⅓πr²h"); }
    ];
    return pick(qs)();
  };

  generators.proportion = function () {
    var a = rand(2, 8), b = rand(2, 8);
    var k = rand(2, 5);
    var c = a * k, d = b * k;
    var q = "如果 " + a + " : " + b + " = " + c + " : x，则 x = ?";
    return wrapFill(q, d, "比例中两个内项之积等于两个外项之积");
  };

  generators.rotation_scaling = function () {
    var q = pick([
      "把一个图形按2:1放大，面积放大为原来的__倍",
      "把一个图形按1:3缩小，面积缩小为原来的__分之一"
    ]);
    if (q.indexOf("2:1") >= 0) return wrapFill(q, 4, "面积比=相似比的平方");
    return wrapFill(q, 9, "面积比=相似比的平方");
  };

  generators.direct_inverse_prop = function () {
    var q = pick([
      "速度一定，路程和时间成___比例",
      "路程一定，速度和时间成___比例",
      "单价一定，总价和数量成___比例"
    ]);
    var answers = { "速度一定": "正", "路程一定": "反", "单价一定": "正" };
    var key = Object.keys(answers).find(function (k) { return q.indexOf(k) >= 0; });
    return wrap(q, answers[key], "一种量增大另一种也增大是正比例，一增一减是反比例");
  };

  generators.math_fun = function () {
    var puzzles = [
      { q: "找规律：1, 1, 2, 3, 5, 8, ___", a: 13, h: "斐波那契数列：每项等于前两项之和" },
      { q: "找规律：1, 4, 9, 16, 25, ___", a: 36, h: "完全平方数" },
      { q: "找规律：2, 4, 8, 16, 32, ___", a: 64, h: "每项是前项的2倍" },
      { q: "一根绳子对折3次后从中间剪一刀，得到__段", a: 9, h: "对折n次剪一刀得2^n+1段" }
    ];
    var p = pick(puzzles);
    return wrapFill(p.q, p.a, p.h);
  };

  generators.review_algebra = function () {
    var qs = [
      function () { var a = rand(11, 99), b = rand(11, 99); return wrapFill(a + " × " + b + " = ?", a * b, "小学总复习-计算"); },
      function () { var a = rand(100, 999), b = rand(2, 9); var ans = rand(10, 111); var c = b * ans; return wrapFill(c + " ÷ " + b + " = ?", ans, "小学总复习-除法"); },
      function () { var n = rand(1, 9), d = pick([2, 4, 5, 8, 10]); return wrapFill(fracStr(n, d) + " = ___%", (n / d * 100), "分数化百分数"); }
    ];
    return pick(qs)();
  };

  generators.review_geometry = function () {
    var qs = [
      function () { return wrapFill("三角形的面积公式是S=___（用汉字如：底×高÷2）", "底×高÷2", "总复习-图形"); },
      function () { return wrapFill("圆的面积公式是S=___（用符号如：πr²）", "πr²", "总复习-图形"); },
      function () { var l = rand(3, 8), w = rand(2, l > 2 ? l - 1 : 2), h2 = rand(2, 6); return wrapFill("长方体体积公式V=___（用符号如：abh）", "abh", "总复习-图形"); }
    ];
    return pick(qs)();
  };

  generators.review_stats = function () {
    var qs = [
      function () { return wrap("三种统计图中最适合表示部分与总体关系的是___统计图", "扇形", "总复习-统计"); },
      function () { return wrap("最适合表示数据变化趋势的是___统计图", "折线", "总复习-统计"); },
      function () { return wrap("最适合比较各组数据大小的是___统计图", "条形", "总复习-统计"); }
    ];
    return pick(qs)();
  };

  E.generate = function (type, count) {
    count = count || 5;
    var gen = generators[type];
    if (!gen) {
      return [{ question: "该知识点题目正在开发中...", answer: "", hint: "", type: "fill" }];
    }
    var questions = [];
    for (var i = 0; i < count; i++) {
      try {
        questions.push(gen());
      } catch (e) {
        questions.push({ question: "题目生成出错", answer: "", hint: "", type: "fill" });
      }
    }
    return questions;
  };

  E.getAllTypes = function () {
    return Object.keys(generators);
  };

  window.MathApp = window.MathApp || {};
  window.MathApp.Engine = E;
})();
