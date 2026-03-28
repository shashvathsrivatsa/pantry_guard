class PantryItem {
    constructor(name, brand, shelf_life_days, date_added = new Date()) {
        this.name = name;
        this.brand = brand;
        this.shelf_life_days = shelf_life_days;
        this.date_added = date_added;
        this.expiry_date = new Date(date_added.getTime() + shelf_life_days * 24 * 60 * 60 * 1000);
    }
}

class Pantry {
    constructor() {
        this.items = [];
    }

    addReceipt(receipt_json) {
        for (const food of receipt_json.foods) {
            this.items.push(new PantryItem(food.common_name.trim(), food.brand, food.shelf_life_days));
        }
    }

    removeItem(name) {
        const idx = this.items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
        if (idx === -1) return false;
        this.items.splice(idx, 1);
        return true;
    }

    getExpiringSoon(days = 7) {
        const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        return this.items.filter(i => i.expiry_date <= cutoff).sort((a, b) => a.expiry_date - b.expiry_date);
    }
}

module.exports = { Pantry, PantryItem };
