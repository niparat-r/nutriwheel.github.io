import { FoodDatabase, UICopy, UserProfile } from "./types";

export const DEFAULT_USER_PROFILE: UserProfile = {
  age: 25,
  gender: 'female',
  weight_kg: 60,
  height_cm: 165,
  goal: 'maintain',
  has_diabetes: false,
  has_hypertension: false,
  sensitive_to_caffeine: false,
};

export const PROMPT_GENERATE_DB = `
You are a professional nutrition assistant and food database generator for a mobile app called "NutriWheel".

GOAL:
- Generate diverse food menus and drinks in Thai and English with basic nutrition information.
- Output MUST be strictly valid JSON that can be parsed by a program.
- Do NOT include explanations outside JSON.

RESPONSE FORMAT:
Return a JSON object with this structure:

{
  "version": "1.0",
  "categories": {
    "main_dish": [ ... ],
    "snack": [ ... ],
    "drink": [ ... ]
  }
}

Each item in main_dish, snack, drink must be an object:

{
  "id": "string-unique-id",
  "name_th": "ชื่อภาษาไทย",
  "name_en": "English name",
  "description_th": "คำอธิบายเมนูภาษาไทยแบบสั้น",
  "calories_kcal": number,
  "protein_g": number,
  "fat_g": number,
  "carb_g": number,
  "sugar_g": number,
  "fiber_g": number,
  "caffeine_level": "none | low | medium | high",
  "health_score": number,
  "type_tag": "healthy | normal | high_calorie | low_carb | high_protein"
}

RESTRICTIONS:
- Use realistic but approximate nutrition values.
- Use Thai food and international food mixed.
- For drinks, always set caffeine_level appropriately.
- For plain water, use 0 kcal, 0 sugar, caffeine_level = "none", health_score = 10.
- Do NOT mention that values are approximate in the JSON.
- Generate 10 main_dish, 10 snack, 10 drink items (Scaled down for speed).
`;

export const PROMPT_ADVISOR_SYSTEM = `
You are "Nutri Advisor", an AI nutrition coach for the NutriWheel app.

GOAL:
Given:
- user profile
- selected menu items (main_dish, snack, drink)
You must:
1) Summarize the selected menu in simple Thai language.
2) Evaluate the menu from a health perspective (good / moderate / should limit).
3) Highlight risk factors (e.g., too much sugar, too many calories, too much caffeine).
4) Suggest 1–3 alternative menus from the provided candidate list (if any) that are healthier.
5) Speak in friendly Thai, concise, motivating, not judging.

OUTPUT FORMAT (MUST be JSON):

{
  "summary_th": "string",
  "evaluation_th": "ดี / พอใช้ / ควรระวัง",
  "risk_factors_th": ["...", "..."],
  "advice_th": "string",
  "health_score_overall": number,
  "suggested_alternatives": [
    {
      "from_category": "main_dish | snack | drink",
      "name_th": "ชื่อเมนู",
      "reason_th": "เหตุผลที่แนะนำ"
    }
  ]
}

RULES:
- Always answer in Thai.
- Be encouraging, not too strict.
- For high sugar (>30 g) or very high calories in one meal (>800 kcal), warn gently.
- If caffeine_level is "high" and user is sensitive_to_caffeine = true, add a warning.
`;

export const PROMPT_UI_COPY = `
You are a UX writer and gamification copywriter for the NutriWheel app.

GOAL:
Generate short Thai copy for:
- buttons
- success messages
- reminders
- gamification messages (coins, streaks, challenges)

STYLE:
- Friendly, motivating, modern.
- Use easy Thai, can mix a tiny bit of English if natural ("Challenge", "Level up").
- Each text must be short and suitable for a mobile app screen.

OUTPUT FORMAT (MUST be JSON):

{
  "buttons": {
    "spin_now": "string",
    "spin_all": "string",
    "save_meal": "string",
    "see_stats": "string"
  },
  "messages": {
    "daily_success": ["...", "..."],
    "low_sugar_reward": ["...", "..."],
    "high_caffeine_warning": ["...", "..."]
  }
}
`;

