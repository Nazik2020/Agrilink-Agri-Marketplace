import React from "react";
import spice1 from "../../../assets/blog/spice1.png";
import spice2 from "../../../assets/blog/spice2.png";
import spice3 from "../../../assets/blog/spice3.png";
import spice4 from "../../../assets/blog/spice4.png";

const Spice = () => {


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-800">
        The World of Spices: Flavor, Health, and Trade
      </h1>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">Introduction</h3>
      <p className="mb-4 text-gray-800">
        In the culinary arts, a spice is any seed, fruit, root, bark, or other plant substance in a form primarily used for flavoring or coloring food. Spices are distinguished from herbs, which are the leaves, flowers, or stems of plants used for flavoring or as a garnish. Spices and seasoning do not mean the same thing, but spices fall under the seasoning category with herbs. Spices are sometimes used in medicine, religious rituals, cosmetics, or perfume production. They are usually classified into spices, spice seeds, and herbal categories.
      </p>
      <img 
        src={spice1} 
        alt="Assorted spices" 
        className="mb-4 rounded-lg" 
        style={{ height: "220px", width: "auto" }}
  onError={undefined}
        onLoad={() => console.log("spice1 loaded successfully")}
      />
      <p className="mb-4 text-gray-800">
        For example, vanilla is commonly used as an ingredient in fragrance manufacturing. Plant-based sweeteners such as sugar are not considered spices.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Global Spice Markets</h3>
      <p className="mb-4 text-gray-800">
        Spices can be found in vibrant markets around the world, from the central market in Agadir, Morocco, to the Saúde flea market in São Paulo, Brazil. These markets showcase the diversity and cultural significance of spices across different regions. A group of Indian herbs and spices in bowls represents the traditional way spices have been traded and displayed for centuries.
      </p>
      <img 
        src={spice2} 
        alt="Spice market display" 
        className="mb-4 rounded-lg" 
        style={{ height: "220px", width: "auto" }}
  onError={undefined}
        onLoad={() => console.log("spice2 loaded successfully")}
      />

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Forms and Usage of Spices</h3>
      <p className="mb-4 text-gray-800">
        Spices can be used in various forms, including fresh, whole, dried, grated, chopped, crushed, ground, or extracted into a tincture. These processes may occur before the spice is sold, during meal preparation in the kitchen, or even at the table when serving a dish, such as grinding peppercorns as a condiment. Certain spices, like turmeric, are rarely available fresh or whole and are typically purchased in ground form. Small seeds, such as fennel and mustard, can be used either in their whole form or as a powder, depending on the culinary need.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Storage and Shelf Life</h3>
      <p className="mb-4 text-gray-800">
        A whole dried spice has the longest shelf life, so it can be purchased and stored in larger amounts, making it cheaper on a per-serving basis. A fresh spice, such as ginger, is usually more flavorful than its dried form, but fresh spices are more expensive and have a much shorter shelf life.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Health Considerations</h3>
      <p className="mb-4 text-gray-800">
        There is not enough clinical evidence to indicate that consuming spices affects human health. However, spices continue to be valued for their flavor-enhancing properties and cultural significance in cuisines around the world.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">India: The Spice Capital</h3>
      <p className="mb-4 text-gray-800">
        India contributes to 75% of global spice production. This is reflected culturally through its cuisine. Historically, the spice trade developed throughout the Indian subcontinent as well as in East Asia and the Middle East. Europe's demand for spices was among the economic and cultural factors that encouraged exploration in the early modern period.
      </p>
      <img 
        src={spice3} 
        alt="Indian spices collection" 
        className="mb-4 rounded-lg" 
        style={{ height: "220px", width: "auto" }}
  onError={undefined}
        onLoad={() => console.log("spice3 loaded successfully")}
      />

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Historical Significance</h3>
      <p className="mb-4 text-gray-800">
        The spice trade has played a crucial role in shaping world history, from the ancient Silk Road to the Age of Exploration. Spices were once so valuable that they were used as currency and were a major driver of global trade routes. The quest for spices led to the discovery of new lands and the establishment of trade networks that connected distant cultures.
      </p>

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Modern Spice Trade</h3>
      <p className="mb-4 text-gray-800">
        Today, the spice trade continues to be a vital part of the global economy, with major producing countries including India, Indonesia, China, and Vietnam. Modern technology has improved the processing, storage, and transportation of spices, making them more accessible to consumers worldwide while maintaining their quality and flavor.
      </p>
      <img 
        src={spice4} 
        alt="Modern spice processing" 
        className="mb-4 rounded-lg" 
        style={{ height: "220px", width: "auto" }}
  onError={undefined}
        onLoad={() => console.log("spice4 loaded successfully")}
      />

      <h3 className="text-lg font-semibold mb-2 text-gray-900">Conclusion</h3>
      <p className="mb-4 text-gray-800">
        Spices are more than just flavor enhancers—they are a bridge between cultures, a source of economic prosperity, and a driver of historical change. From the bustling markets of Morocco to the traditional spice bowls of India, spices continue to enrich our culinary experiences and connect us to the diverse cultures of the world.
      </p>
    </div>
  );
};

export default Spice;
