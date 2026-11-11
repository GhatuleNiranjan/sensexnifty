export interface Article {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content?: string;
    category: "USA" | "EUROPE" | "RUSSIA" | "TECHNOLOGY" | "OPINION" | "FINANCE";
    location?: string;
    author: string;
    publishedAt: string;
    imageUrl?: string;
    imageCaption?: string;
    isTopStory?: boolean;
    isBreaking?: boolean;
}

export const MOCK_TOP_STORY: Article = {
    id: "brokerage-calls-nov-2026",
    slug: "todays-top-brokerage-calls-goldman-sachs-jpmorgan-citi-jefferies-nomura",
    title: "Today's Top Brokerage Calls: Goldman Sachs, JPMorgan, Citi, Jefferies and Nomura Upgrade Stocks; Check Target Prices",
    summary: "Today's brokerage reports: Goldman Sachs, JPMorgan, Citi, Jefferies and Nomura revise ratings and target prices for Amagi Media, Thermax, Honasa, Voltas and more.",
    category: "FINANCE",
    location: "MUMBAI",
    author: "THE SENSEXNIFTY DESK",
    publishedAt: "NOVEMBER 9, 2026 · 08:30 IST",
    imageUrl: "/brokerage-calls.jpg",
    imageCaption: "Global brokerages issue fresh targets following Q2FY27 earnings reports. Photo: SensexNifty",
    isTopStory: true,
    content: `
Indian stock market investors are tracking several important brokerage reports on November 9, 2026, as leading global and domestic brokerages have released their latest recommendations following the Q2FY27 earnings season.

Goldman Sachs, JPMorgan, Jefferies, Citi, Kotak Institutional Equities and Nomura have issued fresh ratings and target price revisions across multiple sectors, including media, engineering, consumer goods, defence electronics, telecommunications, metals, power and restaurants.

---

### 1. Amagi Media: Goldman Sachs and Kotak Upgrade to Buy

Amagi Media received positive coverage from Goldman Sachs and Kotak Institutional Equities following its latest quarterly performance.

* **Goldman Sachs:** Buy | **Target Price:** ₹635  
  Goldman Sachs maintained a Buy rating on Amagi Media, highlighting strong earnings momentum, elevated revenue growth, improving operating leverage and robust free cash flow conversion. The brokerage believes the company's investments in AI-powered products across the video value chain could expand its total addressable market (TAM) and support long-term growth.

* **Kotak Institutional Equities:** Upgrade to Buy | **Target Price:** ₹715  
  Kotak upgraded Amagi Media to Buy following a robust quarterly performance. Revenue growth remained above 20% for the third consecutive quarter, while adjusted EBITDA margins expanded 540 basis points year-on-year to 16.5%. Kotak expects operating leverage to drive approximately 760 basis points of adjusted EBITDA margin expansion between FY26 and FY29, taking margins to 17.9%.

---

### 2. Thermax: JPMorgan Upgrades to Overweight, Jefferies Maintains Buy

Thermax has witnessed a significant correction in its share price, but brokerages see potential for an earnings recovery.

* **JPMorgan:** Upgrade to Overweight | **Target Price:** ₹3,491  
  JPMorgan upgraded Thermax to Overweight, believing the recent share price correction has largely factored in concerns surrounding weak earnings, commodity inflation, project cost overruns and losses in the renewable energy business. The brokerage highlighted a sequential improvement in margins, recovering from 3% in Q1FY27 to 7% in Q2FY27.

* **Jefferies:** Buy | **Target Price:** ₹4,020  
  Jefferies maintained its Buy recommendation but reduced its target price to ₹4,020. Thermax's September-quarter EBITDA came in 19% below estimates, with margins missing expectations by 170 basis points at 6.9%. Higher commodity prices and shipment delays affected profitability. Although first-half FY27 order inflows declined 4% year-on-year, management remains confident of achieving higher order inflows in the second half compared with FY26. Jefferies expects the strong order book to provide revenue visibility for FY27-FY29, while anticipating a gradual margin recovery.

---

### 3. Honasa Consumer: Jefferies Raises Target to ₹700, Citi Maintains Sell

Honasa Consumer delivered a strong quarterly performance, supported by broad-based growth across its brands and distribution channels.

* **Jefferies:** Buy | **Target Price:** ₹700  
  Jefferies raised its target price on Honasa Consumer to ₹700 and maintained its Buy recommendation. The company reported its strongest growth since listing, with EBITDA and PAT nearly doubling year-on-year. Mamaearth delivered high-teen growth, while The Derma Co. and newer brands continued expanding rapidly.

* **Citi:** Sell | **Target Price:** ₹390  
  Citi maintained its Sell rating despite Honasa Consumer delivering strong quarterly results. Revenue increased 36% year-on-year, while EBITDA surged 95%, supported by underlying volume growth of 31%. EBITDA margins expanded 390 basis points to 12.7%. However, Citi highlighted elevated advertising expenditure, declining gross margins and intensifying competition as potential risks. The brokerage believes the company's valuation of approximately 49 times FY28 estimated earnings already factors in substantial future growth and margin expansion.

---

### 4. Azad Engineering: Goldman Sachs Maintains Buy, Target ₹3,125

Goldman Sachs maintained its Buy recommendation on Azad Engineering with a target price of ₹3,125. The company reported strong quarterly performance, with revenue increasing 31% year-on-year and 11% sequentially to ₹191 crore. EBITDA increased 38% year-on-year to ₹72.3 crore, while EBITDA margins expanded 177 basis points to 37.9%. Gross margins improved significantly to 95.6%, supported by favourable inventory-related cost movements. Management expects the company's annual revenue run rate to reach ₹1,300 crore by FY28, more than double its FY26 level.

---

### 5. Data Patterns: Goldman Sachs Maintains Neutral, Target ₹4,165

Goldman Sachs maintained a Neutral rating on Data Patterns with a target price of ₹4,165. The company's Q2FY27 performance missed expectations across major financial parameters. Revenue, EBITDA and PAT came in 10%, 47% and 52% below Goldman Sachs estimates, respectively. However, order inflows remained strong at ₹930 crore during Q2FY27, taking first-half inflows to ₹1,050 crore, nearly three times the previous year. The confirmed order book stood at ₹1,740 crore, with an additional ₹960 crore in negotiated orders awaiting formalisation.

---

> **Disclaimer:** *This article is for educational and informational purposes only. The brokerage recommendations, ratings and target prices mentioned above are based on the reports attributed to the respective research firms. This content does not constitute investment advice or a recommendation to buy, sell or hold any securities. Stock market investments are subject to market risks. Investors should conduct their own research and consult a SEBI-registered investment adviser before making investment decisions.*
`
};