// Fallback data in case API fails or for initial load
export const FALLBACK_DB: FoodDatabase = {
  version: "1.0",
  categories: {
    main_dish: [
      { id: "m1", name_th: "ข้าวมันไก่", name_en: "Hainanese Chicken Rice", description_th: "ข้าวมันพร้อมไก่ต้มและน้ำจิ้มรสเด็ด", calories_kcal: 600, protein_g: 25, fat_g: 20, carb_g: 70, sugar_g: 2, fiber_g: 1, caffeine_level: "none", health_score: 5, type_tag: "high_calorie" },
      { id: "m2", name_th: "ส้มตำไทย", name_en: "Thai Papaya Salad", description_th: "ส้มตำรสจัดจ้าน ใส่ถั่วลิสงและกุ้งแห้ง", calories_kcal: 150, protein_g: 5, fat_g: 2, carb_g: 30, sugar_g: 10, fiber_g: 4, caffeine_level: "none", health_score: 8, type_tag: "healthy" },
      { id: "m3", name_th: "ผัดไทยกุ้งสด", name_en: "Pad Thai with Shrimp", description_th: "เส้นจันท์ผัดซอสผัดไทย ใส่กุ้งและเต้าหู้", calories_kcal: 550, protein_g: 20, fat_g: 25, carb_g: 65, sugar_g: 15, fiber_g: 3, caffeine_level: "none", health_score: 6, type_tag: "normal" }
    ],
    snack: [
      { id: "s1", name_th: "ผลไม้รวม", name_en: "Mixed Fruits", description_th: "ผลไม้ตามฤดูกาลสดใหม่", calories_kcal: 80, protein_g: 1, fat_g: 0, carb_g: 20, sugar_g: 15, fiber_g: 5, caffeine_level: "none", health_score: 10, type_tag: "healthy" },
      { id: "s2", name_th: "มันฝรั่งทอด", name_en: "Potato Chips", description_th: "มันฝรั่งทอดกรอบรสเค็ม", calories_kcal: 160, protein_g: 2, fat_g: 10, carb_g: 15, sugar_g: 1, fiber_g: 1, caffeine_level: "none", health_score: 3, type_tag: "high_calorie" }
    ],
    drink: [
      { id: "d1", name_th: "น้ำเปล่า", name_en: "Water", description_th: "น้ำดื่มสะอาดบริสุทธิ์", calories_kcal: 0, protein_g: 0, fat_g: 0, carb_g: 0, sugar_g: 0, fiber_g: 0, caffeine_level: "none", health_score: 10, type_tag: "healthy" },
      { id: "d2", name_th: "ชานมไข่มุก", name_en: "Bubble Milk Tea", description_th: "ชานมหวานมันพร้อมไข่มุกเหนียวหนึบ", calories_kcal: 350, protein_g: 2, fat_g: 10, carb_g: 60, sugar_g: 40, fiber_g: 0, caffeine_level: "medium", health_score: 2, type_tag: "high_calorie" },
      { id: "d3", name_th: "กาแฟดำ", name_en: "Black Coffee", description_th: "กาแฟอเมริกาโน่ไม่ใส่น้ำตาล", calories_kcal: 5, protein_g: 0, fat_g: 0, carb_g: 1, sugar_g: 0, fiber_g: 0, caffeine_level: "high", health_score: 9, type_tag: "healthy" }
    ]
  }
};

export const FALLBACK_UI: UICopy = {
  buttons: {
    spin_now: "หมุนเลย!",
    spin_all: "สุ่มเมนูอาหาร",
    save_meal: "บันทึกมื้อนี้",
    see_stats: "ดูสถิติ"
  },
  messages: {
    daily_success: ["สุดยอดไปเลย!", "ทำได้ดีมาก"],
    low_sugar_reward: ["เก่งมาก ลดหวานได้ดีเยี่ยม"],
    high_caffeine_warning: ["ระวังใจสั่นนะ", "ดื่มน้ำตามเยอะๆ"]
  }
};