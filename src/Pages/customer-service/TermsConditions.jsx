import React from 'react';

const TermsConditions = () => {
    const sections = [
        {
            title: "Agreement to Terms",
            content: "By accessing and using Forever.com, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website."
        },
        {
            title: "Account Registration",
            content: "To access certain features of our website, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account."
        },
        {
            title: "Product Information",
            content: "We strive to display accurate product information, including prices and availability. However, we reserve the right to correct any errors and to modify prices without prior notice."
        },
        {
            title: "Order Acceptance",
            content: "All orders are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time."
        },
        {
            title: "Payment Terms",
            content: "Payment is required at the time of order placement. We accept various payment methods as indicated during checkout. All payments are processed securely."
        },
        {
            title: "Intellectual Property",
            content: "All content on this website, including text, graphics, logos, and software, is the property of Forever.com and is protected by intellectual property laws."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

            {/* Introduction */}
            <div className="prose prose-lg mb-12">
                <p className="text-gray-600">
                    Welcome to Forever.com. These Terms and Conditions govern your use of our website and services. 
                    Please read them carefully before using our website.
                </p>
                <p className="text-gray-600 mt-4">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-8">
                {sections.map((section, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                        <p className="text-gray-600">{section.content}</p>
                    </div>
                ))}
            </div>

            {/* Prohibited Activities */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Activities</h2>
                <p className="text-gray-600 mb-4">
                    You agree not to engage in any of the following activities:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Use the website for any illegal purpose</li>
                    <li>Attempt to gain unauthorized access to any part of the website</li>
                    <li>Interfere with the proper functioning of the website</li>
                    <li>Use automated systems or software to extract data</li>
                    <li>Engage in any activity that disrupts or interferes with the website</li>
                </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-600">
                    Forever.com shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of or inability to use the website.
                </p>
            </div>

            {/* Changes to Terms */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-600">
                    We reserve the right to modify these terms at any time. We will notify users of any 
                    material changes by posting the new terms on this page.
                </p>
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms and Conditions, please contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Contact Us
                    </a>
                    <a
                        href="mailto:legal@forever.com"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Email: legal@forever.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions; 