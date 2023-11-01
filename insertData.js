import mongoose from "mongoose";
import Post from "./server/models/post.model.js"; // Replace with the correct path to your model
import dotenv from 'dotenv';

dotenv.config()
// Replace with your MongoDB URI
const uri = process.env.mongodb_URL ;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", async () => {
  console.log("Connected to MongoDB");

  // Recipe post data
  const recipeData = [
    {
      "title": "Delicious Chocolate Cake",
      "description": "A moist and rich chocolate cake for chocolate lovers.",
      "ingredients": ["2 cups all-purpose flour", "1 3/4 cups granulated sugar", "3/4 cup cocoa powder", "1 1/2 tsp baking powder", "1 1/2 tsp baking soda", "2 eggs", "1 cup milk", "1/2 cup vegetable oil", "2 tsp vanilla extract", "1 cup boiling water"],
      "instructions": "1. Preheat oven to 350°F (175°C). 2. In a large bowl, mix together flour, sugar, and cocoa. 3. Add eggs, milk, oil, and vanilla, and mix well. 4. Stir in boiling water until the batter is smooth. 5. Pour into a greased 9x13-inch pan. 6. Bake for 30 to 35 minutes. Let cool before serving.",
      "image": "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/109778.jpg?resize=1200:*",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Homemade Pizza",
      "description": "Create your own pizza with your favorite toppings.",
      "ingredients": ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Pepperoni", "Bell peppers", "Onions", "Mushrooms", "Olives", "Oregano", "Basil"],
      "instructions": "1. Roll out the pizza dough. 2. Spread tomato sauce and add mozzarella cheese. 3. Add your choice of toppings. 4. Bake at 450°F (230°C) for 12-15 minutes. 5. Sprinkle with oregano and basil.",
      "image": "https://www.allrecipes.com/thmb/9UTj7kZBJDqory0cdEv_bw6Ef_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48727-Mikes-homemade-pizza-DDMFS-beauty-2x1-BG-2976-d5926c9253d3486bbb8a985172604291.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Classic Spaghetti Bolognese",
      "description": "A hearty and savory spaghetti bolognese recipe.",
      "ingredients": ["1 lb ground beef", "1 onion, diced", "2 cloves garlic, minced", "1 can crushed tomatoes", "1 tsp dried oregano", "1/2 tsp salt", "1/4 tsp black pepper", "8 oz spaghetti", "Parmesan cheese"],
      "instructions": "1. Brown ground beef in a pan, add onions and garlic. 2. Stir in crushed tomatoes, oregano, salt, and pepper. 3. Simmer for 15-20 minutes. 4. Cook spaghetti according to package instructions. 5. Serve bolognese sauce over cooked spaghetti. 6. Sprinkle with Parmesan cheese.",
      "image": "https://sanremo.com.au/content/uploads/2017/05/Resized_San-Remo_Core-Range_13975_Spaghetti-Bolognese-900x600.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Fresh Fruit Salad",
      "description": "A refreshing and healthy fruit salad.",
      "ingredients": ["Apples", "Bananas", "Oranges", "Grapes", "Strawberries", "Honey", "Lemon juice"],
      "instructions": "1. Chop fruits and place them in a bowl. 2. Drizzle honey and lemon juice. 3. Toss gently to combine. 4. Chill before serving.",
      "image": "https://hips.hearstapps.com/hmg-prod/images/pasta-salad-horizontal-jpg-1522265695.jpg?crop=0.6668xw:1xh;center,top&resize=1200:*",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Vegetable Stir-Fry",
      "description": "A quick and delicious vegetable stir-fry recipe.",
      "ingredients": ["Broccoli", "Bell peppers", "Carrots", "Snap peas", "Mushrooms", "Garlic", "Ginger", "Soy sauce", "Sesame oil"],
      "instructions": "1. Heat sesame oil in a pan, add garlic and ginger. 2. Add chopped vegetables and stir-fry. 3. Add soy sauce and cook until tender. 4. Serve over rice.",
      "image": "https://www.mccormick.com/-/media/project/oneweb/mccormick-us/mccormick/recipe-images/stir-fry-vegetables-recipe-800x800.jpg?rev=93a14607adf8487098a20c6c2f708b0d&vd=20220914T205534Z&hash=3462A145DB20845D4AB02C88469481FE",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Creamy Chicken Alfredo",
      "description": "A rich and creamy chicken alfredo pasta dish.",
      "ingredients": ["Chicken breasts", "Fettuccine pasta", "Heavy cream", "Parmesan cheese", "Butter", "Garlic", "Salt", "Black pepper"],
      "instructions": "1. Cook chicken in butter until cooked through. 2. Cook pasta according to package instructions. 3. In a separate pan, melt butter and sauté garlic. 4. Add heavy cream, parmesan, salt, and pepper. 5. Slice cooked chicken and add to the sauce. 6. Toss with cooked pasta.",
      "image": "https://thefoodcharlatan.com/wp-content/uploads/2020/08/Homemade-Chicken-Fettuccine-Alfredo-10-650x975.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Homemade Sushi Rolls",
      "description": "Create your own sushi rolls with fresh ingredients.",
      "ingredients": ["Sushi rice", "Nori seaweed sheets", "Sliced fish (salmon, tuna)", "Cucumber", "Avocado", "Soy sauce", "Wasabi", "Pickled ginger"],
      "instructions": "1. Place a sheet of nori on a bamboo sushi mat. 2. Spread sushi rice over the nori. 3. Add fish, cucumber, and avocado. 4. Roll tightly and slice into pieces. 5. Serve with soy sauce, wasabi, and pickled ginger.",
      "image": "https://www.allrecipes.com/thmb/CBOcP0zp71lR2bn-KUMkgCB92RA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/24228-Sushi-roll-ddmfs-4x3-2914-1839f746d9334814a7a5d93ed45ba082.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Crispy Fried Chicken",
      "description": "A crispy and flavorful fried chicken recipe.",
      "ingredients": ["Chicken pieces", "Buttermilk", "Flour", "Paprika", "Salt", "Black pepper", "Vegetable oil"],
      "instructions": "1. Marinate chicken in buttermilk for a few hours. 2. Mix flour, paprika, salt, and pepper in a bag. 3. Coat chicken in the flour mixture. 4. Fry in hot oil until golden brown and crispy.",
      "image": "https://static.toiimg.com/thumb/75579926.cms?width=1200&height=900",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Mango Salsa",
      "description": "A sweet and spicy mango salsa for dipping.",
      "ingredients": ["Mango", "Red onion", "Cilantro", "Lime juice", "Jalapeno", "Salt"],
      "instructions": "1. Dice mango, red onion, and jalapeno. 2. Chop cilantro. 3. Mix all ingredients in a bowl. 4. Add lime juice and salt to taste.",
      "image": "https://www.simplyrecipes.com/thmb/QUGG14kk81vj3LTjhhJD-XQDjfM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2006__08__mango-salsa-horiz-a-1600-9c2c6ed39e4740f19cea1496bf2d6554.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
    {
      "title": "Vegetable Soup",
      "description": "A hearty and healthy vegetable soup recipe.",
      "ingredients": ["Carrots", "Potatoes", "Onions", "Celery", "Green beans", "Tomatoes", "Vegetable broth", "Garlic", "Thyme", "Bay leaves"],
      "instructions": "1. Sauté onions and garlic in a pot. 2. Add chopped vegetables and cook briefly. 3. Pour in vegetable broth and add thyme and bay leaves. 4. Simmer until vegetables are tender.",
      "image": "https://realfoodwholelife.com/wp-content/uploads/2021/10/Slow-Cooker-Vegetable-Soup-2-500x500.jpg",
      "authorId": "65407210b6ecbb10494293cd",
      "authorName": "ajithkumar R",
      "likes": {}
    },
      {
        "title": "Grilled Salmon with Lemon Butter Sauce",
        "description": "A succulent grilled salmon dish with a zesty lemon butter sauce.",
        "ingredients": ["Salmon fillets", "Lemon juice", "Butter", "Garlic", "Dill", "Salt", "Black pepper"],
        "instructions": "1. Season salmon with salt, pepper, and dill. 2. Grill until cooked through. 3. In a separate pan, melt butter and sauté garlic. 4. Add lemon juice. 5. Drizzle lemon butter sauce over grilled salmon.",
        "image": "https://www.thecookierookie.com/wp-content/uploads/2019/04/garlic-butter-salmon-grilled-salmon-recipe-10-of-10.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Classic Beef Stew",
        "description": "A comforting and hearty beef stew with tender meat and vegetables.",
        "ingredients": ["Stewing beef", "Carrots", "Potatoes", "Onions", "Celery", "Beef broth", "Tomato paste", "Thyme", "Bay leaves", "Flour"],
        "instructions": "1. Dredge beef in flour and brown in a pot. 2. Add onions and garlic. 3. Stir in beef broth and tomato paste. 4. Add vegetables and simmer with thyme and bay leaves until tender.",
        "image": "https://www.jessicagavin.com/wp-content/uploads/2020/12/beef-stew-14-1200.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Homemade Guacamole",
        "description": "A simple and delicious guacamole recipe for dipping or topping tacos.",
        "ingredients": ["Ripe avocados", "Lime juice", "Tomatoes", "Onion", "Cilantro", "Jalapeno", "Salt", "Black pepper"],
        "instructions": "1. Mash avocados and mix with lime juice. 2. Add diced tomatoes, onion, cilantro, and jalapeno. 3. Season with salt and pepper to taste.",
        "image": "https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/04/Guacamole-1-2.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Spicy Thai Red Curry",
        "description": "A fiery and flavorful Thai red curry with your choice of protein and vegetables.",
        "ingredients": ["Red curry paste", "Coconut milk", "Chicken, tofu, or shrimp", "Bell peppers", "Zucchini", "Bamboo shoots", "Fish sauce", "Sugar", "Basil leaves"],
        "instructions": "1. Simmer red curry paste in coconut milk. 2. Add protein and vegetables. 3. Season with fish sauce and sugar. 4. Garnish with basil leaves.",
        "image": "https://example.com/thai-red-curry.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Baked Macaroni and Cheese",
        "description": "A cheesy and creamy baked macaroni and cheese casserole.",
        "ingredients": ["Macaroni pasta", "Cheddar cheese", "Milk", "Butter", "Flour", "Mustard powder", "Breadcrumbs"],
        "instructions": "1. Cook macaroni pasta. 2. Make a cheese sauce with cheddar, milk, butter, and flour. 3. Mix pasta and sauce. 4. Top with breadcrumbs and bake until golden brown.",
        "image": "https://www.culinaryhill.com/wp-content/uploads/2022/12/Baked-Mac-and-Cheese-Culinary-Hill-1200x800-warm.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Fruit Smoothie Bowl",
        "description": "A colorful and nutritious fruit smoothie bowl for a healthy breakfast.",
        "ingredients": ["Bananas", "Mixed berries", "Greek yogurt", "Honey", "Granola", "Chia seeds"],
        "instructions": "1. Blend bananas, mixed berries, Greek yogurt, and honey. 2. Pour into a bowl. 3. Top with granola and chia seeds.",
        "image": "https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Frozen-Fruit-Smoothie-Bowl.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Garlic Butter Shrimp Pasta",
        "description": "A quick and flavorful shrimp pasta dish with garlic butter sauce.",
        "ingredients": ["Shrimp", "Linguine pasta", "Butter", "Garlic", "Lemon juice", "Parsley", "Red pepper flakes", "Salt", "Black pepper"],
        "instructions": "1. Cook pasta. 2. Sauté shrimp in garlic and butter. 3. Add lemon juice, parsley, and red pepper flakes. 4. Toss with cooked pasta.",
        "image": "https://hips.hearstapps.com/del.h-cdn.co/assets/17/05/980x980/square-1486161729-delish-garlic-butter-shrimp-pasta-2.jpg?resize=1200:*",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Crispy Tofu Tacos",
        "description": "Delicious and crispy tofu tacos with your favorite toppings.",
        "ingredients": ["Tofu", "Taco seasoning", "Corn tortillas", "Lettuce", "Tomatoes", "Avocado", "Sour cream", "Salsa"],
        "instructions": "1. Season tofu with taco seasoning and bake until crispy. 2. Warm corn tortillas. 3. Assemble tacos with tofu and toppings.",
        "image": "https://www.chiselandfork.com/wp-content/uploads/2017/06/tofu-tacos-2.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
      {
        "title": "Lemon Blueberry Pancakes",
        "description": "Fluffy and zesty lemon blueberry pancakes for a delightful breakfast.",
        "ingredients": ["Pancake mix", "Lemon zest", "Blueberries", "Milk", "Eggs", "Maple syrup"],
        "instructions": "1. Mix pancake mix with lemon zest, blueberries, milk, and eggs. 2. Cook on a griddle until golden. 3. Serve with maple syrup.",
        "image": "https://valentinascorner.com/wp-content/uploads/2021/07/Blueberry-Pancakes.jpg",
        "authorId": "6542c14d479df9073cdb7a11",
        "authorName": "Test Account",
        "likes": {}
      },
        {
          "title": "Hawaiian BBQ Chicken Skewers",
          "description": "Grilled chicken skewers with a sweet and tangy Hawaiian BBQ sauce.",
          "ingredients": ["Chicken breast chunks", "Pineapple chunks", "Bell peppers", "Onions", "BBQ sauce", "Soy sauce", "Brown sugar"],
          "instructions": "1. Thread chicken, pineapple, bell peppers, and onions onto skewers. 2. Mix BBQ sauce, soy sauce, and brown sugar. 3. Grill skewers and baste with sauce.",
          "image": "https://hips.hearstapps.com/hmg-prod/images/hawaiian-chicken-skewers-index-64a7154fe7f4e.jpg?crop=0.889xw:1.00xh;0.0561xw,0",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Grill Master",
          "likes": {}
        },
        {
          "title": "Mushroom Risotto",
          "description": "A creamy and savory mushroom risotto with Arborio rice.",
          "ingredients": ["Arborio rice", "Mushrooms", "Onion", "White wine", "Chicken broth", "Butter", "Parmesan cheese"],
          "instructions": "1. Sauté mushrooms and onions in butter. 2. Add Arborio rice and white wine. 3. Gradually add chicken broth and stir until creamy. 4. Stir in Parmesan cheese.",
          "image": "https://hips.hearstapps.com/delish/assets/17/35/1504128527-delish-mushroom-risotto.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Risotto Aficionado",
          "likes": {}
        },
        {
          "title": "Crispy Baked Potato Wedges",
          "description": "Golden and crispy potato wedges with a seasoning blend.",
          "ingredients": ["Potatoes", "Olive oil", "Paprika", "Garlic powder", "Salt", "Black pepper"],
          "instructions": "1. Cut potatoes into wedges. 2. Toss with olive oil and seasonings. 3. Bake in the oven until crispy.",
          "image": "https://cafedelites.com/wp-content/uploads/2016/06/Baked-Potato-Wedges-IMAGE-63.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Potato Lover",
          "likes": {}
        },
        {
          "title": "Beef and Broccoli Stir-Fry",
          "description": "A quick and tasty beef and broccoli stir-fry with a savory sauce.",
          "ingredients": ["Beef sirloin", "Broccoli florets", "Soy sauce", "Oyster sauce", "Sesame oil", "Ginger", "Garlic", "Cornstarch"],
          "instructions": "1. Slice beef and marinate in soy sauce, oyster sauce, and cornstarch. 2. Stir-fry beef, ginger, and garlic. 3. Add broccoli and cook. 4. Drizzle with sesame oil.",
          "image": "https://healthyfitnessmeals.com/wp-content/uploads/2022/03/Beef-and-broccoli-stir-fry-7.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Stir-Fry Chef",
          "likes": {}
        },
        {
          "title": "Homemade Scones",
          "description": "Delicate and buttery homemade scones for tea time.",
          "ingredients": ["Flour", "Sugar", "Baking powder", "Butter", "Milk", "Egg", "Vanilla extract"],
          "instructions": "1. Mix flour, sugar, and baking powder. 2. Cut in cold butter. 3. Stir in milk, egg, and vanilla. 4. Form into scones and bake until golden brown.",
          "image": "https://thebusybaker.ca/wp-content/uploads/2020/08/easy-scones-fb-ig-6-scaled.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Tea Enthusiast",
          "likes": {}
        },
        {
          "title": "Caprese Salad",
          "description": "A simple and refreshing Caprese salad with tomatoes, mozzarella, and basil.",
          "ingredients": ["Tomatoes", "Mozzarella cheese", "Fresh basil leaves", "Balsamic vinegar", "Olive oil", "Salt", "Black pepper"],
          "instructions": "1. Slice tomatoes and mozzarella. 2. Arrange on a plate with basil leaves. 3. Drizzle with balsamic vinegar and olive oil. 4. Season with salt and pepper.",
          "image": "https://images.immediate.co.uk/production/volatile/sites/30/2022/05/Caprese-salad-8f218a3.png?resize=768,574",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Salad Lover",
          "likes": {}
        },
        {
          "title": "Beef Tacos",
          "description": "Classic beef tacos with seasoned ground beef and your favorite toppings.",
          "ingredients": ["Ground beef", "Taco seasoning", "Taco shells", "Lettuce", "Tomatoes", "Cheese", "Sour cream"],
          "instructions": "1. Cook ground beef with taco seasoning. 2. Fill taco shells with beef and add toppings.",
          "image": "https://www.marthastewart.com/thmb/TqdvJ-yZ_VA9I86P7VXA1sOY6O0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/msledf_1003_beeftaco_horiz-892fe13aeba549d99495e27abc1d68f7.jpgitokb2Re7eO8",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Taco Enthusiast",
          "likes": {}
        },
        {
          "title": "Lemon Garlic Roast Chicken",
          "description": "A tender and flavorful roast chicken with a zesty lemon garlic marinade.",
          "ingredients": ["Whole chicken", "Lemon", "Garlic", "Rosemary", "Olive oil", "Salt", "Black pepper"],
          "instructions": "1. Rub chicken with olive oil, lemon juice, garlic, and rosemary. 2. Roast until golden brown and cooked through.",
          "image": "https://www.eatwell101.com/wp-content/uploads/2021/02/baked-chicken-thighs-recipe-5.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Roast Chicken Expert",
          "likes": {}
        },
        {
          "title": "Homemade Pesto Pasta",
          "description": "A delightful homemade pesto sauce served over your choice of pasta.",
          "ingredients": ["Basil leaves", "Pine nuts", "Garlic", "Parmesan cheese", "Olive oil", "Pasta", "Salt", "Black pepper"],
          "instructions": "1. Blend basil, pine nuts, garlic, and Parmesan in a food processor. 2. Gradually add olive oil. 3. Toss pesto with cooked pasta.",
          "image": "https://ohsweetbasil.com/wp-content/uploads/15-minute-pesto-pasta-recipe-6-scaled.jpg",
          "authorId": "6542c14d479df9073cdb7a11",
          "authorName": "Pesto Lover",
          "likes": {}
        }
    
  ]

  const insertRecipeData = async (recipeData) => {
    for (const recipe of recipeData) {
      const post = new Post(recipe);

      try {
        await post.save();
        console.log(`Saved recipe: ${recipe.title}`);
      } catch (err) {
        console.error(`Error saving recipe: ${recipe.title}`, err);
      }
    }

    // Close the database connection after inserting data
    db.close(() => {
      console.log("Disconnected from MongoDB");
      process.exit(0);
    });
  };

  insertRecipeData(recipeData);
});
