import React from "react";
import { TopAppBar } from "@/components/landing/TopAppBar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="dark bg-[#131314] text-on-background selection:bg-primary selection:text-on-primary font-body-md min-h-screen flex flex-col">
      <TopAppBar />
      <main className="flex-grow pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-8 text-primary">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-primary leading-relaxed">
          <p>
            Hifzy is an organization that strives to empower every human being to benefit from the Quran. Hifzy values and respects the privacy of all of our users.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Information Collection</h2>
          <p>
            We collect certain personal information from users who choose to create an account on Hifzy. This information may include:
          </p>
          <p>
            <strong>Email Address:</strong> We collect your email address to facilitate the account creation process and for communication purposes related to your account, including account recovery and security notifications.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Use of Personal Information</h2>
          <p>
            We use the personal information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account Creation and Management:</strong> Your email address is used to create and manage your account on our website. It enables you to log in, access your settings, and store your bookmarks and reading history.
            </li>
            <li>
              <strong>Personalization:</strong> We may use your reading history to provide personalized recommendations and suggestions based on your preferences and interests.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary mt-8">Log Data</h2>
          <p>
            We collect information that your browser sends whenever you visit our Service (“Log Data”). This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Communication</h2>
          <p>
            We may use your email address to send you important updates, newsletters, or notifications related to our services, content, etc. You will have the ability to unsubscribe from these communications at any time.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Data Protection Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>The right to access:</strong> You have the right to request Hifzy for copies of your personal data. We may charge you a small fee for this service.
            </li>
            <li>
              <strong>The right to rectification:</strong> You have the right to request that Hifzy correct any information you believe is inaccurate. You also have the right to request Hifzy to complete the information you believe is incomplete.
            </li>
            <li>
              <strong>The right to erasure:</strong> You have the right to request that Hifzy erase your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to restrict processing:</strong> You have the right to request that Hifzy restrict the processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to object to processing:</strong> You have the right to object to Hifzy’s processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to data portability:</strong> You have the right to request that Hifzy transfer the data that we have collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary mt-8">Data Security</h2>
          <p>
            We take appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard security protocols and employ physical, electronic, and managerial safeguards to ensure the confidentiality and integrity of your data.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Data Analysis</h2>
          <p>
            We use Google Analytics for ensuring that the site continues to work as expected and for knowing which features to prioritize working on, etc. This information is anonymous and we don’t trace it back to any particular individual.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Data Deletion</h2>
          <p>
            To ensure your privacy and control over your personal information, we provide a straightforward account deletion process. When you choose to delete your account, all associated personal data will be automatically and permanently removed from our systems. You can initiate the account deletion by accessing your profile page. Once the deletion is initiated, your personal data will be securely deleted from our servers within a reasonable timeframe.
          </p>

          <h2 className="text-xl font-bold text-primary mt-8">Use of Cookies</h2>
          <p>
            Hifzy employs cookies to enhance your browsing experience, provide personalized content, and analyze website traffic. By accessing and using our website, you consent to the use of cookies in accordance with this Privacy Policy.
          </p>

          <h3 className="text-lg font-bold text-primary mt-6">Types of Cookies We Use:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Necessary Cookies:</strong> These cookies are essential for the proper functioning of our website and enable basic features, such as page navigation and access to secure areas. They do not collect any personally identifiable information. Without these cookies, some parts of the website may not function correctly.
            </li>
            <li>
              <strong>Analytical and Performance Cookies:</strong> We utilize these cookies to gather information about how visitors use our website, including the number of visitors, the pages they visit, and the time spent on each page. This data helps us analyze and improve the performance and functionality of our website. These cookies do not identify you personally; all data is aggregated and anonymous.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-primary mt-8">Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us here. By using our website, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal information as described.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
