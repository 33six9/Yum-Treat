// Seeds categories and foods. Category `img` and food `imageUrl` values are
// chosen to match the filenames that actually exist under
// frontend/src/assets, so images render correctly out of the box.
//
// User accounts are no longer seeded here — sign up/sign in happens through
// Firebase Authentication on the frontend. To get an admin account, add
// your email to ADMIN_EMAILS in backend/.env, then sign in once (email/
// password or Google) on the site; the backend promotes you automatically.
//
// Usage:
//   npm run seed            populate categories/foods
//   npm run seed:destroy    wipe categories/foods seeded here

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const Category = require("../models/Category");
const Food = require("../models/Food");

const categories = [
    { name: "Pizza", img: "cat-1" },
    { name: "Burger", img: "cat-2" },
    { name: "Chicken", img: "cat-3" },
    { name: "Seafood", img: "cat-4" },
    { name: "Curry", img: "cat-5" },
    { name: "Coffee", img: "cat-6" },
    { name: "Salad", img: "cat-7" },
];

// [category, imageUrl, name, description, currentPrice, pastPrice, tags, flags]
const foodRows = [
    ["Pizza", "pizza-1", "Classic Margherita", "San Marzano tomato, fresh mozzarella, basil.", 9.99, 12.99, ["cheesy"], { isPopular: true, isSpecial: true }],
    ["Pizza", "pizza-2", "Pepperoni Supreme", "Loaded with pepperoni and a three-cheese blend.", 11.49, null, ["cheesy", "spicy"], { isPopular: true }],
    ["Pizza", "pizza-3", "Garden Veggie Pizza", "Bell peppers, mushroom, onion, olives.", 10.49, null, ["vegetarian"], {}],

    ["Burger", "burger-1", "Classic Cheeseburger", "Beef patty, cheddar, lettuce, house sauce.", 7.99, 9.49, ["cheesy"], { isPopular: true }],
    ["Burger", "burger-2", "Double Smash Burger", "Two smashed patties, caramelized onion.", 9.99, null, [], { isPopular: true, isSpecial: true }],
    ["Burger", "burger-3", "Spicy Chicken Burger", "Crispy chicken thigh, jalapeño mayo.", 8.49, null, ["spicy", "chicken"], {}],
    ["Burger", "burger-4", "Veggie Burger", "Grilled vegetable patty, avocado spread.", 7.49, null, ["vegetarian"], {}],
    ["Burger", "burger-5", "BBQ Bacon Burger", "Smoky bbq sauce, crispy bacon.", 9.49, 10.99, [], {}],
    ["Burger", "burger-6", "Mushroom Swiss Burger", "Sautéed mushroom, melted swiss.", 8.99, null, ["cheesy"], {}],
    ["Burger", "burger-7", "Fish Burger", "Crispy battered fish fillet, tartar sauce.", 8.29, null, ["seafood"], {}],
    ["Burger", "burger-8", "Triple Stack Burger", "Three patties, three cheeses, all the fixings.", 12.99, null, ["cheesy"], { isSuperDeals: true }],

    ["Chicken", "chicken-1", "Fried Chicken Bucket", "8 pieces of our signature fried chicken.", 14.99, 17.99, ["chicken"], { isPopular: true, isSuperDeals: true }],
    ["Chicken", "chicken-2", "Grilled Chicken Plate", "Herb-marinated grilled chicken breast.", 10.99, null, ["chicken", "grill"], {}],
    ["Chicken", "chicken-3", "Spicy Chicken Wings", "Tossed in house hot sauce.", 8.99, null, ["chicken", "spicy"], { isPopular: true }],
    ["Chicken", "chicken-4", "Chicken Tenders", "Golden fried, served with dip.", 7.99, null, ["chicken"], {}],
    ["Chicken", "chicken-5", "Roast Chicken Half", "Slow roasted with rosemary and garlic.", 11.49, null, ["chicken", "roast"], {}],
    ["Chicken", "chicken-6", "Chicken Curry Bowl", "Simmered in a rich curry gravy.", 10.49, 12.49, ["chicken", "gravy"], {}],
    ["Chicken", "chicken-7", "Chicken Katsu", "Panko-crusted cutlet, katsu sauce.", 11.99, null, ["chicken"], {}],
    ["Chicken", "chicken-8", "BBQ Chicken Skewers", "Charcoal-grilled chicken skewers.", 9.49, null, ["chicken", "grill"], {}],

    ["Seafood", "fish-1", "Grilled Salmon", "Atlantic salmon, lemon butter sauce.", 15.99, null, ["seafood", "grill"], { isSpecial: true }],
    ["Seafood", "fish-2", "Fish and Chips", "Beer-battered fish, crispy fries.", 12.99, 14.99, ["seafood"], { isPopular: true }],
    ["Seafood", "fish-3", "Shrimp Scampi", "Garlic butter shrimp over linguine.", 13.49, null, ["seafood"], {}],
    ["Seafood", "fish-4", "Grilled Fish Fillet", "Chef's catch of the day, grilled.", 14.49, null, ["seafood", "grill"], {}],
    ["Seafood", "fish-5", "Seafood Platter", "A mix of shrimp, calamari, and fish.", 18.99, 21.99, ["seafood"], { isSuperDeals: true }],
    ["Seafood", "fish-6", "Fish Curry", "Fish simmered in coconut curry.", 12.49, null, ["seafood", "gravy"], {}],
    ["Seafood", "fish-7", "Crispy Calamari", "Lightly fried, served with aioli.", 9.99, null, ["seafood"], {}],
    ["Seafood", "fish-8", "Baked Fish", "Whole fish baked with herbs.", 13.99, null, ["seafood"], {}],

    ["Curry", "curry-1", "Beef Curry", "Slow-cooked beef in a spiced gravy.", 12.99, null, ["gravy", "spicy"], { isPopular: true }],
    ["Curry", "curry-2", "Vegetable Curry", "Seasonal vegetables in a mild curry.", 9.49, null, ["vegetarian", "gravy"], {}],
    ["Curry", "mutton-1", "Mutton Curry", "Tender mutton in traditional spices.", 14.49, 16.49, ["gravy", "spicy"], { isSpecial: true }],
    ["Curry", "mutton-2", "Mutton Rezala", "Rich, creamy mutton curry.", 15.49, null, ["gravy"], {}],
    ["Curry", "mutton-3", "Mutton Kosha", "Dry-roasted spicy mutton curry.", 15.99, null, ["spicy", "roast"], {}],
    ["Curry", "masala", "Chicken Masala", "Chicken simmered in a masala gravy.", 11.49, null, ["chicken", "gravy"], { isPopular: true }],
    ["Curry", "rice-1", "Steamed Rice", "Fragrant steamed basmati rice.", 3.99, null, ["rice"], {}],
    ["Curry", "rice-2", "Vegetable Fried Rice", "Wok-tossed rice with mixed vegetables.", 6.99, null, ["rice", "vegetarian"], {}],
    ["Curry", "rice-3", "Chicken Biryani", "Layered basmati rice with spiced chicken.", 11.99, 13.99, ["rice", "chicken", "spicy"], { isPopular: true, isSuperDeals: true }],
    ["Curry", "noodols-1", "Chicken Chow Mein", "Stir-fried noodles with chicken.", 8.99, null, ["chicken"], {}],
    ["Curry", "noodols-2", "Vegetable Noodles", "Stir-fried noodles with fresh veg.", 7.49, null, ["vegetarian"], {}],
    ["Curry", "noodols-3", "Shrimp Noodles", "Stir-fried noodles with shrimp.", 9.99, null, ["seafood"], {}],
    ["Curry", "noodols-4", "Spicy Ramen", "Rich broth ramen with chili oil.", 9.49, null, ["spicy"], { isPopular: true }],
    ["Curry", "noodols-5", "Beef Noodle Soup", "Slow-simmered beef broth noodles.", 10.49, null, [], {}],

    ["Coffee", "coffee-1", "Espresso", "A single shot, bold and rich.", 2.99, null, [], {}],
    ["Coffee", "coffee-2", "Cappuccino", "Espresso with steamed milk foam.", 3.99, null, [], { isPopular: true }],
    ["Coffee", "coffee-3", "Caffè Latte", "Smooth espresso with steamed milk.", 4.29, null, [], {}],
    ["Coffee", "coffee-4", "Cold Brew", "Slow-steeped, served over ice.", 4.49, 4.99, [], { isSpecial: true }],
    ["Coffee", "coffee-5", "Caramel Macchiato", "Espresso, vanilla, caramel drizzle.", 4.99, null, [], { isPopular: true }],
    ["Coffee", "coffee-6", "Mocha", "Espresso, chocolate, steamed milk.", 4.79, null, [], {}],

    ["Salad", "salad-1", "Caesar Salad", "Romaine, parmesan, croutons, caesar dressing.", 7.99, null, ["vegetarian"], { isPopular: true }],
    ["Salad", "salad-2", "Greek Salad", "Cucumber, tomato, olive, feta.", 8.49, null, ["vegetarian"], {}],
    ["Salad", "salad-3", "Grilled Chicken Salad", "Mixed greens with grilled chicken.", 9.99, null, ["chicken", "grill"], {}],
    ["Salad", "salad-4", "Garden Salad", "Fresh seasonal mixed greens.", 6.99, null, ["vegetarian", "vegan"], {}],
    ["Salad", "veg-1", "Stir-Fried Vegetables", "Seasonal vegetables, light garlic sauce.", 7.49, null, ["vegetarian", "vegan"], {}],
    ["Salad", "veg-2", "Roasted Vegetable Bowl", "Oven-roasted seasonal vegetables.", 8.29, null, ["vegetarian", "vegan", "roast"], {}],
    ["Salad", "veg-3", "Steamed Greens", "Lightly steamed seasonal greens.", 5.99, null, ["vegetarian", "vegan"], {}],
];

const run = async () => {
    await connectDB();

    const destroy = process.argv.includes("--destroy");

    if (destroy) {
        await Promise.all([Category.deleteMany({}), Food.deleteMany({})]);
        console.log("Categories and foods cleared.");
        await mongoose.disconnect();
        return;
    }

    await Category.deleteMany({});
    await Food.deleteMany({});

    await Category.insertMany(categories);
    console.log(`Seeded ${categories.length} categories.`);

    const foods = foodRows.map(([category, imageUrl, name, description, currentPrice, pastPrice, tags, flags]) => ({
        category,
        imageUrl,
        name,
        description,
        currentPrice,
        pastPrice: pastPrice || undefined,
        tags,
        rating: 4 + Math.round(Math.random() * 10) / 10, // 4.0 - 5.0
        numberOfReviews: Math.floor(Math.random() * 40),
        isAvailable: true,
        ...flags,
    }));
    await Food.insertMany(foods);
    console.log(`Seeded ${foods.length} food items.`);

    console.log(
        "No user accounts to seed — sign up/sign in via Firebase on the frontend. " +
            "Add your email to ADMIN_EMAILS in backend/.env to get admin access on next sign-in."
    );

    await mongoose.disconnect();
    console.log("Seeding complete.");
};

run().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
