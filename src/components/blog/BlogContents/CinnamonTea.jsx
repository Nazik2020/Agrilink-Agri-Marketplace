import React from "react";
import cinnaImg from "../../../assets/blog/cinnaImg.png";
import cinnamonteaImg from "../../../assets/blog/cinnamonteaImg.png";

const CinnamonTea = () => (
  <div className="w-full flex justify-center">
    <div className="w-full max-w-screen-xl px-6">
    <h1 className="text-3xl font-bold mb-4 text-green-800">Cinnamon Tea</h1>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">What is Cinnamon?</h3>
    <p className="mb-4 text-gray-800">
      Cinnamon tea is a warm, aromatic beverage made by infusing cinnamon bark in hot water. 
      Prized for its sweet, spicy flavor and inviting aroma, cinnamon tea has been enjoyed for centuries 
      across many cultures, both as a comforting drink and for its potential health benefits. 
      Whether sipped on a chilly evening or served as a soothing remedy, cinnamon tea is known for its 
      ability to relax the senses and support overall wellness. 
      <br /><br />
      Cinnamon, perhaps one of the most popular and tastiest of spices used for sweet and savory recipes, 
      is actually the bark of a tree. The tree’s inner bark is stripped and dried until it curls into rolls or quills. 
      It’s available as sticks or ground powder.There are two main types of cinnamon: Ceylon cinnamon, often referred to as “true” cinnamon, and Cassia cinnamon, which is more common and usually found in supermarkets. Ceylon cinnamon is lighter in color and has a delicate, mildly sweet flavor, while Cassia is darker, thicker, and has a stronger, more pungent taste. Although both are used in cooking, Ceylon cinnamon is often preferred for its quality and lower coumarin content, making it safer in large quantities.

Historically, cinnamon has been prized since ancient times. It was once considered a gift fit for kings and gods, used in religious rituals, perfumes, and even for embalming in Egypt. In medieval Europe, it became a symbol of wealth and status and was one of the key drivers of the spice trade.
    </p>
    <img 
      src={cinnaImg} 
      alt="Cinnamon sticks" 
      className="mb-4 rounded-lg" 
      onError={(e) => {
  // Error handler removed
        e.target.style.display = 'none';
      }}
      onLoad={() => console.log("CinnamonTea cinnaImg loaded successfully")}
    />
    <p className="mb-4 text-gray-800">
      There are mainly two types of cinnamon available in the market: Ceylon and Cassia. Ceylon cinnamon is known as “true” cinnamon and is native to Sri Lanka, whereas Cassia is more commonly found and cheaper. Ceylon cinnamon has a delicate, mildly sweet flavor and is preferred for its health benefits.Beyond its culinary uses, cinnamon is well-known for its medicinal properties. It is rich in antioxidants, has anti-inflammatory effects, and may help lower blood sugar levels. Some studies suggest it can reduce the risk of heart disease and improve insulin sensitivity, making it a favorite in traditional medicine systems like Ayurveda and Traditional Chinese Medicine.
    </p>

    <h3 className="text-lg font-semibold mb-2 text-gray-900">Health Benefits of Cinnamon Tea</h3>
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-800">
      <li><strong>Anti-inflammatory Properties:</strong> Helps reduce swelling and inflammation in the body.</li>
      <li><strong>Rich in Antioxidants:</strong> Protects your cells from damage and may slow down aging.</li>
      <li><strong>Supports Heart Health:</strong> May lower bad cholesterol levels and regulate blood pressure.</li>
      <li><strong>Improves Digestion:</strong> Eases bloating, gas, and indigestion.</li>
      <li><strong>Controls Blood Sugar:</strong> Can improve insulin sensitivity and regulate blood glucose levels.</li>
      <li><strong>Anti-inflammatory Properties:</strong> Helps reduce swelling and inflammation in the body.</li>
<li><strong>Rich in Antioxidants:</strong> Protects your cells from damage and may slow down aging.</li>
<li><strong>Supports Heart Health:</strong> May lower bad cholesterol levels and regulate blood pressure.</li>
<li><strong>Improves Digestion:</strong> Eases bloating, gas, and indigestion.</li>
<li><strong>Controls Blood Sugar:</strong> Can improve insulin sensitivity and regulate blood glucose levels.</li>
<li><strong>Boosts Immunity:</strong> Contains antibacterial and antifungal properties that help fight infections.</li>
<li><strong>Aids in Weight Loss:</strong> May help suppress appetite and improve metabolism.</li>
<li><strong>Relieves Menstrual Cramps:</strong> Acts as a natural muscle relaxant to ease period pain.</li>
<li><strong>Freshens Breath:</strong> Its natural antibacterial compounds help fight oral bacteria.</li>
<li><strong>Supports Brain Function:</strong> May improve focus, memory, and protect against cognitive decline.</li>
<li><strong>Reduces Risk of Infections:</strong> Contains compounds like cinnamaldehyde that fight bacteria and fungi.</li>
<li><strong>Promotes Relaxation:</strong> The warm aroma and soothing properties help reduce stress and anxiety.</li>

    </ul>
<br></br>
    <h3 className="text-lg font-semibold mb-2 text-gray-900">How to Make Cinnamon Tea</h3>
    <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
      <ol
        className="list-decimal list-inside space-y-2 text-gray-800 flex-1"
      ><br></br>
        <li>Boil 1½ cups of water.</li>
        <li>Add 1 Ceylon cinnamon stick (or ½ tsp Ceylon cinnamon powder).</li>
        <li>Simmer for 10–15 minutes.</li>
        <li>Strain into a cup.</li>
        <li>Optional: Add honey or lemon for added flavor.</li>
      </ol>
      <div className="flex-shrink-0 flex items-start">
        <img
          src={cinnamonteaImg}
          alt="Cinnamon tea in a cup"
          className="rounded-lg object-cover"
          style={{ height: "390px", width: "auto" }}
          onError={(e) => {
            // Error handler removed
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log("CinnamonTea cinnamonteaImg loaded successfully")}
        />
      </div>
    </div>

    <h3 className="text-lg font-semibold mb-2 text-gray-900">Best Time to Drink Cinnamon Tea</h3>
    <p className="mb-4 text-gray-800">
      Cinnamon tea can be consumed in the morning for a metabolism boost, or at night to support digestion and relaxation. Drinking it 30 minutes before meals may also help control blood sugar spikes.
    </p>

    <h3 className="text-lg font-semibold mb-2 text-gray-900">Precautions</h3>
    <p className="mb-4 text-gray-800">
      While cinnamon tea is generally safe, consuming too much—especially Cassia cinnamon—can cause liver issues due to high coumarin content. Limit daily intake to 1–2 cups and use Ceylon cinnamon when possible.
    </p>

    <h3 className="text-lg font-semibold mb-2 text-gray-900">Conclusion</h3>
    <p className="mb-4 text-gray-800">
      Cinnamon tea is a delicious and health-boosting drink that fits perfectly into a wellness lifestyle. With its antioxidants, blood sugar balancing, and anti-inflammatory properties, this ancient spice proves that great things come in small (and spicy) packages.
    </p>
  </div>
  </div>
);

export default CinnamonTea;