export const MOCK_LATEST_ARTICLES: Article[] = [
    {
        id: "2",
        slug: "us-fed-signals-cautious-monetary-path",
        title: "US Federal Reserve signals cautious monetary path amid persistent inflation",
        summary: "Central bank officials emphasize data dependency as inflation moderation shows signs of plateauing across key sectors.",
        category: "USA",
        location: "WASHINGTON",
        author: "THE SENSEXNIFTY DESK",
        publishedAt: "TODAY · 07:45 IST",
    },
    {
        id: "3",
        slug: "european-industry-weighs-cost-of-energy-transition",
        title: "European industry weighs the cost of its next technological transition",
        summary: "Manufacturers balance capital investments and global competitiveness as European policymakers debate industrial strategy.",
        category: "EUROPE",
        location: "BRUSSELS",
        author: "THE SENSEXNIFTY DESK",
        publishedAt: "TODAY · 06:15 IST",
    },
    {
        id: "4",
        slug: "tech-giants-face-stricter-eu-ai-rules",
        title: "Digital rules put global technology ambitions under regulatory scrutiny",
        summary: "European regulators scrutinize artificial intelligence firms to balance citizen safety with technological innovation.",
        category: "TECHNOLOGY",
        author: "THE SENSEXNIFTY DESK",
        publishedAt: "YESTERDAY · 18:20 IST",
    },
];