const fs = require("fs");
const { Groq } = require("groq-sdk");
const { Pantry } = require("./pantry_manager");
const { matchPantryToFDASemantic } = require("./fda_tracker");

// Singleton pantry — in production you'd persist this to disk/db
const pantry = new Pantry();

async function inputReceipt(imagePath) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const ext = imagePath.split(".").pop().toLowerCase();
    const mediaType = ext === "png" ? "image/png" : "image/jpeg";

    // ── Step 1: OCR — extract raw line items from receipt image ──
    const ocrResponse = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: { url: `data:${mediaType};base64,${base64Image}` }
                    },
                    {
                        type: "text",
                        text: `Extract all line items from this receipt. Return ONLY a JSON object like:
{"store_name": "xxx", "food_codes": ["xxx", ...]}
No other text.`
                    }
                ]
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
    });

    const llama_result = JSON.parse(ocrResponse.choices[0].message.content);



    // ── Step 2: Product lookup — decode SKUs into readable food names ──
    const lookupResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a grocery product identifier for Costco receipts.

Task:
Decode abbreviated receipt line items into clean food/beverage products only.

Return ONLY valid JSON in this exact schema:
{
  "store_name": "string",
  "foods": [
    {
      "brand": "string",
      "common_name": "string",
      "shelf_life_days": 1,
      "emoji": "single_emoji"
    }
  ]
}

Hard rules (must follow):
1) Include ONLY edible food or drink items.
2) Exclude non-food items completely (do not include them at all):
   cleaning supplies, detergent, dish soap, wipes, paper goods, toiletries, cosmetics, medicine, supplements, oral care, pet items, household goods.
3) emoji field must ALWAYS be a single emoji character. This is REQUIRED, never optional.
4) Default emoji by category if unsure:
   - meat/poultry → 🥩
   - dairy → 🥛
   - produce/vegetables → 🥦
   - fruit → 🍎
   - grains/pasta/bread → 🍞
   - beverages → 🥤
   - snacks → 🍿
   - frozen → 🧊
   - canned/pantry → 🥫
   - anything else → 🛒
   NEVER return an empty string for emoji under any circumstances.
5) "KS" prefix = Kirkland Signature brand.
6) "DM" prefix = Del Monte.
7) "ORG" means organic variety (not a brand).
8) Do not invent specific brands; if unknown, use "Kirkland Signature" for Costco.
9) shelf_life_days must be a positive integer.

Output rules:
- Return JSON only.
- No markdown, no prose, no comments.`
            },
            {
                role: "user",
                content: `Store: ${llama_result.store_name}. 
Decode these receipt codes into FOOD/BEVERAGE items only and exclude all non-food items:
${JSON.stringify(llama_result.food_codes)}`
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
    });

    const receipt_json = JSON.parse(lookupResponse.choices[0].message.content);

    receipt_json.fda_semantic_matches = await matchPantryToFDASemantic(receipt_json.foods, {
        limit: 100,
        minCosine: 0.62,
        topKPerItem: 3
    });


    // ── Step 3: Add to pantry ──
    pantry.addReceipt(receipt_json);

    // Return the parsed receipt so the frontend can show what was added
    return receipt_json;
}




module.exports = { inputReceipt, pantry };
