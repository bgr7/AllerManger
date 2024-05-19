'use client';
import Link from "next/link";
import React from "react";
import { Mail } from "react-feather"; // Ensure you have react-feather installed

function Page() {
  const handleMailTo = () => {
    window.location.href = "mailto:allermenger@gmail.com";
  };

  return (
    <div className=" absolute top-20 left-0 bg-white w-full p-4 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4 max-w-[600px]">
        <h1 className="text-2xl font-bold">Frequently Asked Questions About the Application</h1>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>1. What is the purpose of this application?</strong>
            <p>The application aims to provide a platform for both customers and store owners to access information about allergen-containing products, manage user accounts, and perform various tasks related to product management and allergy preferences.</p>
          </li>
          <li>
            <strong>2. How does the application work for customers?</strong>
            <p>Customers can use the mobile application to scan product barcodes, view allergen information, save personal preferences, and filter products based on their allergies. Additionally, they can manage their user accounts and access support services.</p>
          </li>
          <li>
            <strong>3. What features are available for store owners?</strong>
            <p>Store owners have access to functions such as adding, editing, and deleting products through the application. They can also manage their accounts and interact with customer feedback.</p>
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-4">Non-Functional Requirements</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>4. How is user security ensured?</strong>
            <p>The application employs robust security measures, including encryption of sensitive data, secure user authentication, and access control mechanisms to protect user information.</p>
          </li>
          <li>
            <strong>5. How is user privacy maintained?</strong>
            <p>User privacy is a top priority. The application adheres to strict data privacy regulations and implements privacy-enhancing technologies to safeguard user data from unauthorized access or misuse.</p>
          </li>
          <li>
            <strong>6. How is system performance optimized?</strong>
            <p>The application is designed to deliver fast and responsive performance. Techniques such as caching, load balancing, and optimization of database queries are employed to ensure a smooth user experience.</p>
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-4">Technical Support</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>7. How can I get technical support?</strong>
            <p>For technical assistance or inquiries, please contact our support team at support@example.com.</p>
          </li>
          <li>
            <strong>8. How is user feedback collected and evaluated?</strong>
            <p>We value user feedback and actively collect it through various channels such as in-app feedback forms, surveys, and user reviews. Feedback is carefully analyzed and used to improve the application's features and usability.</p>
          </li>
        </ul>

        <div className="mt-4">
          <button
            onClick={handleMailTo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center">
            Send an E-mail to Support Center
            <Mail size={24} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
